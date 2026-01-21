import json
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException

from api.routers import conjugations as conjugations_router


def _load_verb_list() -> list[str]:
    """
    Loads the list of verbs from a JSON file.
    """
    verbs_file_path = Path(__file__).parent / "verbs.json"
    try:
        with open(verbs_file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: verbs.json not found at {verbs_file_path}")
        return []
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from {verbs_file_path}")
        return []


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the verb list on startup
    app.state.verb_list = _load_verb_list()
    if not app.state.verb_list:
        raise HTTPException(
            status_code=500, detail="Verb list could not be loaded on startup."
        )
    print(f"Loaded {len(app.state.verb_list)} verbs on startup.")
    yield
    # Perform any cleanup here if needed (e.g., close database connections)


app = FastAPI(lifespan=lifespan)

app.include_router(conjugations_router.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"Hello": "World"}
