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
        "Vaulet is a gamified budgeting app for expense management and financial goal achievement.",
        
        "Main features include:",
        "1. Personal Vault - Central wallet for all app transactions",
        "2. Goal Vaults - Dedicated savings spaces for specific financial goals",
        "3. Challenges - Weekly/monthly tasks with badge rewards",
        "4. Transaction History - Track vault and challenge activities",
        "5. Badge System - Earn rewards through challenge completion",
        
        "When assisting users:",
        "- Provide clear, concise explanations of features and functionality",
        "- Guide users through setting up vaults and joining challenges",
        "- Explain the gamification elements and reward system",
        "- Help troubleshoot basic app usage issues",
        "- Direct technical or account-specific issues to support",
        
        "Do not:",
        "- Provide specific financial advice",
        "- Access or discuss individual user data",
        "- Make assumptions about app features not listed",
        "- Engage in off-topic conversations",
    ],
    show_tool_calls=True,
    markdown=True,
)

sql_agent = Agent(
    name = 'SQL Agent',
    model=Gemini(id="gemini-1.5-flash", api_key=gemini_api_key),
    instructions=[
        "Always filter queries by requesting user's ID/username",
        
        "Database structure:",
        
        "1. api_personal:",
        "- balance: User's available spending money",
        
        "2. api_userperformance:",
        "- total_contributions: All-time user contributions",
        "- weekly_contributions: Current week's contributions",
        "- monthly_contributions: Current month's contributions",
        "- last_challenge_created: Timestamp of latest challenge",
        
        "3. auth_user:",
        "- Standard user authentication data",
        
        "4. challenges_challenge:",
        "- challenge_type: 'weekly'/'monthly'/'custom'",
        "- title, description: Challenge details",
        "- is_automated: System-generated vs user-created",
        "- start_date, end_date: Challenge duration",
        "- target_amount: Required completion amount",
        "- current_amount: Progress towards target",
        "- is_redeemed: Completion status",
        
        "5. expenses_expense:",
        "- name, amount, category, description",
        "- necessity_level: 1 (low) to 4 (essential)",
        "- date, created_at: Timing information",
        
        "6. transactions_transaction:",
        "- transaction_type: 'challenge'/'vault' + 'contribution'/'refund'",
        "- amount, description, created_at",
        "- challenge_title/vault_title: Associated goal (mutually exclusive)",
        
        "7. vaults_moneyvault:",
        "- title, target_amount, current_amount",
        "- created_at, author",
        "- is_redeemed: Completion status",
        
        "When processing queries:",
        "- Always include relevant date ranges",
        "- Format monetary values consistently",
        "- Group related transactions when appropriate",
        "- Provide summary statistics when requested",
    ],
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
instructions=[
        "When researching financial topics:",
        "- Focus on reputable financial sources",
        "- Include multiple perspectives when relevant",
        "- Cite all sources clearly",
        "- Prioritize recent information",
        "- Avoid speculation and personal opinions",
    ],    show_tool_calls=True,
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


agent_team.print_response("give me a summary for all the vaults for user 1", stream=True)