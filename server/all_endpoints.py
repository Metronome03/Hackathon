from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials,firestore


#chat-app-b8618-firebase-adminsdk-7cy3e-977d7ed2f2

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred,{
    'storageBucket':'chat-app-b8618.appspot.com'
})
db = firestore.client()


key = "ThiscannotBecracked01651651JustKidding!!!!!"

app = FastAPI()

app.mount("/page", StaticFiles(directory="static_pages"), name="static_pages")
app.mount("/assets",StaticFiles(directory="./dist/assets"),name="asset_pages")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SignupUser(BaseModel):
    email: str
    username: str
    password: str

class LoginUser(BaseModel):
    identifier: str
    password: str

import login_endpoints

import user_endpoints

import socket_comm


