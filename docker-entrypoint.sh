#!/bin/sh
set -e
cd /app
# Volume anônimo em node_modules: sincroniza com package.json/package-lock após mudanças de dependências
npm install
exec "$@"
