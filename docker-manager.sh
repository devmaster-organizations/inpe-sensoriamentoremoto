#!/bin/bash

# Script para gerenciar o projeto AgriRSLab com Docker Compose

show_help() {
    echo "🐳 AgriRSLab Docker Manager"
    echo ""
    echo "Uso: ./docker-manager.sh [comando]"
    echo ""
    echo "Comandos:"
    echo "  start    - Inicia o projeto"
    echo "  stop     - Para o projeto"
    echo "  restart  - Reinicia o projeto"
    echo "  logs     - Mostra os logs"
    echo "  build    - Reconstrói a imagem"
    echo "  clean    - Para e remove containers/imagens"
    echo "  status   - Mostra status dos containers"
    echo "  help     - Mostra esta ajuda"
    echo ""
}

case "$1" in
    "start")
        echo "🚀 Iniciando projeto AgriRSLab..."
        docker-compose up -d
        echo "✅ Projeto iniciado!"
        echo "📱 Acesse: http://localhost:9090"
        ;;
    
    "stop")
        echo "⏹️ Parando projeto..."
        docker-compose down
        echo "✅ Projeto parado!"
        ;;
    
    "restart")
        echo "🔄 Reiniciando projeto..."
        docker-compose restart
        echo "✅ Projeto reiniciado!"
        echo "📱 Acesse: http://localhost:9090"
        ;;
    
    "logs")
        echo "📋 Mostrando logs (Ctrl+C para sair)..."
        docker-compose logs -f
        ;;
    
    "build")
        echo "🔨 Reconstruindo imagem..."
        docker-compose build --no-cache
        echo "✅ Imagem reconstruída!"
        ;;
    
    "clean")
        echo "🧹 Limpando containers e imagens..."
        docker-compose down --rmi all --volumes --remove-orphans
        echo "✅ Limpeza concluída!"
        ;;
    
    "status")
        echo "📊 Status dos containers:"
        docker-compose ps
        ;;
    
    "help"|"")
        show_help
        ;;
    
    *)
        echo "❌ Comando desconhecido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac