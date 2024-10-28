import json
from typing import Dict

translations: Dict[str, Dict] = {}

def load_translations(language: str) -> Dict:
    """
    Load the translation file based on the language code.
    """
    if language in translations:
        return translations[language]

    try:
        with open(f"./app/locales/{language}.json", "r", encoding="utf-8") as f:
            translations[language] = json.load(f)
    except FileNotFoundError:
        with open("./app/locales/en.json", "r", encoding="utf-8") as f:
            translations[language] = json.load(f)

    return translations[language]


def translate(key: str, language: str = "en") -> str:
    """
    Translate a given key to the specified language.
    """
    translation = load_translations(language)
    return translation.get(key, key)  
