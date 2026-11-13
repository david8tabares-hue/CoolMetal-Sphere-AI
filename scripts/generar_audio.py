#!/usr/bin/env python3
"""
Genera la música y los efectos de sonido del video "Sobrecarga progresiva".
Música original sintetizada (sin licencias de terceros).

  python3 scripts/generar_audio.py                    # SobrecargaProgresiva (+ efectos)
  python3 scripts/generar_audio.py --perfil musculos  # MusculosSentadilla
  python3 scripts/generar_audio.py --perfil press     # RangoMovimientoPressBanca

Salida en public/audio/: musica.mp3 / musica-musculos.mp3 y (perfil sobrecarga)
whoosh.mp3, golpe.mp3, pop.mp3
Requiere numpy y scipy. Si cambias la duración de un video o sus escenas,
ajusta su entrada en PERFILES y vuelve a ejecutarlo.
"""
import argparse
import os
import subprocess
import wave

import numpy as np
from scipy.signal import butter, sosfilt, sosfilt_zi

SR = 44100
BPM = 120
BEAT = 60 / BPM          # 0,5 s → 15 frames a 30 fps: los cortes caen en el beat
BAR = 4 * BEAT
# Secciones en segundos de video: a = ritmo base, lleno = todo, ligero = sin bajo, final = cierre.
PERFILES = {
    "sobrecarga": dict(duracion=38.0, drop=3.0, a=(3, 8), lleno=(8, 26), ligero=(26, 32), final=(32, 38),
                       salida="musica", efectos=True),
    "musculos": dict(duracion=34.0, drop=3.0, a=(3, 6), lleno=(6, 29), ligero=None, final=(29, 34),
                     salida="musica-musculos", efectos=False),
    "press": dict(duracion=34.0, drop=3.0, a=(3, 10), lleno=(10, 22), ligero=(22, 29), final=(29, 34),
                  salida="musica-press", efectos=False),
}
_args = argparse.ArgumentParser()
_args.add_argument("--perfil", choices=PERFILES, default="sobrecarga")
PERFIL = PERFILES[_args.parse_args().perfil]
DURACION = PERFIL["duracion"]  # duración total del video (s)
DROP = PERFIL["drop"]          # fin del gancho: aquí entra el ritmo
PREVIA = 2 * BAR - DROP  # la subida empieza 1 s antes del final y continúa en el gancho (bucle)

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SALIDA = os.path.join(RAIZ, "public", "audio")
rng = np.random.default_rng(26)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def lp(x, f, orden=2):
    return sosfilt(butter(orden, f, "low", fs=SR, output="sos"), x)


def hp(x, f, orden=2):
    return sosfilt(butter(orden, f, "high", fs=SR, output="sos"), x)


def bp(x, f1, f2, orden=2):
    return sosfilt(butter(orden, [f1, f2], "band", fs=SR, output="sos"), x)


def lp_variable(x, corte, bloque=512):
    """Low-pass con frecuencia de corte variable en el tiempo (por bloques)."""
    y = np.zeros_like(x)
    zi = None
    for i in range(0, len(x), bloque):
        sos = butter(2, float(np.clip(corte[i], 40, SR / 2.2)), "low", fs=SR, output="sos")
        if zi is None:
            zi = sosfilt_zi(sos) * 0
        y[i : i + bloque], zi = sosfilt(sos, x[i : i + bloque], zi=zi)
    return y


def sierra(f, n, fase=0.0):
    t = np.arange(n) / SR
    return 2 * ((f * t + fase) % 1) - 1


# ── Instrumentos ──────────────────────────────────────────────
def kick():
    n = int(0.42 * SR)
    t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t / 0.035)
    cuerpo = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16)
    click = hp(rng.standard_normal(n), 3000) * np.exp(-t / 0.004) * 0.25
    return np.tanh(1.6 * (cuerpo + click))


def clap():
    n = int(0.22 * SR)
    t = np.arange(n) / SR
    ruido = bp(rng.standard_normal(n), 900, 3500)
    env = np.exp(-t / 0.06)
    for d in (0.0, 0.011, 0.022):  # tres "palmadas" seguidas
        env += (t >= d) * np.exp(-np.maximum(t - d, 0) / 0.008) * 0.6
    return ruido * env * 0.5


def hat(largo=0.035):
    n = int((largo * 5) * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 7000) * np.exp(-t / largo)


def crash():
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    return hp(rng.standard_normal(n), 4000) * np.exp(-t / 0.7) * 0.6


