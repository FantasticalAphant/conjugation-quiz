import pytest
from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)


# Fixture to set a predictable verb list in the app state for testing
@pytest.fixture(autouse=True)
def override_verb_list():
    app.state.verb_list = ["hablar", "comer", "vivir"]
    yield


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}


def test_get_random_verb_conjugation():
    response = client.get("/api/v1/verbs/random")
    assert response.status_code == 200
    json_response = response.json()
    assert "verb" in json_response
    assert "tenses" in json_response
    assert json_response["verb"] in app.state.verb_list


def test_get_random_verb_conjugation_with_tenses():
    response = client.get("/api/v1/verbs/random?tenses=present")
    assert response.status_code == 200
    json_response = response.json()
    assert "verb" in json_response
    assert "tenses" in json_response
    assert "present" in json_response["tenses"]
    assert len(json_response["tenses"]) == 1


def test_get_random_verb_conjugation_no_vosotros():
    response = client.get("/api/v1/verbs/random?include_vosotros=False")
    assert response.status_code == 200
    json_response = response.json()
    assert "verb" in json_response
    # Check a tense to ensure 'vosotros/vosotras' is not present
    a_tense = list(json_response["tenses"].keys())[0]
    assert json_response["tenses"][a_tense]["forms"]["vosotros/vosotras"] is None


def test_get_verb_conjugations():
    response = client.get("/api/v1/verbs/hablar")
    assert response.status_code == 200
    json_response = response.json()
    assert json_response["verb"] == "hablar"
    assert "present" in json_response["tenses"]


def test_get_verb_conjugations_not_found():
    response = client.get("/api/v1/verbs/notaverb")
    assert response.status_code == 404
    assert response.json() == {"detail": "Verb not found in the known list."}


def test_get_tense_conjugations():
    response = client.get("/api/v1/verbs/comer/present")
    assert response.status_code == 200
    json_response = response.json()
    assert "forms" in json_response
    assert json_response["forms"]["yo"] == "como"


def test_get_tense_conjugations_verb_not_found():
    response = client.get("/api/v1/verbs/notaverb/presente")
    assert response.status_code == 404
    assert response.json() == {"detail": "Verb not found in the known list."}


def test_get_tense_conjugations_tense_not_found():
    response = client.get("/api/v1/verbs/vivir/notatense")
    assert response.status_code == 404
    assert response.json() == {"detail": "Tense 'notatense' not found for verb 'vivir'"}


def test_get_tenses():
    response = client.get("/api/v1/tenses")
    assert response.status_code == 200
    tenses = response.json()
    assert isinstance(tenses, list)
    assert "present" in tenses
    assert "preterite" in tenses
