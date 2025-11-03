# Frontend Dockerfile
FROM node:18
WORKDIR /app

# Instalar dependências básicas para o servidor estático
RUN npm init -y && npm install express cors

# Copiar arquivos do frontend
COPY . .

EXPOSE 3021
CMD ["node", "server.js"]