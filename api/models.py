from pydantic import BaseModel, Field


class ConjugationForm(BaseModel):
    form_1s: str | None = Field(None, alias="yo")
    form_2s: str | None = Field(None, alias="tú")
    form_3s: str | None = Field(None, alias="él/ella/usted")
    form_1p: str | None = Field(None, alias="nosotros/nosotras")
    form_2p: str | None = Field(None, alias="vosotros/vosotras")
    form_3p: str | None = Field(None, alias="ellos/ellas/ustedes")


class TenseConjugations(BaseModel):
    # This model will dynamically store the conjugations for a tense
    # where keys are moods/tenses and values are ConjugationForm
    # For example:
    # {
    #   "indicative_present": {"yo": "hablo", ...},
    #   "subjunctive_present": {"yo": "hable", ...}
    # }

    # We can use a generic dictionary here, but for clearer API documentation
    # it's better to explicitly define common ones if known, or allow dynamic keys.
    # For now, let's keep it flexible.

    forms: ConjugationForm


class VerbConjugations(BaseModel):
    verb: str
    tenses: dict[
        str, TenseConjugations
    ]  # Keys will be tense names (e.g., "present", "preterite")
