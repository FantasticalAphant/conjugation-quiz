from fastapi import APIRouter, HTTPException
from my_personal_spanish_conjugation_generator import Conjugator

from api.models import ConjugationForm, TenseConjugations, VerbConjugations

router = APIRouter()

conjugator = Conjugator()  # this class handles all the conjugation logic


@router.get("/verbs/{verb_name}", response_model=VerbConjugations)
async def get_verb_conjugations(verb_name: str) -> VerbConjugations:
    """
    Retrieve conjugations for a given Spanish verb, grouped by tense.
    """
    all_conjugations = conjugator.get_all_conjugations(verb=verb_name)
    if not all_conjugations:
        raise HTTPException(status_code=404, detail="Verb not found")

    tenses = {
        tense: TenseConjugations(forms=ConjugationForm(**forms))
        for tense, forms in all_conjugations.items()
    }

    return VerbConjugations(verb=verb_name, tenses=tenses)


@router.get("/verbs/{verb_name}/{tense}", response_model=TenseConjugations)
async def get_tense_conjugations(verb_name: str, tense: str) -> TenseConjugations:
    """
    Retrieve conjugations for a specific tense of a given Spanish verb.
    """
    all_conjugations = conjugator.get_all_conjugations(verb=verb_name)
    if not all_conjugations:
        raise HTTPException(status_code=404, detail="Verb not found")

    tense_conjugations = all_conjugations.get(tense)
    if not tense_conjugations:
        raise HTTPException(
            status_code=404, detail=f"Tense '{tense}' not found for verb '{verb_name}'"
        )

    return TenseConjugations(forms=ConjugationForm(**tense_conjugations))
