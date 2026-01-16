from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/api/about")
def read_about():
    return {"message": "This is a message from the backend!"}