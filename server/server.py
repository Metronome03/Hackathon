import uvicorn

if __name__ == "__main__":
    uvicorn.run("all_endpoints:app", host="127.0.0.1", port=8080, reload=True)