def bajo(f, largo=0.22):
    n = int(largo * SR)
    t = np.arange(n) / SR
    x = sierra(f, n) + 0.5 * np.sin(2 * np.pi * f * t)
    env = np.minimum(1, t / 0.004) * np.exp(-t / 0.18)
    return lp(x, 420) * env


def pluck(f):
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    x = sierra(f, n) * 0.6 + sierra(f * 1.005, n, 0.3) * 0.4
    return lp(x, 3200) * np.minimum(1, t / 0.002) * np.exp(-t / 0.09)


def pad(notas, largo):
    n = int(largo * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for m in notas:
        for d in (-0.12, -0.05, 0.0, 0.05, 0.12):  # supersaw
            x += sierra(hz(m + d), n, rng.random())
    env = np.minimum(1, t / 0.03) * np.minimum(1, (largo - t) / 0.05)
    return x * env / (len(notas) * 5)


# ── Arreglo (tiempo musical u = t + PREVIA; u=4 s es el drop) ──
ACORDES = [  # i - VI - III - VII en La menor
    ([57, 60, 64], 33),  # Am
    ([57, 60, 65], 29),  # F
    ([55, 60, 64], 36),  # C
    ([55, 59, 62], 31),  # G
]
# Tiempos de video → tiempo musical (u = t + PREVIA)
U = lambda t: t + PREVIA
S_A = tuple(map(U, PERFIL["a"]))
S_FULL = tuple(map(U, PERFIL["lleno"]))
S_EJ = tuple(map(U, PERFIL["ligero"])) if PERFIL["ligero"] else (0, 0)
S_FIN = (U(PERFIL["final"][0]), DURACION)
dentro = lambda u, s: s[0] <= u < s[1] - 1e-9

N = int(DURACION * SR)
COLA = int(3 * SR)
pistas = {k: np.zeros(N + COLA) for k in ["kick", "clap", "hat", "open", "bajo", "pad", "arp", "fx"]}


def poner(pista, x, u, g=1.0):
    i = int(round(u * SR))
    pistas[pista][i : i + len(x)] += x[: max(0, N + COLA - i)] * g


K, CL, CR = kick(), clap(), crash()
kicks = []
for k in range(int(DURACION / BEAT)):
    u = k * BEAT
    ritmo = any(dentro(u, s) for s in (S_A, S_FULL, S_EJ, S_FIN))
    lleno = dentro(u, S_FULL) or dentro(u, S_FIN)
    # Hueco de 2 beats antes del cierre para que la subida respire.
    hueco = S_FIN[0] - 2 * BEAT <= u < S_FIN[0]
    if ritmo and not hueco:
        poner("kick", K, u, 0.95)
        kicks.append(u)
        if k % 4 in (1, 3):
            poner("clap", CL, u, 0.55 if lleno else 0.4)
        poner("hat", hat(), u + BEAT / 2, 0.16)
        if lleno:
            poner("open", hat(0.09), u + BEAT / 2, 0.11)
            for s in (0.25, 0.75):
                poner("hat", hat(0.02), u + s * BEAT, 0.06)
        if not dentro(u, S_EJ):
            raiz = ACORDES[int(u // BAR) % 4][1]
            poner("bajo", bajo(hz(raiz)), u + BEAT / 2, 0.55)
            if lleno:
                poner("bajo", bajo(hz(raiz + 12), 0.12), u + 0.75 * BEAT, 0.25)

# Pad: un acorde por compás, toda la canción.
for b in range(int(np.ceil(DURACION / BAR))):
    notas, _ = ACORDES[b % 4]
    poner("pad", pad(notas, BAR), b * BAR, 1.0)

# Arpegio en semicorcheas (con eco de corchea con puntillo).
PATRON = [0, 1, 2, 3, 2, 1, 2, 3]
for k in range(int(DURACION / (BEAT / 4))):
    u = k * BEAT / 4
    if dentro(u, S_FULL) or dentro(u, S_EJ) or dentro(u, S_FIN):
        notas, _ = ACORDES[int(u // BAR) % 4]
        tonos = notas + [notas[0] + 12]
        m = tonos[PATRON[k % 8]] + 12
        g = 0.75 if k % 4 == 0 else 0.5
        poner("arp", pluck(hz(m)), u, g)

# Subidas (ruido + tono ascendente) y redobles antes de cada drop.
def subida(u0, u1, g=1.0):
    n = int((u1 - u0) * SR)
    t = np.linspace(0, 1, n)
    ruido = lp_variable(hp(rng.standard_normal(n), 500), 600 + 9000 * t**2) * t**2
    tono = np.sin(2 * np.pi * np.cumsum(200 + 900 * t**2) / SR) * t**3 * 0.25
    poner("fx", (ruido * 0.5 + tono) * g, u0)


def redoble(u0, u1):
    u = u0
    while u < u1:
        p = (u - u0) / (u1 - u0)
        poner("clap", clap(), u, 0.12 + 0.35 * p)
        u += BEAT / 4 if p < 0.5 else BEAT / 8


subida(0, S_A[0])
redoble(S_A[0] - BAR / 2, S_A[0])
subida(S_FIN[0] - BAR, S_FIN[0], 0.8)
redoble(S_FIN[0] - BEAT * 2, S_FIN[0])
for u in (S_A[0], S_FULL[0], S_FIN[0]):
    poner("fx", CR, u, 0.35)

# ── Mezcla ────────────────────────────────────────────────────
n_tot = N + COLA
u_eje = np.arange(n_tot) / SR
# Filtro del pad: se abre durante la subida, algo más cerrado en el ejemplo.
corte = np.where(u_eje < S_A[0], 300 + 2600 * (u_eje / S_A[0]) ** 2, 3000)
corte = np.where((u_eje >= S_EJ[0]) & (u_eje < S_EJ[1]), 1800, corte)
pistas["pad"] = lp_variable(pistas["pad"], corte)
# Sidechain: el kick "bombea" pad, bajo y arpegio.
sc = np.ones(n_tot)
for u in kicks:
    i = int(u * SR)
    n = min(int(BEAT * SR), n_tot - i)
    sc[i : i + n] = np.minimum(sc[i : i + n], 1 - 0.65 * np.exp(-np.arange(n) / (0.09 * SR)))
for p in ("pad", "bajo", "arp"):
    pistas[p] *= sc

niveles = {"kick": 0.9, "clap": 0.5, "hat": 0.6, "open": 0.6, "bajo": 0.8, "pad": 0.55, "arp": 0.32, "fx": 0.45}
paneo = {"hat": 0.25, "open": -0.25, "arp": 0.0}
L = np.zeros(n_tot)
R = np.zeros(n_tot)
for k, x in pistas.items():
    p = paneo.get(k, 0.0)
    L += x * niveles[k] * np.sqrt(0.5 * (1 - p))
    R += x * niveles[k] * np.sqrt(0.5 * (1 + p))
# Arpegio en estéreo: eco de corchea con puntillo a cada lado.
eco = int(0.75 * BEAT * SR)
arp = pistas["arp"] * niveles["arp"]
L[eco:] += arp[:-eco] * 0.3
R[2 * eco :] += arp[: -2 * eco] * 0.2

mix = np.stack([L, R], axis=1)
# Bucle perfecto: la cola que pasa del final se suma al principio.
mix[:COLA] += mix[N:]
mix = mix[:N]
# Del tiempo musical al tiempo del video (u = t + PREVIA).
mix = np.roll(mix, -int(PREVIA * SR), axis=0)
mix = np.tanh(1.2 * mix / np.max(np.abs(mix))) / np.tanh(1.2) * 0.89


# ── Efectos sueltos (los coloca Remotion en los frames de impacto) ──
def whoosh():
    n = int(0.55 * SR)
    t = np.linspace(0, 1, n)
    env = np.sin(np.pi * np.clip(t / 0.95, 0, 1)) ** 2
    x = lp_variable(hp(rng.standard_normal(n), 300), 500 + 6000 * np.sin(np.pi * t))
    return x * env


def golpe():
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(38 + 70 * np.exp(-t / 0.05)) / SR) * np.exp(-t / 0.22)
    ruido = lp(rng.standard_normal(n), 1800) * np.exp(-t / 0.03) * 0.5
    return np.tanh(2 * (sub + ruido))


def pop():
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = 700 + 900 * (1 - np.exp(-t / 0.02))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035)


def guardar(nombre, x):
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    x = x / np.max(np.abs(x)) * 0.89
    wav = os.path.join(SALIDA, nombre + ".wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())
    mp3 = os.path.join(SALIDA, nombre + ".mp3")
    subprocess.run(
        ["npx", "remotion", "ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "192k", mp3],
        check=True,
        cwd=RAIZ,
    )
    os.remove(wav)
    print("✔", os.path.relpath(mp3, RAIZ))


os.makedirs(SALIDA, exist_ok=True)
guardar(PERFIL["salida"], mix)
if PERFIL["efectos"]:
    guardar("whoosh", whoosh())
    guardar("golpe", golpe())
    guardar("pop", pop())
