from venv import create
from phi.agent import Agent
from phi.model.google import Gemini 
from phi.tools.sql import SQLTools
from sqlalchemy import create_engine
from phi.tools.duckduckgo import DuckDuckGo
from dotenv import load_dotenv
import os 

load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")

engine = create_engine('sqlite:///./db.sqlite3')

chat_bot_agent = Agent(
    name="ChatBot AI agent",
    role="Act like a helpful and informative chatbot that solves user queries",
    model=Gemini(id="gemini-1.5-flash", api_key=gemini_api_key),
    instructions=[
        "Vaulet is a gamified budgeting app that helps users manage expenses and identify spending patterns.",
        """It features customizable money "vaults" for saving toward specific goals and offers weekly and monthly challenges with badge rewards.""",
        "Users can track daily expenses, while an AI assistant provides personalized financial advice based on vaults, challenges, and transactions.",
        "Your role is to assist users with their budgeting inquiries, provide information about how the platform works, and help them with expense questions.",
        "Additionally, guide users through the platform’s key features, including:"
        "- Personal Vault: Users can credit money to their personal vault which will be used for all transactions on the application."
        "- Vaults: Users can create vaults and set aside funds for specific goals.",
        "- Challenges: Users can participate in weekly and monthly challenges and reap rewards."
        "- Transaction History: Review past transactions involving contributions to and retrievals from vaults and challenges only."
        "- Earn Badges: Participate in weekly and monthly challenges to earn badges."
        "Be professional, informative, and user-friendly in your responses.",
        "When answering questions, be clear, concise, and engaging.",
        "Encourage users to explore platform features and learn how to manage their expenses better.",
        "If unsure about a user’s request, ask for clarification gracefully.",
        "Stay on-topic and provide relevant answers that enhance the trading experience."
    ],
    show_tool_calls=True,
    markdown=True,
)

sql_agent = Agent(
    name = 'SQL Agent',
    model=Gemini(id="gemini-1.5-flash", api_key=gemini_api_key),
    # instructions=[
    #     "the api_personal "
    # ]
    markdown=True,
    show_tool_calls=True,
    system_messages='Your are equipped with tools to manage my SQLite database.',
    tools=[SQLTools(db_engine=engine)],
    add_chat_history_to_messages=True,
    retries=3
)

web_search_agent = Agent(
    name="Web Search Agent",
    role="Search the web for relevant information.",
    model=Gemini(id="gemini-1.5-flash", api_key=gemini_api_key),
    tools=[DuckDuckGo()],
    instructions=["Always include sources in your responses."],
    show_tool_calls=True,
    markdown=True,
)

agent_team = Agent(
    team=[chat_bot_agent,sql_agent],
    model=Gemini(id="gemini-1.5-flash", api_key=gemini_api_key),
    instructions=[

        "Any Vaulet-related questions must be directed to the ChatBot AI agent.",
        "Any general personal finance or budgeting tips related questions must be directed to the Web Search Agent",
        "Any vault, challenge contribution, performance, transaction and expense info must be directed to the SQL agent.",
        "Do **not** provide personal opinions, engage in casual conversation, or answer off-topic questions.",
        "You **only** answer questions related to Vaulet, budgeting and personal finance concepts.",
    ],
    show_tool_calls=True,
    markdown=True,
)


agent_team.print_response("give me a summary for all the expenses for user testuser", stream=True)