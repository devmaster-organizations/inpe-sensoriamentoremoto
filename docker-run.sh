#!/bin/bash

echo "🐳 Construindo imagem Docker..."
docker build -t inpe-agrirslab -f docker/Dockerfile .

echo "🚀 Iniciando container..."
docker run -p 3013:3013 -p 9090:9090 --name agrirslab-container inpe-agrirslab