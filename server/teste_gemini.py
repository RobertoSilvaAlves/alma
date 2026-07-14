from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

print("🔑 API Key:", os.getenv("API_KEY")[:20] + "..." if os.getenv("API_KEY") else "NÃO ENCONTRADA")

try:
    client = genai.Client(api_key=os.getenv("API_KEY"))
    
    print("📡 Chamando Gemini...")
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Olá, teste rápido",
        config={"temperature": 0.8}
    )
    
    print("✅ FUNCIONOU!")
    print("Resposta:", response.text)
    
except Exception as e:
    print("❌ ERRO:")
    print(type(e).__name__, ":", e)