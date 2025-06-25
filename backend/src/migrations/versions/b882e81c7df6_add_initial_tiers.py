"""add_initial_tiers

Revision ID: b882e81c7df6
Revises: cd7553a9a2fb
Create Date: 2025-06-20 18:23:54.054103

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session

from sqlalchemy.dialects.postgresql import UUID 
import uuid as uuid_pkg
# revision identifiers, used by Alembic.
revision: str = 'b882e81c7df6'
down_revision: Union[str, None] = 'cd7553a9a2fb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

tier_table = sa.table(
    "tier",
    sa.column("id", sa.Integer),
    sa.column("name", sa.String),
    sa.column("uuid", UUID),
    sa.column("is_deleted", sa.Boolean),
)



def upgrade() -> None:
    bind = op.get_bind()
    session = Session(bind=bind)

    query = sa.select(tier_table)
    existing_tier_table_data = session.execute(query).fetchone()
    if existing_tier_table_data:
        print("Tier table data already exists")
        return

    # add 3 tier: free, paid, enterprise
    tiers_data = [
        {
            "name": "free",
            "uuid": uuid_pkg.uuid4(),
            "is_deleted": False,
        },
        {
            "name": "paid", 
            "uuid": uuid_pkg.uuid4(),
            "is_deleted": False,
        },
        {
            "name": "enterprise",
            "uuid": uuid_pkg.uuid4(),
            "is_deleted": False,
        }
    ]

    for tier_data in tiers_data:
        op.execute(
            tier_table.insert().values(**tier_data)
        )

def downgrade() -> None:
    op.execute(
        tier_table.delete().where(tier_table.c.name.in_(["free", "paid", "enterprise"]))
    )
