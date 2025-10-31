FROM node:18
WORKDIR /app

# Instala dependências
RUN npm init -y && npm install express cors

# Copia todos os arquivos do projeto
COPY . .

# Expõe a porta 3021
EXPOSE 3021

# Comando para iniciar o servidor
CMD ["node", "server.js"]