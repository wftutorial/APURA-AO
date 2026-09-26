#!/bin/zsh
set -e

PROJECT_DIR="${0:A:h}"
cd "$PROJECT_DIR"

if ! command -v node >/dev/null 2>&1; then
  osascript -e 'display dialog "Node.js 18 ou superior é necessário para executar o sistema." buttons {"OK"} with icon stop'
  exit 1
fi

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if (( NODE_MAJOR < 18 )); then
  osascript -e 'display dialog "O sistema precisa do Node.js 18 ou superior." buttons {"OK"} with icon stop'
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "Instalando dependências..."
  npm install
fi

if [[ ! -f backend/.env ]]; then
  cp backend/.env.example backend/.env
  echo "Arquivo backend/.env criado a partir do exemplo."
fi

if ! curl -fsS http://localhost:4000/api/health >/dev/null 2>&1; then
  npm start > /tmp/apuracao-votos.log 2>&1 &
  SERVER_PID=$!
  trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

  for attempt in {1..30}; do
    if curl -fsS http://localhost:4000/api/health >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi

if ! curl -fsS http://localhost:4000/api/health >/dev/null 2>&1; then
  echo "Não foi possível iniciar o servidor. Veja /tmp/apuracao-votos.log"
  exit 1
fi

open http://localhost:4000
printf '\nSistema aberto em http://localhost:4000\n'
printf 'Mantenha esta janela aberta enquanto usar o sistema.\n\n'
if [[ -n "${SERVER_PID:-}" ]]; then
  wait "$SERVER_PID"
fi
