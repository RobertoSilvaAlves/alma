# 💜 Alma — Assistente de Bem-estar
### Mostra de Projetos de Saúde · SENAC-RS 2026

---

## Estrutura do projeto

```
alma/
├── index.html          ← abre no navegador
├── css/
│   └── style.css       ← aparência visual
├── js/
│   └── script.js       ← interface do chat
└── server/
    ├── server.py       ← servidor local Python
    ├── ia.py           ← lógica da IA (personalidade, chamada à API)
    ├── .env            ← sua chave da API (não compartilhe!)
    └── requirements.txt
```

---

## Como rodar

### 1. Instalar as bibliotecas Python (só na primeira vez)

Abra o terminal, entre na pasta `server/` e rode:

```bash
pip install -r requirements.txt
```

### 2. Colocar sua chave da API no arquivo `.env`

Abra o arquivo `server/.env` e substitua o valor:

```
API_KEY=coloque-sua-chave-aqui
```

Obtenha sua chave gratuita em: https://console.anthropic.com

### 3. Iniciar o servidor Python

No terminal, dentro da pasta `server/`:

```bash
python server.py
```

Você verá a mensagem:
```
💜 Alma rodando em http://localhost:5000
```

### 4. Abrir o chat no navegador

Abra o arquivo `index.html` diretamente no navegador (duplo clique).

---

## Como funciona

```
Navegador (index.html)
       ↓
  script.js envia mensagem
       ↓
  server.py recebe (porta 5000)
       ↓
  ia.py chama a API da Anthropic
       ↓
  Resposta da Alma volta ao navegador
```

A chave da API fica protegida no servidor Python — nunca é exposta no navegador.

---

## Personalizar a Alma

Para mudar a personalidade ou as regras de comportamento da Alma,
edite o `SYSTEM_PROMPT` dentro de `server/ia.py`.
