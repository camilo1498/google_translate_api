# google_translate_api

If you want to test this api try with `https://translate-google-api.herokuapp.com/api/translate` and send the follow params `from, to, text`

Here yuo can find a demo app made with flutter => [repository](https://github.com/camilo1498/flutter_translate_app)

## installation

1) clone the project `git clone https://github.com/camilo1498/google_translate_api.git`

2) install dependencies `npm i`


## Response example

```json
{
    "success": true,
    "message": "ok",
    "data": {
        "text": "Hola",
        "originalText": "hello",
        "sourceLanguage": "en",
        "translationLanguage": "es",
        "isCorrect": true,
        "source": {
            "synonyms": [],
            "pronunciation": [
                "həˈlō"
            ],
            "definitions": [
                {
                    "type": "exclamation",
                    "definitions": [
                        {
                            "id": "m_en_gbus0460730.012",
                            "definition": "used as a greeting or to begin a phone conversation.",
                            "example": "hello there, Katie!"
                        }
                    ]
                },
                {
                    "type": "noun",
                    "definitions": [
                        {
                            "id": "m_en_gbus0460730.025",
                            "definition": "an utterance of “hello”; a greeting.",
                            "example": "she was getting polite nods and hellos from people"
                        }
                    ]
                },
                {
                    "type": "verb",
                    "definitions": [
                        {
                            "id": "m_en_gbus0460730.034",
                            "definition": "say or shout “hello”; greet someone.",
                            "example": "I pressed the phone button and helloed"
                        }
                    ]
                }
            ],
            "examples": [
                "hello there, Katie!"
            ]
        },
        "translations": [
            {
                "type": "interjection",
                "translations": [
                    {
                        "word": "¡Hola!",
                        "translations": [
                            "Hello!",
                            "Hi!",
                            "Hey!",
                            "Hullo!",
                            "Hallo!",
                            "Hoy!"
                        ],
                        "frequency": 0.43686765
                    },
                    {
                        "word": "¡Caramba!",
                        "translations": [
                            "Gee!",
                            "Well!",
                            "Good gracious!",
                            "Well I never!",
                            "By jingo!",
                            "By gum!"
                        ]
                    },
                    {
                        "word": "¡Oiga!",
                        "translations": [
                            "Listen!",
                            "Hello!",
                            "Hullo!",
                            "Hallo!",
                            "I say!",
                            "See here!"
                        ]
                    },
                    {
                        "word": "¡Diga!",
                        "translations": [
                            "Hello!",
                            "Hullo!",
                            "Talk away!"
                        ]
                    },
                    {
                        "word": "¡Bueno!",
                        "translations": [
                            "Well!",
                            "All right!",
                            "Hello!",
                            "Hallo!",
                            "Hullo!"
                        ]
                    },
                    {
                        "word": "¡Vale!",
                        "translations": [
                            "Okay!",
                            "O.K.!",
                            "OK!",
                            "Okey!",
                            "Hello!"
                        ]
                    },
                    {
                        "word": "¡Aló!",
                        "translations": [
                            "Hello!",
                            "Hullo!",
                            "Halliard!"
                        ]
                    }
                ]
            }
        ]
    }
}
```
