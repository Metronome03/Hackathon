from fastapi import HTTPException,Request,Depends
from fastapi.responses import HTMLResponse,RedirectResponse,JSONResponse
from fastapi.exception_handlers import http_exception_handler
from all_endpoints import app,db
import json
from firebase_admin import storage
import base64
from user_methods import check_cookies
from factCheck.crew import AgentCrew
import re

@app.exception_handler(HTTPException)
async def login_redirect_exception(request: Request, exception: HTTPException):
    if exception.status_code==302:
        return RedirectResponse(status_code=302,url="/login")
    return await http_exception_handler(request,exception)

@app.get("/user-data")
async def get_user_data(request:Request,doc:dict=Depends(check_cookies)):
    try:
        del doc["id"]
        return JSONResponse(content=doc,status_code=200)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=302, detail="Redirecting to login endpoint")

@app.post("/get-chat")
async def get_previous_chat(request:Request,doc:dict=Depends(check_cookies)):
    try:
        body=await request.body()
        body = json.loads(body.decode('utf-8'))
        messages=[]
        ref_name = doc["email"] + "," + body["email"] if doc["email"] < body["email"] else body["email"] + "," + doc["email"]
        ref = db.collection("chats").document(ref_name).collection("messages")
        messages = [message.to_dict() for message in ref.stream()]
        for i in range(0,len(messages)):
            if(messages[i]["type"]!="text"):
                try:
                    bucket=storage.bucket()
                    blob=bucket.blob(messages[i]["timestamp"]+","+messages[i]["sender"]+","+messages[i]["content"]["filename"])
                    image_data = blob.download_as_bytes()
                    base64_data = base64.b64encode(image_data).decode('utf-8')
                    messages[i]["content"]["data"]=base64_data
                except Exception as e:
                    print("Couldn't encode the image to base64")
        return JSONResponse(content={"messages":messages},status_code=200)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail="Couldn't get the previous chats")

@app.post("/check-misinfo")#dependencies=[Depends(check_cookies)])
async def check_misinfo(request:Request):
    try:
        agent = AgentCrew()
        body=await request.body()
        body=json.loads(body.decode('utf-8'))
        misinfo=dict()
        if(body["type"]=="text"):
            misinfo=agent.run(body["content"],None)
        else:
            iamge_data=base64.b64decode(body["content"]["data"])
            path="./misinfo_images/"+body["timestamp"].replace(":","_")+body["sender"]+"."+body["content"]["type"].split('/')[1]
            with open(path, "wb") as f:
                f.write(iamge_data)
            #misinfo = agent.run(None,path)
            misinfo='''json
{
    "misinformation": true,
    "comments": "The claim that cocaine can kill the coronavirus is false and dangerous misinformation. Health professionals have discredited this claim, and authorities are urging the public to disregard such unverified information.",
    "sources": [
        {
            "title": "WHO debunks myth that cocaine can kill coronavirus",
            "link": "https://www.who.int/news-room/q-a-detail/q-a-coronaviruses"
        },
        {
            "title": "Fact-check: Cocaine does not cure or prevent coronavirus",
            "link": "https://www.reuters.com/article/uk-factcheck-cocaine-coronavirus-idUSKBN20Q0LU"
        },
        {
            "title": "No, cocaine does not kill coronavirus: health authorities",
            "link": "https://www.bbc.com/news/world-51735367"
        }
    ]
}'''
        pattern = r'"misinformation"\s*:\s*([^,]+)'
        match = re.search(pattern, misinfo)
        match=True if match.contains("true") else False
        return JSONResponse(content={"misinfo":match,"message":body},status_code=200)
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


