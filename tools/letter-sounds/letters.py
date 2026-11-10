"""The sound of each letter, and the ways to try saying it.

Each candidate is either IPA (the International Phonetic Alphabet), given to the model as the
sound itself, or "text:..." for ordinary text the model reads its own way.

IPA symbols used:
  ˈ   stress: "this is the important sound, say it clearly"
  ː   longer ("mːː" is a held "mmm")
  ʌ   the short "uh" in "cup", the little vowel needed to hear a b or t at all
  !   said with energy rather than mumbled
"""

# Piper voices to try (files in models/piper). Piper reads text through eSpeak, or takes
# IPA directly when written as [[ ... ]].
PIPER_VOICES = {
    "en": ["en_GB-cori-high", "en_GB-alba-medium", "en_GB-jenny_dioco-medium"],
    "it": ["it_IT-paola-medium", "it_IT-riccardo-x_low"],
}

PIPER_LETTERS = {
    "en": {
        "A": ["[[ ˈaː ]]", "ah!"],
        "B": ["[[ ˈbʌ ]]", "buh!"],
        "M": ["[[ ˈmːːː ]]", "mmmm!"],
        "O": ["[[ ˈɒː ]]", "o!"],
        "S": ["[[ ˈsːːː ]]", "sssss!"],
        "T": ["[[ ˈtʌ ]]", "tuh!"],
    },
    "it": {
        "A": ["[[ ˈaː ]]", "a!"],
        "B": ["[[ ˈbə ]]", "b!"],
        "M": ["[[ ˈmːːː ]]", "mmm!"],
        "O": ["[[ ˈoː ]]", "o!"],
        "S": ["[[ ˈsːːː ]]", "sss!"],
        "T": ["[[ ˈtə ]]", "t!"],
    },
}

# One voice per language, so every letter sounds like the same person.
# "bf" = British female, "if" = Italian female.
VOICES = {
    "en": ["bf_emma"],
    "it": ["if_sara"],
}

# The Mac voice each language is compared against on the review page (reference only:
# Apple's licence doesn't allow shipping recordings of its voices).
MAC_VOICES = {"en": "Daniel", "it": "Alice"}

# What to give the Mac voice: it reads text, so these are plain spellings.
MAC_TEXT = {
    "en": {"A": "ah", "B": "buh", "M": "mmm", "O": "o", "S": "sss", "T": "tuh"},
    "it": {"A": "a", "B": "bə", "M": "mmm", "O": "o", "S": "sss", "T": "tə"},
}

LETTERS = {
    "en": {
        "A": ["ˈaːː!", "ˈæː!", "text:ah!"],  # "a" as in Alberto; "æ" as in apple
        "B": ["ˈbʌ!", "ˈbʌː", "text:buh!"],
        "M": ["ˈmːːːː", "ˈmːːːː!", "text:mmmm!"],
        "O": ["ˈɒː!", "ˈoː!", "text:oh!"],
        "S": ["ˈsːːːː", "ˈsːːːː!", "text:sssss!"],
        "T": ["ˈtʌ!", "ˈtʌː", "text:tuh!"],
    },
    "it": {
        "A": ["ˈaːː!", "ˈaː", "ˈaːː"],
        "B": ["ˈbʌ!", "ˈbɐ!", "ˈbəː"],
        "M": ["ˈmːːːː", "ˈmːːːː!", "ˈmːː"],
        "O": ["ˈoːː!", "ˈɔːː!", "ˈoː"],
        "S": ["ˈsːːːː", "ˈsːːːː!", "ˈsːː"],
        "T": ["ˈtʌ!", "ˈtɐ!", "ˈtəː"],
    },
}
