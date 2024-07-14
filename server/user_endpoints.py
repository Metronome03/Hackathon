from fastapi import HTTPException,Request,Depends
from fastapi.responses import HTMLResponse,Response,RedirectResponse,JSONResponse
from fastapi.exception_handlers import http_exception_handler
from all_endpoints import app,db,key
import jwt
import json
from firebase_admin import storage
from google.cloud import firestore
import base64

@app.exception_handler(HTTPException)
async def login_redirect_exception(request: Request, exception: HTTPException):
    if exception.status_code==302:
        return RedirectResponse(status_code=302,url="/login")
    return await http_exception_handler(request,exception)

def get_document_from_cookie(request:Request):
    try:
        token = request.cookies.get("token")
        if not token:
            raise HTTPException(status_code=401, detail="Not a valid user according to cookies")
        decoded_token = jwt.decode(token, key, algorithms=["HS256"])
        id = decoded_token["id"]
        doc = db.collection("users").document(id)
        data = doc.get()
        if not data.exists:
            raise HTTPException(status_code=401, detail="Not a valid user according to token")
        data=data.to_dict()
        return {"email":data["email"],"username":data["username"],"id":doc.id}
    except Exception as e:
        raise HTTPException(status_code=422,detail="Something went wrong while decoding cookies")


def check_cookies(request:Request):
    try:
        return get_document_from_cookie(request)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=302,detail="Redirecting to login endpoint")

@app.get("/user-data")
def get_user_data(request:Request):
    try:
        doc=get_document_from_cookie(request)
        data={"email":doc["email"],"username":doc["username"]}
        return JSONResponse(content=data,status_code=200)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=302, detail="Redirecting to login endpoint")

@app.get("/get-friends")
async def get_all_friends(request:Request,doc:dict=Depends(check_cookies)):
    try:
        ref=db.collection("users").document(doc["id"])
        result=ref.collection("friends").stream()
        friends=[]
        for friend_doc in result:
            friend=friend_doc.to_dict()
            friend_data=dict()
            friend_data["email"]=friend_doc.id
            friend_data["username"]=friend["username"]
            if "pending" in friend:
                friend_data["pending"] = friend["pending"]
            friends.append(friend_data)
        return JSONResponse(content={"friends":friends},status_code=200)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail="Couldn't retrieve friends of the user")

@app.post("/add-friend")
async def add_friend(request:Request,doc:dict=Depends(check_cookies)):
    try:
        body=await request.body()
        body=json.loads(body.decode('utf-8'))
        friendEmail=body["friendEmail"]
        if "@" not in friendEmail:
            raise HTTPException(status_code=422, detail="Proper email needs to be entered")
        friendDoc = db.collection("users").where("email", "==", friendEmail).get()
        if not friendDoc:
            raise HTTPException(status_code=404, detail="User could not be found")
        friendData=friendDoc[0].to_dict()
        requestData={"id":doc["id"],"pending":True,"username":doc["username"]}
        ref=db.collection("users").document(friendDoc[0].id)
        sub_ref=ref.collection("friends").document(doc["email"])
        sub_ref.set(requestData)
        return JSONResponse(content="Friend request successfully sent",status_code=200)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Friend could not be added to user")

@app.post("/accept-request")
async def process_friend_request(request:Request,doc:dict=Depends(check_cookies)):
    try:
        body = await request.body()
        body = json.loads(body.decode('utf-8'))
        ref=db.collection("users").document(doc["id"])
        sub_ref=ref.collection("friends").document(body["email"])
        sub_ref_doc=sub_ref.get()
        sub_ref_data=sub_ref_doc.to_dict()
        @firestore.transactional
        def accept_transaction_operations(transaction):
            transaction.update(sub_ref,{"pending":firestore.DELETE_FIELD})
            new_ref=db.collection("users").document(sub_ref_data["id"])
            new_sub_ref=new_ref.collection("friends").document(doc["email"])
            transaction.set(new_sub_ref,{"id":doc["id"],"username":doc["username"]})
        if(body["answer"]):
            transaction=db.transaction()
            accept_transaction_operations(transaction)
            return JSONResponse(content={"accepted":True},status_code=200)
        else:
            sub_ref.delete()
            return JSONResponse(content={"accepted":False},status_code=200)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail="Friend request could not be processed")

@app.post("/get-chat")
async def get_previous_chat(request:Request,doc:dict=Depends(check_cookies)):
    try:
        body=await request.body()
        body = json.loads(body.decode('utf-8'))
        messages=[]
        ref_name = ""
        if doc["email"] < body["email"]:
            ref_name = doc["email"] + "," + body["email"]
        else:
            ref_name = body["email"] + "," + doc["email"]
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
        agent = AgentCrew()
        body=await request.body()
        misinfo=None
        if(body["type"]=="text"):
            misinfo=agent.run(body["content"],None)
        else:
            iamge_data=base64.b64decode(body["content"]["data"])
            path="./image/"+body["sender"]+body["content"]["type"]
            with open(path, "wb") as f:
                f.write(iamge_data)
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



