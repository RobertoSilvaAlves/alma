# ══════════════════════════════════════════════════════════════
# SERVER/SERVER.PY — Servidor Flask (Funciona local e no Render)
# ═══════════════════════════════════════════════════════════════

import sys
import os
import webbrowser
import threading
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ia import perguntar_para_ia

# ─── Função para achar arquivos ─────────────────────────────────
def resource_path(relative_path):
    if getattr(sys, 'frozen', False):
        base_path = sys._MEIPASS
    else:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

# ─── Configurar Flask ───────────────────────────────────────────
app = Flask(__name__, static_folder=resource_path('..'), static_url_path='')
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return send_from_directory(resource_path('..'), 'index.html')

@app.route('/css/<path:filename>', methods=['GET'])
def css(filename):
    return send_from_directory(os.path.join(resource_path('..'), 'css'), filename)

@app.route('/js/<path:filename>', methods=['GET'])
def js(filename):
    return send_from_directory(os.path.join(resource_path('..'), 'js'), filename)

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "ok", "message": "💜 Alma online!"})

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        historico = data.get('historico', [])
        if not historico:
            return jsonify({"resposta": "Olá! Como posso te ajudar hoje? 💜"}), 200
        
        resposta = perguntar_para_ia(historico)
        return jsonify({"resposta": resposta}), 200
    except Exception as e:
        print(f"❌ Erro: {e}")
        return jsonify({"resposta": "Tive uma dificuldade técnica. 💜"}), 500

# ─── Abrir navegador (só no modo local) ─────────────────────────
def abrir_navegador():
    time.sleep(1.5)
    webbrowser.open('http://localhost:5000')

# ─── Iniciar servidor ───────────────────────────────────────────
if __name__ == '__main__':
    # Detecta se está no Render (tem variável PORT) ou local
    port = int(os.environ.get('PORT', 5000))
    is_render = os.environ.get('RENDER') == 'true'
    
    if not is_render:
        threading.Thread(target=abrir_navegador, daemon=True).start()
        print(f"\n💜 Alma rodando em http://localhost:{port}")
    
    app.run(host='0.0.0.0', port=port, debug=False)

application = app