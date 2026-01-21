import random

from fastapi import APIRouter, HTTPException, Request
from my_personal_spanish_conjugation_generator import Conjugator

from api.models import ConjugationForm, TenseConjugations, VerbConjugations

router = APIRouter()

conjugator = Conjugator()  # this class handles all the conjugation logic


@router.get("/verbs/random", response_model=VerbConjugations)
async def get_random_verb_conjugation(request: Request) -> VerbConjugations:
    """
    Retrieve conjugations for a random Spanish verb.
    """
    verb_list: list[str] = request.app.state.verb_list
    if not verb_list:
        raise HTTPException(status_code=500, detail="Verb list is empty or not loaded.")

    random_verb_name = random.choice(verb_list)

    all_conjugations = conjugator.get_all_conjugations(verb=random_verb_name)
    if not all_conjugations:
        raise HTTPException(
            status_code=404,
            detail=f"Conjugations not found for randomly selected verb: {random_verb_name}. "
            "This might indicate an issue with the conjugation library or verb list.",
        )

    tenses = {
        tense: TenseConjugations(forms=ConjugationForm(**forms))
        for tense, forms in all_conjugations.items()
    }

    return VerbConjugations(verb=random_verb_name, tenses=tenses)


@router.get("/verbs/{verb_name}/{tense}", response_model=TenseConjugations)
async def get_tense_conjugations(
    verb_name: str, tense: str, request: Request
) -> TenseConjugations:
    """
    Retrieve conjugations for a specific tense of a given Spanish verb.
    """
    processed_verb_name = verb_name.lower()

    verb_list: list[str] = request.app.state.verb_list

    # Optional: Check if the verb exists in our loaded list
    if processed_verb_name not in verb_list:
        raise HTTPException(status_code=404, detail="Verb not found in the known list.")

    all_conjugations = conjugator.get_all_conjugations(verb=processed_verb_name)
    if not all_conjugations:
        raise HTTPException(status_code=404, detail="Conjugations not found for verb.")

    tense_conjugations = all_conjugations.get(tense)
    if not tense_conjugations:
        raise HTTPException(
            status_code=404, detail=f"Tense '{tense}' not found for verb '{verb_name}'"
        )

    return TenseConjugations(forms=ConjugationForm(**tense_conjugations))


@router.get("/verbs/{verb_name}", response_model=VerbConjugations)
async def get_verb_conjugations(verb_name: str, request: Request) -> VerbConjugations:
    """
    Retrieve conjugations for a given Spanish verb, grouped by tense.
    """
    processed_verb_name = verb_name.lower()

    verb_list: list[str] = request.app.state.verb_list

    # Optional: Check if the verb exists in our loaded list
    if processed_verb_name not in verb_list:
        raise HTTPException(status_code=404, detail="Verb not found in the known list.")

    all_conjugations = conjugator.get_all_conjugations(verb=processed_verb_name)
    if not all_conjugations:
        raise HTTPException(status_code=404, detail="Conjugations not found for verb.")

    tenses = {
        tense: TenseConjugations(forms=ConjugationForm(**forms))
        for tense, forms in all_conjugations.items()
    }

    return VerbConjugations(verb=verb_name, tenses=tenses)
