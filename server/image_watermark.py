from datetime import datetime
from blind_watermark import WaterMark
import hashlib
from PIL import Image
import numpy as np

def generate_watermark(name,phone):
    data = f'{name} {phone} {datetime.now().strftime("%d-%m-%Y")}'
    hash_object = hashlib.sha256(data.encode())
    return hash_object.hexdigest()[:8], data
def generate_content_hash(image_path):
    with Image.open(image_path) as img:
        img_array = np.array(img)
    img_bytes = img_array.tobytes()
    hash_object = hashlib.sha256(img_bytes)
    return hash_object.hexdigest()
