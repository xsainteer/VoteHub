# 🗳️ VoteHub

**VoteHub** is a lightweight voting platform built with Blazor Server and Dapper.  
Designed to provide a fast and transparent way to organize, manage, and analyze voting processes.

## 🚀 Features

- Create and manage votes/polls
- Real-time vote tracking (Interactive Server)
- User authentication and roles (Identity 2)
- Results dashboard and analytics

## 🛠️ Technologies

- **Blazor Server** – UI framework for real-time .NET applications  
- **Entity Framework** – ORM to manipulate data in databases. 
- **PostgreSQL** – Relational database
- **Authentication** – Identity 2.0

## 📦 Project Structure

- `Domain/` – Core models and logic
- `Infrastructure/` –Database logic and external services
- `Application/` – business logic
- `Presentation/` – Razor Pages(UI)

## 🧪 How to Run Locally

- run `docker-compose.yml`

- execute commands

```bash
git clone https://github.com/xsainteer/VoteHub.git
cd VoteHub
dotnet build
```

- Configure `appsettings.json` and `dotnet user-secrets`
