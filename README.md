# 🗳️ VoteHub

**VoteHub** is a lightweight voting platform built with React and ASP.NET.  
Designed to provide a fast and transparent way to organize, manage, and analyze voting processes.

## 🚀 Features

- Create and manage votes/polls
- Real-time vote tracking (Interactive Server)
- User authentication and roles (Identity 2)
- Results dashboard and analytics

## 🛠️ Technologies

- **React** – UI framework for building interactive user interfaces.
- **Entity Framework** – ORM to manipulate data in databases. 
- **PostgreSQL** – Relational database
- **QDrant** – Vector database for storing and querying semantic values of the polls.
- **Ollama** - AI model for embedding.

## 📦 Project Structure

- `Domain/` – Core models and logic
- `Infrastructure/` –Database logic and external services
- `Application/` – business logic
- `frontend-react/` – React
- `API/` – ASP.NET Core Web API

## 🧪 How to Run Locally

- run `docker-compose.yml`

- execute commands

```bash
git clone https://github.com/xsainteer/VoteHub.git
cd VoteHub
dotnet build
```

- Configure `appsettings.json` and `dotnet user-secrets`
