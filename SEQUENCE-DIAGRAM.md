# Diagramas UML de Sequência - Sistema AgriRSLab

## 1. Upload de Notícia com Imagem

```mermaid
sequenceDiagram
    actor User as Usuário
    participant Browser as Navegador
    participant FrontHTML as Página Notícias<br/>(noticias.html)
    participant FrontJS as Script Notícias<br/>(noticias.js)
    participant FrontAPI as API Client<br/>(api/noticias.js)
    participant FrontServer as Frontend Server<br/>(Express :3021)
    participant BackServer as Backend Server<br/>(Express :3013)
    participant Multer as Multer<br/>(Upload Handler)
    participant Controller as Notícia Controller
    participant DB as PostgreSQL

    User->>Browser: Acessa #/noticias
    Browser->>FrontHTML: Carrega página
    FrontHTML->>FrontJS: initNoticias()
    
    Note over User,FrontHTML: Upload de Nova Notícia
    User->>FrontHTML: Preenche formulário<br/>(título, link, data, imagem)
    User->>FrontHTML: Clica em "Salvar"
    
    FrontHTML->>FrontJS: submit event
    FrontJS->>FrontJS: Cria FormData<br/>com campos + arquivo
    FrontJS->>FrontAPI: postNoticia(formData)
    
    FrontAPI->>FrontServer: POST /api/noticias<br/>(multipart/form-data)
    Note over FrontServer: Proxy Stream
    FrontServer->>BackServer: POST /api/noticias<br/>(stream direto)
    
    BackServer->>Multer: Processa multipart
    Multer->>Multer: Valida tipo<br/>(PNG/JPEG)
    Multer->>Multer: Salva em /uploads/<br/>timestamp-filename
    Multer->>Controller: req.file disponível
    
    Controller->>Controller: Extrai campos<br/>(titulo, link, postagem, exibir)
    Controller->>Controller: Monta path da imagem<br/>/uploads/arquivo.jpg
    Controller->>DB: INSERT INTO noticias<br/>(titulo, link, postagem, exibir, image)
    DB-->>Controller: RETURNING row
    
    Controller-->>BackServer: 201 JSON<br/>{message, noticia}
    BackServer-->>FrontServer: 201 JSON (stream)
    FrontServer-->>FrontAPI: 201 JSON
    FrontAPI-->>FrontJS: Promise resolve(data)
    
    FrontJS->>FrontJS: Mostra mensagem sucesso
    FrontJS->>FrontAPI: getNoticias()
    FrontAPI->>FrontServer: GET /api/noticias
    FrontServer->>BackServer: GET /api/noticias
    BackServer->>Controller: getAllNoticias()
    Controller->>DB: SELECT * FROM noticias<br/>WHERE exibir = TRUE<br/>ORDER BY idnoticia DESC
    DB-->>Controller: rows[]
    Controller-->>BackServer: 200 JSON rows
    BackServer-->>FrontServer: 200 JSON
    FrontServer-->>FrontAPI: 200 JSON
    FrontAPI-->>FrontJS: Promise resolve(noticias)
    
    FrontJS->>FrontJS: Limpa grid
    FrontJS->>FrontJS: criarCard() para cada notícia
    FrontJS->>Browser: Atualiza DOM com cards
    Browser->>User: Exibe lista atualizada
```

## 2. Busca de Notícias por Palavra-chave

```mermaid
sequenceDiagram
    actor User as Usuário
    participant Browser as Navegador
    participant SearchInput as Campo de Busca<br/>(#searchinput)
    participant FrontJS as Script Notícias<br/>(noticias.js)
    participant DOM as DOM Cards

    User->>SearchInput: Digita palavra-chave<br/>(ex: "soja")
    SearchInput->>FrontJS: input event
    
    FrontJS->>FrontJS: Lê valor .toLowerCase().trim()
    
    loop Para cada .page-card
        FrontJS->>DOM: Seleciona card
        FrontJS->>DOM: Lê h2.textContent
        FrontJS->>FrontJS: title.includes(searchValue)?
        
        alt Contém palavra
            FrontJS->>DOM: card.style.display = ''
            DOM->>Browser: Card visível
        else Não contém
            FrontJS->>DOM: card.style.display = 'none'
            DOM->>Browser: Card oculto
        end
    end
    
    Browser->>User: Mostra apenas cards<br/>com a palavra
```

## 3. Upload de Publicação com Imagem

