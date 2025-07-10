<!-- DOCTOC SKIP -->
# 📄 Papery Backend

<h1 align="center">
 <a href="https://www.papery.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/papery_logo.png"/>
    <img height="120" src="docs/images/papery_logo.png"/>
  </picture>
 </a>
 <br />
</h1>
<p align="center">
🚀 Research Paper Chatbot 🚀
</p>
<p align="center">
  <a href="https://www.papery.com/"><img src="https://img.shields.io/badge/Website-blue?logo=googlechrome&logoColor=white"/></a>
  <a href="https://docs.papery.com/"><img src="https://img.shields.io/badge/Docs-yellow?logo=gitbook&logoColor=white"/></a>
  <a href="https://discord.gg/MYEB3xQE"><img src="https://img.shields.io/discord/1300352164748591205?logo=discord&label=discord"/></a>
  <a href="https://github.com/Toricat/PAPERY"><img src="https://img.shields.io/github/stars/Toricat/PAPERY" /></a>
  <a href="https://github.com/Toricat/PAPERY/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Toricat/PAPERY"/></a>
  <!-- <a href="https://twitter.com/paperyai"><img src="https://img.shields.io/twitter/follow/paperyai?style=social"/></a> -->
  <!-- <a href="https://www.linkedin.com/company/papery-ai"><img src="https://img.shields.io/badge/Follow%20on%20LinkedIn-0077B5?logo=linkedin"/></a> -->
</p>

## I. About

**Papery Backend** is the backend service powering the Papery platform
This repository contains only the backend logic and APIs. If you're looking to contribute, deploy, or run the backend of Papery, this guide will walk you through everything you need to get started.

> ⚠️ This README covers only the **backend service** of Papery. For the full project or frontend, refer to the main repository structure.

---

## II. Features

- ⚡ **FastAPI** - Blazing-fast Python web framework  
- 🐘 **PostgreSQL** - Powerful and reliable relational database  
- 🚀 **ARQ Worker** - Background task processing with Redis  
- 🔐 **Authentication** - JWT-based login system  
- 🧰 **Modular Structure** - Well-organized project architecture  
- 🔄 **Docker Support** - Easy setup with `docker-compose`  
- 🌍 **CORS-Ready** - Configurable origin whitelisting  
- ♻️ **Client-Side Cache Middleware** - Optional caching layer  
- 🛡️ **Rate Limiting** - Redis-based rate limiter for endpoints  

---

## III. Requirements

Before running Papery backend, make sure you have the following installed:

| Tool            | Required | Notes                                      |
|-----------------|----------|--------------------------------------------|
| 🐍 Python       | ✅ Yes   | Version **3.11** recommended               |
| 🐳 Docker       | Optional | For easier setup with Docker Compose       |
| 🧪 Poetry       | ✅ Yes   | Python dependency manager                  |
| 📦 Git          | ✅ Yes   | To clone the repository                    |

### 🔧 How to install Python (if not available)

- **Windows**: Download from https://www.python.org/downloads/windows/ (check `Add Python to PATH`)  
- **macOS**:  
  ```bash
  brew install python@3.11
  ```
- **Linux (Debian/Ubuntu)**:  
  ```bash
  sudo apt update
  sudo apt install python3.11 python3.11-venv python3.11-dev
  ```

### 📌 Check Python version

```bash
python --version
# Should output: Python 3.11.x
```

---

## IV. Installation

Run the following commands in your terminal to clone and access the project:

```bash
git clone https://github.com/QuanMofii/PAPERY.git
cd PAPERY
```

---

## V. Environment Configuration

The project includes a pre-configured `.env.example` file with all the required environment variables.

### 📌 Step 1: Copy the example file

In the `backend/src/` folder, run:

```bash
cp .env.example .env
```

> 🪟 On Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

---

### 🛠️ Step 2: Edit the `.env` file based on your environment

Open `backend/src/.env` in a code editor (e.g. VS Code).  
Adjust the following variables depending on whether you're using **Docker Compose** or **Local Setup**.

---

#### ✅ If you're using **Docker Compose**:

