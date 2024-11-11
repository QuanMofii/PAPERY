
<!-- DOCTOC SKIP -->

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
🚀 Research Paper Chatbot Backend 🚀
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

This is **PAPERY** backend server.

- [`FastAPI`](https://fastapi.tiangolo.com): modern Python web framework for building APIs
- [`Pydantic V2`](https://docs.pydantic.dev/2.4/): the most widely used data Python validation library, rewritten in Rust [`(5x-50x faster)`](https://docs.pydantic.dev/latest/blog/pydantic-v2-alpha/)
- [`SQLAlchemy 2.0`](https://docs.sqlalchemy.org/en/20/changelog/whatsnew_20.html): Python SQL toolkit and Object Relational Mapper
- [`PostgreSQL`](https://www.postgresql.org) or [`MySQL`](https://www.mysql.com): Open source relational database management system
- [`Redis`](https://redis.io): Open source, in-memory data store used by millions as a cache, message broker and more.
- [`ARQ`](https://arq-docs.helpmanual.io) Job queues and RPC in python with asyncio and redis.
- [`Docker Compose`](https://docs.docker.com/compose/) With a single command, create and start all the services from your configuration.
- [`NGINX`](https://nginx.org/en/) High-performance low resource consumption web server used for Reverse Proxy and Load Balancing.

## Installation

Run the following command on your local environment:

```bash
git clone https://github.com/Toricat/PAPERY.git
cd papery/backend
```

## Quickstart

Follow these steps to install docker and run this project on your docker container:

### Docker Compose setup (Recommended)

1. Make sure you have 🔗 [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your machine

## Fully setup for local development 

Follow these steps to install and run this project on your machine:

### Set up prerequisites:
1. Install Python 3.12
2. Install poetry (Manage your Python package)
   
   ```bash
   pip install poetry 
   ```

### Set up project:
#### 0. Define Environment Variables (.env)
Based on .env.example file, create env file and define your environment variables.

#### 1. Run install dependencies

   ```bash
   poetry install
   ```

#### 2. Set up database
**2.1 Running PostgreSQL With Docker**

> \[!NOTE\]
> If you already have a PostgreSQL running, you may skip this step.

Install docker if you don't have it yet, then run:

```bash
docker pull postgres
```

And pick the port, name, user and password, replacing the fields:

```bash
docker run -d \
    -p {PORT}:{PORT} \
    --name {NAME} \
    -e POSTGRES_PASSWORD={PASSWORD} \
    -e POSTGRES_USER={USER} \
    postgres
```

Such as:

```bash
docker run -d \
    -p 5432:5432 \
    --name postgres \
    -e POSTGRES_PASSWORD=1234 \
    -e POSTGRES_USER=postgres \
    postgres
```
    
**2.2 Running redis With Docker**

> \[!NOTE\]
> If you already have a PostgreSQL running, you may skip this step.

Install docker if you don't have it yet, then run:

```bash
docker pull redis:alpine
```

And pick the name and port, replacing the fields:

```bash
docker run -d \
--name {NAME}  \
-p {PORT}:{PORT} \
redis:alpine
```

Such as

```bash
docker run -d \
--name redis  \
-p 6379:6379 \
redis:alpine
```

1. Run migrations

   ```bash
   poetry run alembic upgrade head
   ```


## Migrations

As during local development your app directory is mounted as a volume inside the container, you can also run the migrations with `alembic` commands inside the container and the migration code will be in your app directory (instead of being only inside the container). So you can add it to your git repository.

Make sure you create a "revision" of your models and that you "upgrade" your database with that revision every time you change them. As this is what will update the tables in your database. Otherwise, your application will have errors.

* Start an interactive session in the backend container:

```console
$ docker compose exec backend bash
```

* Alembic is already configured to import your SQLModel models from `./backend/app/models.py`.

* After changing a model (for example, adding a column), inside the container, create a revision, e.g.:

```console
$ alembic revision --autogenerate -m "Add column last_name to User model"
```

* Commit to the git repository the files generated in the alembic directory.

* After creating the revision, run the migration in the database (this is what will actually change the database):

```console
$ alembic upgrade head
```

If you don't want to use migrations at all, uncomment the lines in the file at `./backend/app/core/db.py` that end in:

```python
SQLModel.metadata.create_all(engine)
```

and comment the line in the file `scripts/prestart.sh` that contains:

```console
$ alembic upgrade head
```

## Contributing

Contributions are welcome from the community. If you would like to contribute to the project, please refer to the `CONTRIBUTING.md` file for more information.

## License

The MIT License (MIT)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Toricat/PAPERY&type=Date)](https://star-history.com/#Toricat/PAPERY&Date)
