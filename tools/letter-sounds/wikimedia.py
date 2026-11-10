"""Fetch real recordings of letter sounds from Wikimedia Commons and put them on the review page.

    .venv/bin/python wikimedia.py

These are the recordings Wikipedia uses to demonstrate each sound (CC BY-SA: free to ship in the
app with a credit). Vowels are recorded on their own; consonants inside syllables ("sa asa"),
so each consonant also gets a take cut down to its first syllable.

Writes takes/ (same review page as generate.py) and takes/credits.json, who recorded what.
"""
import io
import json
import re
import urllib.parse
import urllib.request

import numpy as np
import soundfile as sf

from generate import TAKES, add_take, finish, write_review_page

# Wikimedia asks scripts to say who they are.
USER_AGENT = "TinyType-letter-sounds/0.1 (https://github.com/albey/tinytype)"

# Letter -> Commons file of its sound. The sounds are the same in both languages, except where noted.
FILES = {
    "en": {
        "A": ["Near-open_front_unrounded_vowel.ogg", "Open_front_unrounded_vowel.ogg"],  # æ (apple), a (Alberto)
        "B": ["Voiced_bilabial_plosive.ogg"],
        "M": ["Bilabial_nasal.ogg"],
        "O": ["Open_back_rounded_vowel.ogg", "Close-mid_back_rounded_vowel.ogg"],  # ɒ (octopus), o
        "S": ["Voiceless_alveolar_sibilant.ogg"],
        "T": ["Voiceless_alveolar_plosive.ogg"],
    },
    "it": {
        "A": ["Open_front_unrounded_vowel.ogg"],
        "B": ["Voiced_bilabial_plosive.ogg"],
        "M": ["Bilabial_nasal.ogg"],
        "O": ["Close-mid_back_rounded_vowel.ogg", "Open-mid_back_rounded_vowel.ogg"],  # o (sole), ɔ (ora)
        "S": ["Voiceless_alveolar_sibilant.ogg"],
        "T": ["Voiceless_alveolar_plosive.ogg"],
    },
}


def get(url: str) -> bytes:
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": USER_AGENT})).read()


def commons_file(name: str) -> dict:
    """The file's download URL, author and licence, from the Commons API."""
    query = urllib.parse.urlencode({
        "action": "query", "titles": f"File:{name}", "prop": "imageinfo", "format": "json",
        "iiprop": "url|extmetadata", "iiextmetadatafilter": "Artist|LicenseShortName|ImageDescription",
    })
    page = next(iter(json.loads(get(f"https://commons.wikimedia.org/w/api.php?{query}"))["query"]["pages"].values()))
    info = page["imageinfo"][0]
    meta = {k: re.sub("<[^>]+>", "", v["value"]).strip() for k, v in info["extmetadata"].items()}
    return {"file": name, "url": info["url"], "page": info["descriptionurl"],
            "author": meta.get("Artist", ""), "license": meta.get("LicenseShortName", ""),
            "description": meta.get("ImageDescription", "")}


def first_syllable(samples: np.ndarray, rate: int) -> np.ndarray:
    """The first stretch of sound, up to the first pause (e.g. "sa" out of "sa asa")."""
    window = int(rate * 0.02)
    loud = np.array([np.abs(samples[i:i + window]).max() for i in range(0, len(samples), window)])
    on = loud > loud.max() * 0.08
    start = int(np.argmax(on))
    end = start
    quiet = 0
    for i in range(start, len(on)):
        quiet = 0 if on[i] else quiet + 1
        if quiet * 0.02 >= 0.12:  # a pause of 120 ms ends the syllable
            break
        end = i
    return samples[start * window:(end + 1) * window]


def main() -> None:
    takes, credits, cache = [], {}, {}
    for lang, letters in FILES.items():
        for letter, names in letters.items():
            folder = TAKES / lang / letter
            folder.mkdir(parents=True, exist_ok=True)
            for old in folder.glob("*.wav"):
                old.unlink()
            n = 0
            for name in names:
                if name not in cache:
                    credits[name] = commons_file(name)
                    samples, rate = sf.read(io.BytesIO(get(credits[name]["url"])), dtype="float32")
                    cache[name] = (samples.mean(axis=1) if samples.ndim > 1 else samples, rate)
                    print(f"{name}: {credits[name]['license']}, {credits[name]['author'][:40]} | {credits[name]['description'][:70]}")
                samples, rate = cache[name]
                label = name.removesuffix(".ogg").replace("_", " ")
                n += 1
                add_take(takes, lang, letter, n, "Wikimedia", f"{label} (full)", finish(samples, rate), rate)
                if len(samples) / rate > 1.0:  # recorded inside syllables: also offer the first one alone
                    n += 1
                    add_take(takes, lang, letter, n, "Wikimedia", f"{label} (first syllable)",
                             finish(first_syllable(samples, rate), rate), rate)

    write_review_page(takes, FILES, "Wikimedia recordings")
    (TAKES / "takes.json").write_text(json.dumps(takes, indent=1, ensure_ascii=False))
    (TAKES / "credits.json").write_text(json.dumps(credits, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