Update the following:

```env
# PostgreSQL
POSTGRES_SERVER="db"

# MinIO
MINIO_ENDPOINT="http://minio:9000"

# Redis
REDIS_CACHE_HOST="redis"
REDIS_QUEUE_HOST="redis"
REDIS_RATE_LIMIT_HOST="redis"
```

> These values match the Docker service names defined in `docker-compose.yml`.

---

#### ✅ If you're running **locally** (without Docker):

Update the following:

```env
# PostgreSQL
POSTGRES_SERVER="localhost"

# MinIO
MINIO_ENDPOINT="http://localhost:9000"

# Redis
REDIS_CACHE_HOST="localhost"
REDIS_QUEUE_HOST="localhost"
REDIS_RATE_LIMIT_HOST="localhost"
```

> Make sure your local PostgreSQL and Redis services are running on the default ports (5432 for PostgreSQL, 6379 for Redis).

---

### 🔐 Security & Required Values

Some variables in `.env.example` are empty and **must be filled**:

```env
# --- Required secrets ---
SECRET_KEY=yourkey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

> 💡 You can generate a secret key using:
```bash
openssl rand -hex 32
```

---

### 📧 Email Settings

If you want to enable email features (like password recovery), fill in:

```env
SMTP_USER=youremail@gmail.com
SMTP_PASSWORD=your_app_password
```

Otherwise, leave them blank for development.


## VI. Usage

Papery Backend can be run in two main ways:

---

### 🔁 A. Run with Docker Compose (Recommended)

1. Make sure Docker is installed.
2. From the project root, run:

```bash
cd backend
docker-compose up --build
```

3. Open your browser:

- Swagger Docs: http://localhost:8000/docs  
- Redoc: http://localhost:8000/redoc

---

### ⚙️ B. Run From Scratch (Local Setup)

#### 1. Install Poetry

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

Verify:

```bash
poetry --version
```

#### 2. Install dependencies

```bash
cd backend
poetry install
poetry shell
```

#### 3. Start PostgreSQL locally

Option 1: Docker PostgreSQL (Recommended)

```bash
docker run --name papery-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=papery -p 5432:5432 -d postgres:13
```

Option 2: Install PostgreSQL manually and start it.

Optional: Access with [pgAdmin](https://www.pgadmin.org/) or [DBeaver](https://dbeaver.io/).

> Or run pgAdmin in Docker:

```bash
docker run -p 5050:80 -e PGADMIN_DEFAULT_EMAIL=admin@papery.io -e PGADMIN_DEFAULT_PASSWORD=admin -d dpage/pgadmin4
```

#### 4. Start Redis

```bash
docker run --name papery-redis -p 6379:6379 -d redis:alpine
```

#### 5. Migrate Database

```bash
cd src
poetry run alembic upgrade head
```

#### 6. Start MinIO locally

Option 1: Run MinIO with Docker

```bash
docker run -p 9000:9000 -p 9001:9001 \
  --name papery-minio \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  -v papery_minio_data:/data \
  quay.io/minio/minio server /data --console-address ":9001"
```

- ✅ Access console: http://localhost:9001  
- 🪪 Credentials:
  - Username: `minioadmin`
  - Password: `minioadmin`

Option 2: Install MinIO manually

- Download: https://min.io/download

**Linux/macOS**
```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
./minio server /data --console-address ":9001"
```

**Windows**
- Download EXE: https://dl.min.io/server/minio/release/windows-amd64/minio.exe
- Run in terminal:
```powershell
.\minio.exe server D:\minio-data --console-address ":9001"
```

#### 7. Run the backend server

```bash
cd src 
uvicorn app.main:app --reload
```

---

## VII. Project structure

> _Coming soon..._

---

## VIII. Contributing

Contributions are welcome from the community. If you would like to contribute to the project, please refer to the `CONTRIBUTING.md` file for more information.

## IX. References

- [FastAPI-boilerplate](https://github.com/igorbenav/FastAPI-boilerplate)
- [Repository layer](https://github.com/igorbenav/fastcrud)

## X. License

The MIT License (MIT)