```mermaid
sequenceDiagram
    actor User as Usuário
    participant Browser as Navegador
    participant FrontHTML as Página Publicações<br/>(publicacoes.html)
    participant FrontJS as Script Publicações<br/>(publicacoes.js)
    participant FrontAPI as API Client<br/>(api/publicacoes.js)
    participant FrontServer as Frontend Server<br/>(Express :3021)
    participant BackServer as Backend Server<br/>(Express :3013)
    participant Multer as Multer<br/>(Upload Handler)
    participant Controller as Publicação Controller
    participant DB as PostgreSQL

    User->>Browser: Acessa #/publicacoes
    Browser->>FrontHTML: Carrega página
    FrontHTML->>FrontJS: initPublicacoes()
    
    Note over User,FrontHTML: Upload de Nova Publicação
    User->>FrontHTML: Preenche formulário<br/>(texto, ano, link, doi, imagem)
    User->>FrontHTML: Clica em "Salvar"
    
    FrontHTML->>FrontJS: submit event
    FrontJS->>FrontJS: Cria FormData<br/>com campos + arquivo
    FrontJS->>FrontAPI: postPublicacao(formData)
    
    FrontAPI->>FrontServer: POST /api/publicacoes<br/>(multipart/form-data)
    Note over FrontServer: Proxy Stream
    FrontServer->>BackServer: POST /api/publicacoes<br/>(stream direto)
    
    BackServer->>Multer: Processa multipart
    Multer->>Multer: Valida tipo<br/>(PNG/JPEG)
    Multer->>Multer: Salva em /uploads/<br/>timestamp-filename
    Multer->>Controller: req.file disponível
    
    Controller->>Controller: Extrai campos<br/>(texto, ano, link, doi)
    Controller->>Controller: Monta path da imagem<br/>/uploads/arquivo.jpg
    Controller->>DB: INSERT INTO publicacoes<br/>(texto, ano, link, doi, image)
    DB-->>Controller: RETURNING row
    
    Controller-->>BackServer: 201 JSON<br/>{message, publicacao}
    BackServer-->>FrontServer: 201 JSON (stream)
    FrontServer-->>FrontAPI: 201 JSON
    FrontAPI-->>FrontJS: Promise resolve(data)
    
    FrontJS->>FrontJS: Mostra mensagem sucesso
    FrontJS->>FrontAPI: getPublicacoes()
    FrontAPI->>FrontServer: GET /api/publicacoes
    FrontServer->>BackServer: GET /api/publicacoes
    BackServer->>Controller: getAllPublicacoes()
    Controller->>DB: SELECT * FROM publicacoes<br/>ORDER BY ano DESC
    DB-->>Controller: rows[]
    Controller-->>BackServer: 200 JSON rows
    BackServer-->>FrontServer: 200 JSON
    FrontServer-->>FrontAPI: 200 JSON
    FrontAPI-->>FrontJS: Promise resolve(publicacoes)
    
    FrontJS->>FrontJS: Limpa grid
    FrontJS->>FrontJS: criarCard() para cada publicação
    FrontJS->>Browser: Atualiza DOM com cards
    Browser->>User: Exibe lista atualizada
```

## 4. Busca de Publicações por Palavra-chave (Texto Completo)

```mermaid
sequenceDiagram
    actor User as Usuário
    participant Browser as Navegador
    participant SearchInput as Campo de Busca<br/>(#searchimput)
    participant FrontJS as Script Publicações<br/>(publicacoes.js)
    participant DOM as DOM Cards

    User->>SearchInput: Digita palavra-chave<br/>(ex: "soybean")
    SearchInput->>FrontJS: input event
    
    FrontJS->>FrontJS: Lê valor .toLowerCase().trim()
    
    loop Para cada .card-publicacoes
        FrontJS->>DOM: Seleciona card
        FrontJS->>DOM: Lê .card-body textContent<br/>(citação completa)
        FrontJS->>FrontJS: textContent.includes(searchValue)?
        
        alt Contém palavra
            FrontJS->>DOM: card.style.display = ''
            DOM->>Browser: Card visível
        else Não contém
            FrontJS->>DOM: card.style.display = 'none'
            DOM->>Browser: Card oculto
        end
    end
    
    Browser->>User: Mostra apenas cards<br/>com a palavra
```

## 5. Carregamento de Imagem (Upload via Backend)

```mermaid
sequenceDiagram
    actor User as Usuário
    participant Browser as Navegador
    participant ImgTag as <img src="/uploads/...">
    participant FrontServer as Frontend Server<br/>:3021
    participant BackServer as Backend Server<br/>:3013
    participant FileSystem as Disco<br/>(backend/src/uploads/)

    Note over Browser,FileSystem: Card renderizado com src="/uploads/arquivo.jpg"
    
    Browser->>ImgTag: Solicita carregar imagem
    ImgTag->>FrontServer: GET /uploads/arquivo.jpg
    
    Note over FrontServer: Proxy de Uploads<br/>(RegExp route)
    FrontServer->>FrontServer: Extrai subpath via RegExp
    FrontServer->>BackServer: GET /uploads/arquivo.jpg
    
    BackServer->>BackServer: express.static(/uploads)
    BackServer->>FileSystem: Lê arquivo
    FileSystem-->>BackServer: Buffer da imagem
    
    BackServer-->>FrontServer: 200 image/jpeg<br/>(buffer)
    FrontServer-->>ImgTag: 200 image/jpeg<br/>(buffer)
    ImgTag->>Browser: Renderiza imagem
    Browser->>User: Exibe imagem no card
```

