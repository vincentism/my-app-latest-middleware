from fastapi import FastAPI

app = FastAPI()

@app.get("/api/{index}")
async def get_index(index: str):
    return {"message": f"Hello! The index param is: {index}", "index": index}


