from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session

from sqlalchemy.dialects.postgresql import UUID 

from app.core.security import get_password_hash
import uuid as uuid_pkg
from app.core.config import settings
from app.models.user import AuthProvider

# revision identifiers
revision: str = 'bd7553a9a2fb'
down_revision: Union[str, None] = '91cf26b4fe1a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

user_table = sa.table(
    "user",
    sa.column("id", sa.Integer),
    sa.column("username", sa.String),
    sa.column("email", sa.String),
    sa.column("hashed_password", sa.String),
    sa.column("is_superuser", sa.Boolean),
    sa.column("is_active", sa.Boolean),
    sa.column("auth_type", sa.Enum(AuthProvider)),
    sa.column("uuid", UUID),
    sa.column("is_deleted", sa.Boolean),
)

def upgrade() -> None:
    bind = op.get_bind()
    session = Session(bind=bind)

    query = sa.select(user_table).where(user_table.c.is_superuser == True)
    existing_user = session.execute(query).fetchone()
    if existing_user:
        print("Super user already exists")
        return

    op.execute(
        user_table.insert().values(
            username=settings.ADMIN_USERNAME,
            email=settings.ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            is_superuser=True,
            is_active=True,
            auth_type=AuthProvider(settings.ADMIN_AUTH_TYPE),
            uuid=uuid_pkg.uuid4(),  
            is_deleted=False,
        )
    )

def downgrade() -> None:
    op.execute(
        user_table.delete().where(user_table.c.username == settings.ADMIN_USERNAME)
    )
