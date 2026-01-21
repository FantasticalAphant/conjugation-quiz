export const regularConjugations = {
    indicative: [
        {
            tense: "Present",
            endings: {
                ar: {
                    singular: ["o", "as", "a"],
                    plural: ["amos", "áis", "an"],
                },
                er: {
                    singular: ["o", "es", "e"],
                    plural: ["emos", "éis", "en"],
                },
                ir: {
                    singular: ["o", "es", "e"],
                    plural: ["imos", "ís", "en"],
                },
            },
        },
        {
            tense: "Preterite",
            endings: {
                ar: {
                    singular: ["é", "aste", "ó"],
                    plural: ["amos", "asteis", "aron"],
                },
                er: {
                    singular: ["í", "iste", "ió"],
                    plural: ["imos", "isteis", "ieron"],
                },
                ir: {
                    singular: ["í", "iste", "ió"],
                    plural: ["imos", "isteis", "ieron"],
                },
            },
        },
        {
            tense: "Imperfect",
            endings: {
                ar: {
                    singular: ["aba", "abas", "aba"],
                    plural: ["ábamos", "abais", "aban"],
                },
                er: {
                    singular: ["ía", "ías", "ía"],
                    plural: ["íamos", "íais", "ían"],
                },
                ir: {
                    singular: ["ía", "ías", "ía"],
                    plural: ["íamos", "íais", "ían"],
                },
            },
        },
        {
            tense: "Future",
            endings: {
                ar: {
                    singular: ["é", "ás", "á"],
                    plural: ["emos", "éis", "án"],
                },
                er: {
                    singular: ["é", "ás", "á"],
                    plural: ["emos", "éis", "án"],
                },
                ir: {
                    singular: ["é", "ás", "á"],
                    plural: ["emos", "éis", "án"],
                },
            },
        },
        {
            tense: "Conditional",
            endings: {
                ar: {
                    singular: ["ía", "ías", "ía"],
                    plural: ["íamos", "íais", "ían"],
                },
                er: {
                    singular: ["ía", "ías", "ía"],
                    plural: ["íamos", "íais", "ían"],
                },
                ir: {
                    singular: ["ía", "ías", "ía"],
                    plural: ["íamos", "íais", "ían"],
                },
            },
        },
    ],
    subjunctive: [
        {
            tense: "Present",
            endings: {
                ar: {
                    singular: ["e", "es", "e"],
                    plural: ["emos", "éis", "en"],
                },
                er: {
                    singular: ["a", "as", "a"],
                    plural: ["amos", "áis", "an"],
                },
                ir: {
                    singular: ["a", "as", "a"],
                    plural: ["amos", "áis", "an"],
                },
            },
        },
        {
            tense: "Imperfect",
            endings: {
                ar: {
                    singular: ["ara", "aras", "ara"],
                    plural: ["áramos", "arais", "aran"],
                },
                er: {
                    singular: ["iera", "ieras", "iera"],
                    plural: ["iéramos", "ierais", "ieran"],
                },
                ir: {
                    singular: ["iera", "ieras", "iera"],
                    plural: ["iéramos", "ierais", "ieran"],
                },
            },
        },
    ],
    imperative: [
        {
            tense: "Affirmative",
            endings: {
                ar: {
                    singular: ["-", "a", "e"],
                    plural: ["emos", "ad", "en"],
                },
                er: {
                    singular: ["-", "e", "a"],
                    plural: ["amos", "ed", "an"],
                },
                ir: {
                    singular: ["-", "e", "a"],
                    plural: ["amos", "id", "an"],
                },
            },
        },
        {
            tense: "Negative",
            endings: {
                ar: {
                    singular: ["-", "es", "e"],
                    plural: ["emos", "éis", "en"],
                },
                er: {
                    singular: ["-", "as", "a"],
                    plural: ["amos", "áis", "an"],
                },
                ir: {
                    singular: ["-", "as", "a"],
                    plural: ["amos", "áis", "an"],
                },
            },
        },
    ],
};

export const pronouns = [
    { singular: "yo", plural: "nosotros/nosotras" },
    { singular: "tú", plural: "vosotros/vosotras" },
    { singular: "él/ella/usted", plural: "ellos/ellas/ustedes" },
];
