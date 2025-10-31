#!/bin/bash

echo "🐳 Iniciando projeto AgriRSLab no Docker..."

# Para o container se estiver rodando
docker stop agrirslab-app 2>/dev/null
docker rm agrirslab-app 2>/dev/null

# Constrói a imagem
echo "🔨 Construindo imagem Docker..."
docker build -f docker/Dockerfile -t agrirslab-app .

# Executa o container
echo "🚀 Iniciando container..."
docker run -d \
  --name agrirslab-app \
  -p 9090:9090 \
  agrirslab-app

echo "✅ Projeto iniciado!"
echo "📱 Acesse: http://localhost:9090"
echo "📋 Para ver logs: docker logs -f agrirslab-app"
echo "⏹️ Para parar: docker stop agrirslab-app"