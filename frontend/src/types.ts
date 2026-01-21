export interface ConjugationForm {
    yo: string | null;
    tú: string | null;
    "él/ella/usted": string | null;
    "nosotros/nosotras": string | null;
    "vosotros/vosotras": string | null;
    "ellos/ellas/ustedes": string | null;
}

export interface TenseConjugations {
    forms: ConjugationForm;
}

export interface VerbConjugations {
    verb: string;
    tenses: Record<string, TenseConjugations>;
}
