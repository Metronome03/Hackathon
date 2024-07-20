import openai
import os
from dotenv import load_dotenv
from langchain.chains import LLMChain
from langchain.chains import SequentialChain
from langchain.agents import load_tools, initialize_agent
# from langchain_community.chat_models import ChatOpenAI
from langchain_openai import ChatOpenAI
from crewai import Agent, Task, Crew, Process
from factCheck.tools import OpenAIImageAnalyzer


load_dotenv()

class MisinformationDetectionAgent:
    
    def text_agent(self):
        
        llm=ChatOpenAI(temperature=0,model_name="gpt-3.5-turbo")
        tool_name=["serpapi"]
        serp_tools=load_tools(tool_name,llm)
        
        misinfo_detector = Agent(
        role='Misinformation Detector',
        goal='Search the internet to verify the accuracy of information and determine if it is misinformation',
        verbose=True,
        memory=True,
        backstory=(
        "As a Misinformation Detector, your mission is to safeguard the truth. "
        "You search the internet to verify the accuracy of claims, "
        "identify false or misleading information, and provide clear, evidence-based observations. "
        "Your dedication to combating misinformation helps promote a well-informed public."
        ),
        tools= serp_tools,
        llm = llm
        )
        
        return misinfo_detector
    
    
    def image_agent(self):
        
        image_analyzer_tool = OpenAIImageAnalyzer()
        
        image_analyzer = Agent(
        role='Image Analysis and Reporting Agent',
        goal='Generate a short news report based on image analysis',
        verbose=True,
        memory=True,
        backstory=(
            "You are an advanced AI developed to assist news agencies by providing concise news reports based on images."
            "You know nothing about generating the news report"
        ),
        tools=[image_analyzer_tool]
        )
        
        return image_analyzer
    
    def manager_agent(self):
        
        manager = Agent(
        role="Project Manager",
        goal=(
            "you have to mange the tasks based on input type.If the input is a text direct to text_agent agent .if the input is image path then direct to image_agent "
            "IF the image or the message is not related to the factual or news or current affair ignore the message and return None"),
        backstory="You're an experienced project manager, skilled in overseeing complex projects and guiding teams to success. Your role is to coordinate the efforts of the crew members, ensuring that each task is completed on time and to the highest standard. ",
        allow_delegation=True,
        )
        
        return manager        