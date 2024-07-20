from crewai_tools import BaseTool
from pydantic import BaseModel, Field, PrivateAttr
from crewai import Agent, Task, Crew, Process
from dotenv import load_dotenv
import base64
import requests
import os


load_dotenv()


class OpenAIImageAnalyzer(BaseTool):
    name: str = "OpenAI Image Analyzer"
    description: str = "Analyze an image using OpenAI API to generate a news report description."
    api_key: str = os.getenv("OPENAI_API_KEY")
    _headers: dict = PrivateAttr()

    def __init__(self, **data):
        super().__init__(**data)
        self._headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

    @staticmethod
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def analyze_image(self, image_path, model="gpt-4o", max_tokens=300):
        base64_image = self.encode_image(image_path)
        payload = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "describe this image as a news report in 3 to 4 lines"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": max_tokens
        }

        response = requests.post("https://api.openai.com/v1/chat/completions", headers=self._headers, json=payload)
        response_json = response.json()
        try:
            print("********************")
            print(response_json['choices'][0]['message']['content'])
            return response_json['choices'][0]['message']['content']
        except KeyError:
            return "Error in response format"

    def _run(self, image_path: str):
        try:
            result = self.analyze_image(image_path)
            return result
        except Exception as e:
            return str(e)