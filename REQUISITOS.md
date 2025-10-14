
# 📋 Requisitos Funcionais e Não Funcionais para o Site do Laboratório AgriRS
## ⚙️ Requisitos Funcionais
### RF01 - Página Inicial (Home)
- **RF01.1** - Apresentar botões/menus de navegação para todas as páginas do site
- **RF01.2** - Exibir seções em destaque (cards) com chamadas para notícias, projetos, publicações
- **RF01.3** - Links para redes sociais e contato no rodapé da página

### RF02 - Página Sobre o AgriRS
- **RF02.1** - Descrever o laboratório, objetivos e foco de pesquisa
- **RF02.2** - **Página de Membros (Equipe/Team)**:
  - **RF02.2.1** - Listar integrantes com nome, foto, função e breve descrição
  - **RF02.2.2** - Categorizar por tipo: pesquisadores titulares, colaboradores, bolsistas, doutorandos, mestrandos, ex-membros
  - **RF02.2.3** - Ordenar cada categoria por ordem alfabética
- **RF02.3** - **Página de Colaboradores**:
  - **RF02.3.1** - Incluir colaboradores e financiadores (CNPq, CAPES, FAPESP)
- **RF02.4** - **Página de Vagas (Oportunidades)**:
  - **RF02.4.1** - Listar oportunidades: estágios, IC, pós-graduação e parcerias
  - **RF02.4.2** - Informar processo de candidatura (documentos, critérios, prazos)

### RF03 - Página de Atuação (Projetos/Projects)
- **RF03.1** - **Áreas de Atuação**:
  - **RF03.1.1** - Descrever áreas de pesquisa com textos explicativos
- **RF03.2** - **Projetos**:
  - **RF03.2.1** - Listar projetos com título, resumo, ano de início, status e equipe
  - **RF03.2.2** - Permitir inclusão de imagens ou links para mais informações

### RF04 - Página de Publicações
- **RF04.1** - Listar artigos, livros, capítulos com título, revista, autores, ano e link
- **RF04.2** - Sistema de busca por palavra-chave

### RF05 - Página de Notícias
- **RF05.1** - Permitir publicação de notícias com título, data, imagem e texto
- **RF05.2** - Organizar cronologicamente (mais recentes primeiro)

### RF06 - Página de Contato
- **RF06.1** - Formulário com campos: nome, e-mail, assunto e mensagem (redirect para e-mail do lab)
- **RF06.2** - Exibir informações institucionais: telefone, e-mail, endereço
- **RF06.3** - Incluir links para redes sociais do laboratório
- **RF06.4** - Mapa interativo para localização do laboratório no INPE

## ⚙️ Requisitos Não Funcionais

### RNF01 - Responsividade
- 📱 **Mobile First**: Otimizado para dispositivos móveis
- 💻 **Multi-device**: Compatível com tablets e desktops
- 🔄 **Layout Adaptativo**: Interface que se ajusta automaticamente

### RNF02 - Facilidade de Atualização
- 🔧 **CMS Simples**: Interface intuitiva para integrantes do laboratório
- 📝 **Edição de Conteúdo**: Atualização fácil de textos, imagens e notícias
- 👥 **Múltiplos Usuários**: Sistema de permissões para diferentes níveis

### RNF03 - Performance
- ⚡ **Carregamento Rápido**: Tempo de loading < 3 segundos
- 🖼️ **Imagens Otimizadas**: Compressão e formatos adequados (WebP, AVIF)
- 📊 **Core Web Vitals**: Pontuação verde no PageSpeed Insights

### RNF04 - Internacionalização
- 🇧🇷 **Português**: Versão completa em português brasileiro
- 🇺🇸 **Inglês**: Versão completa em inglês
- � **Troca de Idioma**: Botão de alternância entre idiomas

### RNF05 - Hospedagem e Infraestrutura
- 🌐 **Domínio Próprio**: URL personalizada para o laboratório
- 🔒 **HTTPS**: Certificado SSL/TLS obrigatório
- ☁️ **Servidor Confiável**: Uptime > 99.5%
- 💾 **Backup**: Sistema automatizado de backup

### RNF06 - Identidade Visual
- 🎨 **Design System**: Padronização visual consistente
- � **Branding INPE**: Alinhamento com identidade institucional
- ♿ **Acessibilidade**: Conformidade com WCAG 2.1 AA
- 🎯 **UX/UI**: Interface intuitiva e profissional