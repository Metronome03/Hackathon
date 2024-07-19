import copy
from fastapi import WebSocket,WebSocketDisconnect,HTTPException
from all_endpoints import app,db,key
from user_endpoints import get_document_from_cookie
import socketio
import jwt
from datetime import datetime
from firebase_admin import firestore,storage
import base64

sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*",
)
socket_app=socketio.ASGIApp(sio,other_asgi_app=app)

users_sockets={}
sockets_users={}

@sio.event
async def connect(sid, environ):
    try:
        print('Client connected:',sid)
        cookies={cookie.split('=')[0]: cookie.split('=')[1] for cookie in environ.get('HTTP_COOKIE','').split('; ')}
        token=cookies["token"]
        if not token:
            raise Exception("Something went wrong whie parsing cookies")
        decoded_token = jwt.decode(token, key, algorithms=["HS256"])
        id = decoded_token["id"]
        doc = db.collection("users").document(id)
        data = doc.get()
        if not data.exists:
            raise Exception("Not a valid user according to cookies")
        data = data.to_dict()
        users_sockets[data["email"]]=sid
        sockets_users[sid]=data["email"]
        print(users_sockets)
    except Exception as e:
        print(e)

@sio.event
async def disconnect(sid):
    if sid in sockets_users:
        email=sockets_users[sid]
        del sockets_users[sid]
        del users_sockets[email]
        print('Client disconnected:',sid)

@sio.event
async def message(sid,message):
    try:
        message_ref=""
        if message["sender"]<message["receiver"]:
            message_ref=message["sender"]+","+message["receiver"]
        else:
            message_ref=message["receiver"]+","+message["sender"]
        doc = db.collection("chats").document(message_ref).collection("messages")
        if(message["type"]=="text"):
            doc.add(message)
            if message["sender"] and message["receiver"] in users_sockets:
                await sio.emit('message', message, room=users_sockets[message["receiver"]])
                await sio.emit('message', message, room=users_sockets[message["sender"]])
        else:
            try:
                image_data=message["content"]
                bucket=storage.bucket()
                blob = bucket.blob(message["timestamp"]+","+image_data["filename"])
                blob.upload_from_string(base64.b64decode(image_data["data"]), content_type=image_data["type"])
                image_url=blob.public_url
                stored_message=copy.deepcopy(message)
                stored_message["content"]["data"]=image_url
                doc.add(stored_message)
                if message["sender"] and message["receiver"] in users_sockets:
                    await sio.emit('message', message, room=users_sockets[message["receiver"]])
                    await sio.emit('message', message, room=users_sockets[message["sender"]])

            except Exception as e:
                print(e)
                print("Couldn't upload the image")
    except Exception as e:
        print("Something went wrong while sending message")

