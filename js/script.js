// ═══════════════════════════════════════════════════════════════
// JS/SCRIPT.JS — Interface do chat
// Chama o servidor Python local (localhost:5000)
// ═══════════════════════════════════════════════════════════════

// ─── Endereço do servidor Python local ──────────────────────────
const SERVIDOR = "http://localhost:5000";

// ─── Histórico da conversa (gerenciado aqui no frontend) ────────
let historico = [];

// ─── Inicialização ───────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  addWelcomeMessage();
  verificarServidor();

  const input = document.getElementById('user-input');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });
});

// ─── Verifica se o servidor Python está rodando ──────────────────
async function verificarServidor() {
  try {
    await fetch(`${SERVIDOR}/ping`);
  } catch (e) {
    addMessage('bot',
      '⚠️ Servidor Python não encontrado.<br>' +
      'Abra o terminal, entre na pasta <strong>server/</strong> e rode:<br><br>' +
      '<code>python server.py</code>'
    );
    document.getElementById('send-btn').disabled = true;
    document.getElementById('user-input').disabled = true;
  }
}

// ─── Mensagem de boas-vindas ──────────────────────────────────────
function addWelcomeMessage() {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `
    <div class="msg-avatar">💜</div>
    <div class="bubble">
      Olá! Eu sou a <strong>Alma</strong>, sua assistente de bem-estar. 💜<br><br>
      Estou aqui para ouvir você com atenção e sem julgamentos.
      Como você está se sentindo hoje?
      
      <div class="mood-row">
        <button class="mood-btn" onclick="sendMood('Estou bem 😊')">Bem 😊</button>
        <button class="mood-btn" onclick="sendMood('Estou ansioso 😰')">Ansioso 😰</button>
        <button class="mood-btn" onclick="sendMood('Estou triste 😢')">Triste 😢</button>
        <button class="mood-btn" onclick="sendMood('Estou sobrecarregado 😩')">Sobrecarregado 😩</button>
        <button class="mood-btn" onclick="sendMood('Estou solitário 🥺')">Solitário 🥺</button>
      </div>
      
      <div class="mood-row">
        <button class="mood-btn" onclick="sendMood('Estou com raiva 😤')">Raiva 😤</button>
        <button class="mood-btn" onclick="sendMood('Estou cansado 😴')">Cansado 😴</button>
        <button class="mood-btn" onclick="sendMood('Estou com medo 😨')">Com medo 😨</button>
        <button class="mood-btn" onclick="sendMood('Estou feliz 😄')">Feliz 😄</button>
        <button class="mood-btn" onclick="sendMood('Não sei dizer como estou')">Não sei dizer</button>
      </div>
    </div>`;
  msgs.appendChild(div);
}

// ─── Renderização de mensagens ────────────────────────────────────
function addMessage(role, text) {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
  const formatted = text.replace(/\n/g, '<br>');
  if (role === 'bot') {
    div.innerHTML = `<div class="msg-avatar">💜</div><div class="bubble">${formatted}</div>`;
  } else {
    div.innerHTML = `<div class="bubble">${formatted}</div>`;
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg bot'; div.id = 'typing-indicator';
  div.innerHTML = `<div class="msg-avatar">💜</div><div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

// ─── Envio de mensagens ────────────────────────────────────────────
function sendMood(mood) {
  addMessage('user', mood);
  enviarMensagem(mood);
}

function sendMessage() {
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;
  addMessage('user', text);
  input.value = '';
  input.style.height = 'auto';
  enviarMensagem(text);
}

// ─── Ponte entre a interface e o servidor Python ───────────────────
async function enviarMensagem(texto) {
  historico.push({ role: 'user', content: texto });

  const btn = document.getElementById('send-btn');
  btn.disabled = true;
  showTyping();

  try {
    // Chama o servidor Python local (server/server.py)
    const response = await fetch(`${SERVIDOR}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historico })
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);

    const data = await response.json();
    const resposta = data.resposta;

    historico.push({ role: 'assistant', content: resposta });
    hideTyping();
    addMessage('bot', resposta);

  } catch (e) {
    hideTyping();
    console.error('Erro:', e);
    addMessage('bot', 'Tive uma dificuldade técnica. O servidor Python está rodando? 💜');
  }

  btn.disabled = false;
  document.getElementById('user-input').focus();
}
