from fastapi import FastAPI

from api.routers import conjugations as conjugations_router

app = FastAPI()

app.include_router(conjugations_router.router, prefix="/api/v1")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/api/about")
def read_about():
    return {"message": "This is a message from the backend!"}

