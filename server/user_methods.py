from fastapi import HTTPException,Request
from all_endpoints import db,key
import jwt
import json


async def get_request_body(request, field=""):
    try:
        body = await request.body()
        body = json.loads(body.decode('utf-8'))
        if (len(field) != 0):
            return body[field]
        else:
            return body
    except Exception as e:
        print(e)
        raise HTTPException(status_code=422, detail="Something went from while parsing JSONf from request body", )

def get_document_from_cookie(token):
    try:
        if not token:
            raise HTTPException(status_code=401, detail="Not a valid user according to cookies")
        decoded_token = jwt.decode(token, key, algorithms=["HS256"])
        id = decoded_token["id"]
        doc = db.collection("users").document(id)
        data = doc.get()
        if not data.exists:
            raise HTTPException(status_code=401, detail="Not a valid user according to token")
        data = data.to_dict()
        return {"email": data["email"], "username": data["username"], "id": doc.id}
    except Exception as e:
        raise HTTPException(status_code=422, detail="Something went wrong while decoding cookies")

def check_cookies(request: Request):
    try:
        return get_document_from_cookie(request.cookies.get("token"))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=302, detail="Redirecting to login endpoint")

