from fastapi import HTTPException,Request,Depends
from fastapi.responses import HTMLResponse,RedirectResponse,JSONResponse
from fastapi.exception_handlers import http_exception_handler
from all_endpoints import app,db,key
from firebase_admin import storage
import base64
from user_methods import get_request_body,check_cookies
from factCheck.crew import AgentCrew
import os

@app.exception_handler(HTTPException)
async def login_redirect_exception(request: Request, exception: HTTPException):
    if exception.status_code==302:
        return RedirectResponse(status_code=302,url="/login")
    return await http_exception_handler(request,exception)

@app.get("/user-data")
def get_user_data(request:Request,doc:dict=Depends(check_cookies)):
    try:
        del doc["id"]
        return JSONResponse(content=doc,status_code=200)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=302, detail="Redirecting to login endpoint")

@app.post("/get-chat")
async def get_previous_chat(request:Request,doc:dict=Depends(check_cookies)):
    try:
        body=await get_request_body(request)
        messages=[]
        ref_name = doc["email"] + "," + body["email"] if doc["email"] < body["email"] else body["email"] + "," + doc["email"]
        ref = db.collection("chats").document(ref_name).collection("messages")
        messages = [message.to_dict() for message in ref.stream()]
        for i in range(0,len(messages)):
            if(messages[i]["type"]!="text"):
                try:
                    bucket=storage.bucket()
                    blob=bucket.blob(messages[i]["timestamp"]+","+messages[i]["content"]["filename"])
                    image_data = blob.download_as_bytes()
                    base64_data = base64.b64encode(image_data).decode('utf-8')
                    messages[i]["content"]["data"]=base64_data
                except Exception as e:
                    print("Couldn't encode the image to base64")
        return JSONResponse(content={"messages":messages},status_code=200)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail="Couldn't get the previous chats")

@app.post("/check-misinfo",dependencies=[Depends(check_cookies)])
async def check_misinfo(request:Request):
    try:
        body=await get_request_body(request)
        agent=AgentCrew()
        misinfo=None
        if(body["type"]=="text"):
            misinfo=agent.run(body["content"],None)
        else:
            iamge_data=base64.b64decode(body["content"]["data"])
            #path="./image/"+body["timestamp"]+body["sender"]+"."+body["content"]["type"].split('/')[1]
            path="./image/image.jpeg"
            with open(path, "wb") as f:
                f.write(iamge_data)
                misinfo=agent.run(None,path)
                #os.remove(path)
        return JSONResponse(content={"misinfo":misinfo},status_code=200)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail="Couldn't validate the image")


@app.get("/",dependencies=[Depends(check_cookies)])
def main_endpoint(request:Request):
    try:
        with open("./dist/index.html", "r") as page:
            content = page.read()
        return HTMLResponse(content=content, status_code=200)
    except Exception as e:
        print("Something went wrong trying to read the file")
        return "Error"

import friend_endpoints



