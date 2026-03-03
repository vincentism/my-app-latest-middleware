from fastapi import FastAPI

app = FastAPI()


@app.get("/api")
def root():
    return {"message": "Hello from FastAPI on Vercel!"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/greet/{name}")
def greet(name: str):
    return {"message": f"Hello, {name}!"}
