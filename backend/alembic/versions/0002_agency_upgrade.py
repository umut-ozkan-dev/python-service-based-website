"""agency upgrade

Revision ID: 0002_agency
Revises: 0001_initial
Create Date: 2026-11-25 00:00:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "0002_agency"
down_revision = "0001_initial"
branch_labels = None
depends_on = None

_VERTICAL_UP = {
    "dental": "LEAD_OPS",
    "DENTAL": "LEAD_OPS",
    "medspa": "CLIENT_ADMIN",
    "MEDSPA": "CLIENT_ADMIN",
    "trades": "DISPATCH_QUOTES",
    "TRADES": "DISPATCH_QUOTES",
    "clinics_legal": "INTERNAL_OPS",
    "CLINICS_LEGAL": "INTERNAL_OPS",
}
_VERTICAL_DOWN = {
    "LEAD_OPS": "DENTAL",
    "lead_ops": "DENTAL",
    "CLIENT_ADMIN": "MEDSPA",
    "client_admin": "MEDSPA",
    "DISPATCH_QUOTES": "TRADES",
    "dispatch_quotes": "TRADES",
    "INTERNAL_OPS": "CLINICS_LEGAL",
    "internal_ops": "CLINICS_LEGAL",
}


def _remap(table: str, column: str, mapping: dict[str, str]) -> None:
    for old, new in mapping.items():
        statement = sa.text(f"UPDATE {table} SET {column} = :new WHERE {column} = :old")
        op.execute(statement.bindparams(new=new, old=old))


def upgrade() -> None:
    _remap("leads", "vertical", _VERTICAL_UP)
    _remap("demo_simulations", "vertical", _VERTICAL_UP)
    with op.batch_alter_table("leads") as batch:
        batch.alter_column("phone", existing_type=sa.String(length=32), nullable=True)
        batch.alter_column("monthly_lead_volume", existing_type=sa.String(length=32), nullable=True)
        batch.add_column(
            sa.Column("team_size", sa.String(length=32), nullable=False, server_default="GROWING")
        )
        batch.add_column(
            sa.Column(
                "automation_focus",
                sa.String(length=32),
                nullable=False,
                server_default="INBOUND_LEADS",
            )
        )


def downgrade() -> None:
    op.execute(sa.text("UPDATE leads SET phone = '+10000000000' WHERE phone IS NULL"))
    op.execute(
        sa.text(
            "UPDATE leads SET monthly_lead_volume = 'FROM_30_TO_75' "
            "WHERE monthly_lead_volume IS NULL"
        )
    )
    _remap("leads", "vertical", _VERTICAL_DOWN)
    _remap("demo_simulations", "vertical", _VERTICAL_DOWN)
    with op.batch_alter_table("leads") as batch:
        batch.drop_column("automation_focus")
        batch.drop_column("team_size")
        batch.alter_column("phone", existing_type=sa.String(length=32), nullable=False)
        batch.alter_column(
            "monthly_lead_volume", existing_type=sa.String(length=32), nullable=False
        )
