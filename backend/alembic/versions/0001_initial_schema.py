"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-01-01 00:00:00.000000

"""

import sqlalchemy as sa

from alembic import op

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "leads",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("work_email", sa.String(length=254), nullable=False),
        sa.Column("phone", sa.String(length=32), nullable=False),
        sa.Column("business_name", sa.String(length=160), nullable=False),
        sa.Column("website_url", sa.String(length=255), nullable=True),
        sa.Column("vertical", sa.String(length=32), nullable=False),
        sa.Column("region", sa.String(length=8), nullable=False),
        sa.Column("monthly_lead_volume", sa.String(length=32), nullable=False),
        sa.Column("current_tools", sa.String(length=200), nullable=True),
        sa.Column("preferred_time_window", sa.String(length=32), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("sms_consent", sa.Boolean(), nullable=False),
        sa.Column("privacy_consent", sa.Boolean(), nullable=False),
        sa.Column("consent_ip_hash", sa.String(length=64), nullable=False),
        sa.Column("consent_timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("utm_source", sa.String(length=100), nullable=True),
        sa.Column("utm_medium", sa.String(length=100), nullable=True),
        sa.Column("utm_campaign", sa.String(length=120), nullable=True),
        sa.Column("response_status", sa.String(length=32), nullable=False),
        sa.Column("admin_notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_leads_work_email", "leads", ["work_email"])
    op.create_index("ix_leads_vertical", "leads", ["vertical"])
    op.create_index("ix_leads_region", "leads", ["region"])
    op.create_index("ix_leads_response_status", "leads", ["response_status"])
    op.create_index("ix_leads_created_at", "leads", ["created_at"])

    op.create_table(
        "lead_dispatch_logs",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("lead_id", sa.String(length=36), nullable=False),
        sa.Column("channel", sa.String(length=32), nullable=False),
        sa.Column("adapter_used", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("latency_ms", sa.Integer(), nullable=False),
        sa.Column("payload_preview", sa.Text(), nullable=False),
        sa.Column("error_detail", sa.String(length=500), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["lead_id"], ["leads.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_lead_dispatch_logs_lead_id", "lead_dispatch_logs", ["lead_id"])

    op.create_table(
        "demo_simulations",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("vertical", sa.String(length=32), nullable=False),
        sa.Column("channel", sa.String(length=32), nullable=False),
        sa.Column("region", sa.String(length=8), nullable=False),
        sa.Column("is_custom_enquiry", sa.Boolean(), nullable=False),
        sa.Column("sample_enquiry", sa.String(length=300), nullable=False),
        sa.Column("ip_hash", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_demo_simulations_vertical", "demo_simulations", ["vertical"])
    op.create_index("ix_demo_simulations_created_at", "demo_simulations", ["created_at"])


def downgrade() -> None:
    op.drop_index("ix_demo_simulations_created_at", table_name="demo_simulations")
    op.drop_index("ix_demo_simulations_vertical", table_name="demo_simulations")
    op.drop_table("demo_simulations")
    op.drop_index("ix_lead_dispatch_logs_lead_id", table_name="lead_dispatch_logs")
    op.drop_table("lead_dispatch_logs")
    op.drop_index("ix_leads_created_at", table_name="leads")
    op.drop_index("ix_leads_response_status", table_name="leads")
    op.drop_index("ix_leads_region", table_name="leads")
    op.drop_index("ix_leads_vertical", table_name="leads")
    op.drop_index("ix_leads_work_email", table_name="leads")
    op.drop_table("leads")