## 6. Fluxo Completo: Página Carrega → Busca → Upload

```mermaid
sequenceDiagram
    actor User as Usuário
    participant Browser as Navegador
    participant Router as SPA Router<br/>(components.js)
    participant Page as Página Atual
    participant API as API Layer
    participant FrontServer as Frontend<br/>:3021
    participant BackServer as Backend<br/>:3013
    participant DB as PostgreSQL

    Note over User,DB: 1. Carregamento Inicial da Página
    User->>Browser: Navega para #/noticias
    Browser->>Router: hashchange event
    Router->>Router: getRouteSlug() = 'noticias'
    Router->>Router: renderPage()
    Router->>Page: Fetch noticias.html
    Page-->>Router: HTML content
    Router->>Browser: Injeta HTML no DOM
    Router->>Router: setPageStyle('noticias')
    Router->>Page: initNoticias()
    
    Page->>API: getNoticias()
    API->>FrontServer: GET /api/noticias
    FrontServer->>BackServer: GET /api/noticias (proxy)
    BackServer->>DB: SELECT * FROM noticias<br/>WHERE exibir = TRUE
    DB-->>BackServer: rows[]
    BackServer-->>FrontServer: JSON
    FrontServer-->>API: JSON
    API-->>Page: noticias[]
    
    Page->>Page: criarCard() para cada
    Page->>Browser: Renderiza cards
    Browser->>User: Exibe lista de notícias
    
    Note over User,DB: 2. Busca por Palavra-chave (Client-side)
    User->>Browser: Digita "arroz" no campo
    Browser->>Page: input event
    Page->>Page: Filtra cards no DOM<br/>(sem request ao backend)
    Page->>Browser: Oculta/mostra cards
    Browser->>User: Mostra apenas cards filtrados
    
    Note over User,DB: 3. Upload de Nova Notícia
    User->>Browser: Preenche form + seleciona imagem
    User->>Browser: Clica "Salvar"
    Browser->>Page: submit event
    Page->>Page: Cria FormData
    Page->>API: postNoticia(formData)
    API->>FrontServer: POST /api/noticias<br/>(multipart)
    FrontServer->>BackServer: POST /api/noticias<br/>(stream)
    BackServer->>BackServer: Multer processa upload
    BackServer->>DB: INSERT INTO noticias
    DB-->>BackServer: new row
    BackServer-->>FrontServer: 201 JSON
    FrontServer-->>API: 201 JSON
    API-->>Page: sucesso
    
    Page->>API: getNoticias() (refresh)
    API->>FrontServer: GET /api/noticias
    FrontServer->>BackServer: GET /api/noticias
    BackServer->>DB: SELECT *
    DB-->>BackServer: rows[]
    BackServer-->>FrontServer: JSON
    FrontServer-->>API: JSON
    API-->>Page: noticias[]
    
    Page->>Page: Limpa + renderiza cards
    Page->>Browser: Atualiza DOM
    Browser->>User: Lista atualizada com nova notícia
```

## Notas Técnicas

### Componentes do Sistema

1. **Frontend Server (Express :3021)**
   - Serve arquivos estáticos (HTML, CSS, JS, imagens locais)
   - Proxy para APIs do backend (evita CORS)
   - Proxy para uploads do backend (/uploads/*)

2. **Backend Server (Express :3013)**
   - API REST (/api/noticias, /api/publicacoes, /api/oportunidades)
   - Multer para upload de imagens
   - Serve arquivos de /uploads estaticamente
   - Conecta ao PostgreSQL

3. **PostgreSQL**
   - Tabelas: noticias, publicacoes, oportunidades
   - Campos image/imagem: VARCHAR com path relativo

### Fluxos de Dados

- **Upload**: Browser → Frontend Proxy → Backend Multer → Filesystem + DB
- **GET**: Browser → Frontend Proxy → Backend → PostgreSQL → JSON
- **Busca**: Client-side (filtra DOM sem request ao backend)
- **Imagens**: Browser → Frontend Proxy → Backend Static → Filesystem

### Segurança e Validação

- Multer valida tipo MIME (PNG/JPEG apenas)
- Backend valida campos obrigatórios
- Frontend mostra feedback de erro/sucesso
- Proxy preserva headers e status codes
