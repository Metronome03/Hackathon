import openai
import os
from dotenv import load_dotenv
from langchain.chains import LLMChain
from langchain.chains import SequentialChain
from langchain.agents import load_tools, initialize_agent
from factCheck.agents import MisinformationDetectionAgent
from langchain_community.chat_models import ChatOpenAI
from crewai import Agent, Task, Crew, Process


class MisinformationDetectionTasks:
    
    def __init__(self):
        self.agent_instance = MisinformationDetectionAgent()
    
    def text_task(self):
        misinfo_task = Task(
        description=(
            "You are given a message as {message} , check if it is misinformation. "
            "Your task is to search the Google search engine using SerpAPI regarding the message and return a JSON response. "
            "Search as many websites as you can to verify the information. "
            "Please ensure your response is accurate and based on reliable sources."
        ),
        expected_output="""
            Provide a JSON response strictly in the following format:

            {{
                "misinformation": true,  // when the message contains misinformation
                "misinformation": false, // when the message is correct i.e no misinformation
                "comments": "text"       // provide a strong reason explaining why the message is considered misinformation or not
                "sources": [
                {{
                    "title": "",
                    "link": ""
            
                }} ] // provide top 3 sources for your search 
            }}
        """,
        agent = self.agent_instance.text_agent()
        )
        
        return misinfo_task
    
    def image_task(self):
        image_task = Task(
        description=(
            "You are given an image as {image_path}."
            "Analyze the provided image and generate a 3-4 line news report using the image_reporter tool."
        ),
        expected_output="""
            A short news report result with 3-4 lines describing the image.
        """,
        agent = self.agent_instance.image_agent()
        )
        
        return  image_task   
        
        