# DevTrack

DevTrack é uma plataforma para organizar trilhas de estudo, tópicos, projetos e progresso de aprendizado para desenvolvedores.

## Tecnologias

- Python
- Django
- Django REST Framework
- PostgreSQL
- Docker
- Docker Compose
- React com TypeScript

## Objetivo do projeto

Este projeto tem como objetivo praticar desenvolvimento fullstack com backend em Django, frontend moderno e ambiente conteinerizado com Docker.

## Como rodar o projeto

### 1. Subir o banco de dados

Na raiz do projeto, rode:

```bash
docker compose up -d
```

### 2. Criar e ativar o ambiente virtual

Na raiz do projeto, crie o ambiente virtual:

```bash
python -m venv .venv
```

Ative o ambiente virtual no Windows PowerShell:

```bash
.\.venv\Scripts\Activate.ps1
```

### 3. Configurar o backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie um arquivo `.env` dentro da pasta `backend` com base no arquivo `.env.example`.

Rode as migrations:

```bash
python manage.py migrate
```

### 4. Rodar o backend

Ainda dentro da pasta `backend`, rode:

```bash
python manage.py runserver
```

Acesse:

```txt
http://localhost:8000
```

## Status

Em desenvolvimento.