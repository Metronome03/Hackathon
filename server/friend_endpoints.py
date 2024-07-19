from fastapi import HTTPException,Request,Depends
from fastapi.responses import JSONResponse
from all_endpoints import app,db
import json
from google.cloud import firestore
from user_methods import check_cookies,get_document_from_cookie

@app.get("/get-friends")
async def get_all_friends(request:Request,doc:dict=Depends(check_cookies)):
    try:
        result=db.collection("users").document(doc["id"]).collection("friends").stream()
        friends=[]
        for friend_doc in result:
            friend=friend_doc.to_dict()
            friend_data={"email":friend_doc.id,"username":friend["username"],"pending":False if "pending" not in friend or friend["pending"]==False else True}
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
        requestData={"id":doc["id"],"pending":True,"username":doc["username"]}
        sub_ref=db.collection("users").document(friendDoc[0].id).collection("friends").document(doc["email"])
        sub_ref.set(requestData)
        return JSONResponse(content={"username":friendDoc[0].to_dict()["username"]},status_code=200)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Friend could not be added to user")

@app.post("/accept-request")
async def process_friend_request(request:Request,doc:dict=Depends(check_cookies)):
    try:
        body = await request.body()
        body = json.loads(body.decode('utf-8'))
        sub_ref=db.collection("users").document(doc["id"]).collection("friends").document(body["email"])
        sub_ref_data=sub_ref.get().to_dict()
        @firestore.transactional
        def accept_transaction_operations(transaction):
            transaction.update(sub_ref,{"pending":firestore.DELETE_FIELD})
            new_sub_ref=db.collection("users").document(sub_ref_data["id"]).collection("friends").document(doc["email"])
            transaction.set(new_sub_ref,{"id":doc["id"],"username":doc["username"]})
        if(body["answer"]==True):
            transaction=db.transaction()
            accept_transaction_operations(transaction)
            return JSONResponse(content={"accepted":True},status_code=200)
        else:
            sub_ref.delete()
            return JSONResponse(content={"accepted":False},status_code=200)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail="Friend request could not be processed")
