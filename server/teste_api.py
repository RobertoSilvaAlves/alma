from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("API_KEY"))

try:
    response = client.models.generate_content(
        model="gemini-2.0-flash-exp",
        contents="Olá",
        config={"temperature": 0.8}
    )
    print("✅ Funcionou! Resposta:", response.text)
except Exception as e:
    print("❌ Erro:", e)