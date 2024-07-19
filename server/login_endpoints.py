from fastapi import HTTPException,Request
from fastapi.responses import HTMLResponse,Response,JSONResponse
from all_endpoints import app,db,SignupUser,LoginUser,key
import jwt

@app.post("/login-user")
async def login_user(user:LoginUser):
    try:
        docs=None
        token=""
        validated=False
        if "@" not in user.identifier:
            raise HTTPException(status_code=422, detail="Proper email needs to be entered")
        doc=db.collection("users").where("email","==",user.identifier).get()
        if not doc:
            raise HTTPException(status_code=404, detail="User could not be found")
        data=doc[0].to_dict()
        if(data["password"]==user.password):
            token=jwt.encode({"id":doc[0].id},key,algorithm="HS256")
            validated = True
        if validated:
            return JSONResponse(content={"token":token},status_code=200)
        else:
            raise HTTPException(status_code=404,detail="Valid user could not be found")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500,detail="Login could not be completed")


@app.post("/signup-user")
async def signup_user(user:SignupUser):
    try:
        if "@" in user.username:
            raise HTTPException(status_code=422,detail="Username has @ character")
        if "@" not in user.email:
            raise HTTPException(status_code=422, detail="Email is not valid")
        existDoc = db.collection("users").where("email", "==", user.email).get()
        if existDoc:
            raise HTTPException(status_code=403,detail="User with that email already exists")
        doc=db.collection('users').document()
        doc.set(user.dict())
        return Response(content="User was successfully created",status_code=200)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="User could not be created")


#endpoints for pages from here
static_page_path="./static_pages/"
page_error_page="<html><head><title>ChatPlat | Error</title><body><p>Something went wrong trying to open the file</p></body></head></html>"


@app.get("/login")
async def login_page():
    try:
        with open(static_page_path+"login_page.html","r") as page:
            content=page.read()
        return HTMLResponse(content=content,status_code=200)
    except Exception as e:
        print("Something went wrong trying to read the file")
        try:
            with open(static_page_path + "error_page.html", "r") as page:
                content = page.read()
            return HTMLResponse(content=content, status_code=500)
        except Exception as e:
            print("Couldn't get the error page. Returning the default error response")
            return HTMLResponse(content=page_error_page, status_code=500)

@app.get("/signup")
async def signup_page():
    try:
        with open(static_page_path+"signup_page.html","r") as page:
            content=page.read()
        return HTMLResponse(content=content,status_code=200)
    except Exception as e:
        print("Something went wrong trying to read the file")
        try:
            with open(static_page_path + "error_page.html", "r") as page:
                content = page.read()
            return HTMLResponse(content=content, status_code=500)
        except Exception as e:
            print("Couldn't get the error page. Returning the default error response")
            return HTMLResponse(content=page_error_page, status_code=500)
