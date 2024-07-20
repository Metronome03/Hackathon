import copy
from all_endpoints import app,db
import socketio
from firebase_admin import storage
import base64
from user_methods import get_document_from_cookie
from blind_watermark import WaterMark
from image_watermark import generate_watermark
import os

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
        data = get_document_from_cookie(token)
        users_sockets[data["email"]]=sid
        sockets_users[sid]=data["email"]
    except Exception as e:
        print(e)
        await sio.disconnect(sid)

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
            if message["sender"] or message["receiver"] in users_sockets:
                await sio.emit('message', message, room=users_sockets[message["receiver"]])
                await sio.emit('message', message, room=users_sockets[message["sender"]])
        else:
            try:
                image_data = message["content"]
                file_name_local = message["timestamp"].replace(":", "_") + "," + message["sender"] + "," + image_data["filename"]
                file_name_local_path = "./images/"
                watermark_text=None
                existDoc=None
                with open(file_name_local_path + file_name_local, "wb") as file:
                    file.write(base64.b64decode(image_data["data"]))
                bwm1 = WaterMark(password_img=1, password_wm=1)
                try:
                    wm_extract=bwm1.extract(file_name_local_path+file_name_local, wm_shape=62, mode='str')
                    existDoc = db.collection("images").where("watermark_text", "==", wm_extract).get()
                    if not existDoc:
                        wm_extract_63 = bwm1.extract(file_name_local_path + file_name_local, wm_shape=63, mode='str')
                        existDocIn=db.collection("images").where("watermark_text", "==", wm_extract_63).get()
                        existDoc=existDocIn
                except Exception as e:
                    print(e)
                def add_watermark():
                    watermark_text, data = generate_watermark(file_name_local_path+file_name_local, "!secret!")
                    bwm1 = WaterMark(password_img=1, password_wm=1)
                    bwm1.read_img(file_name_local_path+file_name_local)
                    bwm1.read_wm(watermark_text, mode='str')
                    bwm1.embed(file_name_local_path+"watermarked_"+file_name_local)
                    with open(file_name_local_path+"watermarked_"+file_name_local,"rb") as read_image:
                        image_bytes=read_image.read()
                        image_base64=base64.b64encode(image_bytes).decode('utf-8')
                        message["content"]["data"]=image_base64
                    ref = db.collection("images").document(message["timestamp"] + "," + message["sender"] + "," + image_data["filename"])
                    ref.set({"name": image_data["filename"], "sender": message["sender"], "receiver": message["receiver"],"timestamp": message["timestamp"], "watermark_text": watermark_text})
                    os.remove(file_name_local_path + "watermarked_" + file_name_local)
                    return watermark_text
                if not existDoc:
                    watermark_text=add_watermark()
                else:
                    watermark_text=None
                os.remove(file_name_local_path + file_name_local)
                bucket=storage.bucket()
                blob = bucket.blob(message["timestamp"]+","+message["sender"]+","+image_data["filename"])
                blob.upload_from_string(base64.b64decode(image_data["data"]), content_type=image_data["type"])
                image_url=blob.public_url
                stored_message=copy.deepcopy(message)
                stored_message["content"]["data"]=image_url
                stored_message["content"]["watermark"]=message["content"]["watermark"]=watermark_text
                doc.add(stored_message)
                if message["sender"] and message["receiver"] in users_sockets:
                    await sio.emit('message', message, room=users_sockets[message["receiver"]])
                    await sio.emit('message', message, room=users_sockets[message["sender"]])

            except Exception as e:
                print(e)
                print("Couldn't upload the image")
    except Exception as e:
        print("Something went wrong while sending message")

