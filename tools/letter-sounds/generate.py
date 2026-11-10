"""Generate letter-sound takes with a speech model that runs on this computer: Piper or Kokoro.

    .venv/bin/python generate.py              # Piper, every letter in letters.py
    .venv/bin/python generate.py M B          # just these letters
    .venv/bin/python generate.py --kokoro     # Kokoro instead

Writes takes/<lang>/<LETTER>/<n>.wav, plus a Mac-voice reference take, and takes/index.html,
a page to listen to them all. Nothing here goes into the app; only the takes you pick are copied there later.
"""
import html
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

from letters import LETTERS, MAC_TEXT, MAC_VOICES, PIPER_LETTERS, PIPER_VOICES, VOICES

HERE = Path(__file__).parent
TAKES = HERE / "takes"
SPEED = 0.6  # slower than normal speech, so a single sound lasts long enough to hear
PEAK = 0.85  # loudest point of every take, out of 1.0
PAD_SECONDS = 0.15  # silence before and after, so the start isn't clipped when played
G2P_LANG = {"en": "en-gb", "it": "it"}  # for "text:" candidates, how the model reads the text


def finish(samples: np.ndarray, rate: int) -> np.ndarray:
    # Level every take to the same peak (some voices come out loud enough to crackle),
    # then pad with a little silence.
    samples = samples / max(np.abs(samples).max(), 1e-6) * PEAK
    pad = np.zeros(int(rate * PAD_SECONDS), dtype=samples.dtype)
    return np.concatenate([pad, samples, pad])


def kokoro_takes(lang: str, letter: str):
    """Yields (voice, what was said, samples, rate) for each Kokoro candidate."""
    global _kokoro
    if "_kokoro" not in globals():
        _kokoro = Kokoro(str(HERE / "models/kokoro-v1.0.onnx"), str(HERE / "models/voices-v1.0.bin"))
    for voice in VOICES[lang]:
        for candidate in LETTERS[lang][letter]:
            if candidate.startswith("text:"):
                samples, rate = _kokoro.create(candidate[5:], voice=voice, speed=SPEED, lang=G2P_LANG[lang])
                yield voice, candidate[5:], samples, rate
            else:
                # is_phonemes: give the model the sound itself, instead of text it would have to guess.
                samples, rate = _kokoro.create(candidate, voice=voice, speed=SPEED, is_phonemes=True)
                yield voice, f"/{candidate}/", samples, rate


def piper_takes(lang: str, letter: str):
    """Yields (voice, what was said, samples, rate) for each Piper candidate."""
    from piper import PiperVoice, SynthesisConfig

    # length_scale > 1 is slower: single sounds need time to be heard.
    config = SynthesisConfig(length_scale=1.8)
    for name in PIPER_VOICES[lang]:
        voice = PiperVoice.load(HERE / "models/piper" / f"{name}.onnx")
        for candidate in PIPER_LETTERS[lang][letter]:
            chunks = list(voice.synthesize(candidate, syn_config=config))
            samples = np.concatenate([c.audio_float_array for c in chunks])
            yield name.split("-")[1], candidate, samples, chunks[0].sample_rate


def main(only: set[str], engine: str) -> None:
    takes = []  # what the review page lists
    letters_by_lang = PIPER_LETTERS if engine == "piper" else LETTERS
    make_takes = piper_takes if engine == "piper" else kokoro_takes

    for lang, letters in letters_by_lang.items():
        for letter in letters:
            if only and letter not in only:
                continue
            folder = TAKES / lang / letter
            folder.mkdir(parents=True, exist_ok=True)
            for old in folder.glob("*.wav"):
                old.unlink()
            n = 0
            for voice, said, samples, rate in make_takes(lang, letter):
                n += 1
                add_take(takes, lang, letter, n, voice, said, finish(samples, rate), rate)

            # The Mac voice saying the same letter, for comparison only.
            n += 1
            path = folder / f"{n}.wav"
            subprocess.run(["say", "-v", MAC_VOICES[lang], "-r", "120", "--file-format=WAVE",
                            "--data-format=LEI16@24000", "-o", str(path), MAC_TEXT[lang][letter]], check=True)
            samples, rate = sf.read(path, dtype="float32")
            add_take(takes, lang, letter, n, f"Mac {MAC_VOICES[lang]}", MAC_TEXT[lang][letter],
                     finish(samples, rate), rate, reference=True)

    write_review_page(takes, letters_by_lang, engine)
    (TAKES / "takes.json").write_text(json.dumps(takes, indent=1, ensure_ascii=False))


def add_take(takes, lang, letter, n, voice, said, samples, rate, reference=False):
    path = TAKES / lang / letter / f"{n}.wav"
    sf.write(path, samples, rate)
    seconds = round(len(samples) / rate, 2)
    takes.append({"lang": lang, "letter": letter, "n": n, "voice": voice, "said": said,
                  "file": str(path.relative_to(TAKES)), "seconds": seconds, "reference": reference})
    print(f"{lang} {letter} take {n}: {voice} {said} ({seconds}s)")


def write_review_page(takes: list[dict], letters_by_lang: dict, engine: str) -> None:
    rows = []
    for lang in letters_by_lang:
        rows.append(f"<h2>{'English' if lang == 'en' else 'Italian'}</h2>")
        for letter in letters_by_lang[lang]:
            mine = [t for t in takes if t["lang"] == lang and t["letter"] == letter]
            if not mine:
                continue
            buttons = "".join(
                f'<button class="{"ref" if t["reference"] else ""}" onclick="new Audio(\'{t["file"]}?{t["seconds"]}\').play()">'
                f'▶ {t["n"]}<small>{html.escape(t["voice"])} · {html.escape(t["said"])}</small></button>'
                for t in mine
            )
            rows.append(f'<div class="row"><span class="letter">{letter}</span>{buttons}</div>')

    (TAKES / "index.html").write_text(f"""<!doctype html>
<meta charset="utf-8"><title>Letter sound takes</title>
<style>
  body {{ font: 16px system-ui; margin: 24px; background: #fffdf8; color: #1d1b20; }}
  .row {{ display: flex; align-items: center; gap: 8px; margin: 8px 0; flex-wrap: wrap; }}
  .letter {{ font: 800 40px ui-rounded, system-ui; width: 56px; }}
  button {{ font: inherit; padding: 8px 12px; border-radius: 10px; border: 1px solid #d9d6dd; background: #fff; cursor: pointer; }}
  button.ref {{ border-style: dashed; background: #f3f0ea; }}
  small {{ display: block; color: #8a8590; font-size: 12px; }}
</style>
<h1>Letter sound takes: {engine.capitalize()}</h1>
<p>Click to listen. The dashed button on each row is the Mac voice, for comparison only (it can't be shipped).
Note the take number you like best for each letter.</p>
{''.join(rows)}
""")


if __name__ == "__main__":
    args = sys.argv[1:]
    main({a.upper() for a in args if not a.startswith("--")}, "kokoro" if "--kokoro" in args else "piper")
