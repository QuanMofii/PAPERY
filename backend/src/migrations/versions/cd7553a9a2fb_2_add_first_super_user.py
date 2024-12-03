"""Add first super user initialization

Revision ID: cd7553a9a2fb
Revises: c7de3d77bdaf
Create Date: 2024-12-02 10:27:06.391950

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session

from app.core.security import get_password_hash 
import uuid as uuid_pkg

# revision identifiers, used by Alembic.
revision: str = 'cd7553a9a2fb'
down_revision: Union[str, None] = 'c7de3d77bdaf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

user_table = sa.table(
    "user",
    sa.column("id", sa.Integer),
    sa.column("name", sa.String),
    sa.column("username", sa.String),
    sa.column("email", sa.String),
    sa.column("hashed_password", sa.String),
    sa.column("is_superuser", sa.Boolean),
    sa.column("uuid", sa.String),
    sa.column("is_deleted", sa.Boolean),

)
def upgrade() -> None:
    # Connect to session
    bind = op.get_bind()
    session = Session(bind=bind)
    
    # Check if super user exists
    query = sa.select(user_table).where(user_table.c.is_superuser == True)
    existing_user = session.execute(query).fetchone()
    if existing_user:
        print("Super user already exists")
        return

    # Create super user
    hashed_password = get_password_hash("password")
    op.execute(
        user_table.insert().values(
            name="Admin User",
            username="admin",
            email="admin@example.com",
            hashed_password=hashed_password,
            is_superuser=True,
            uuid=str(uuid_pkg.uuid4()),
            is_deleted=False,
    
        )
    )
   
def downgrade() -> None:
    # Delete super user
    op.execute(
        user_table.delete().where(user_table.c.username == "admin")
    )
