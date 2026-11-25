import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import (
    DispatchChannel,
    DispatchStatus,
    IndustryVertical,
    LeadResponseStatus,
    MonthlyLeadVolume,
    PreferredTimeWindow,
    RegionCode,
)


def utc_now() -> datetime:
    return datetime.now(UTC)


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    work_email: Mapped[str] = mapped_column(String(254), nullable=False, index=True)
    phone: Mapped[str] = mapped_column(String(32), nullable=False)
    business_name: Mapped[str] = mapped_column(String(160), nullable=False)
    website_url: Mapped[str | None] = mapped_column(String(255), nullable=True, default=None)
    vertical: Mapped[IndustryVertical] = mapped_column(
        SAEnum(IndustryVertical, native_enum=False, length=32), nullable=False, index=True
    )
    region: Mapped[RegionCode] = mapped_column(
        SAEnum(RegionCode, native_enum=False, length=8), nullable=False, index=True
    )
    monthly_lead_volume: Mapped[MonthlyLeadVolume] = mapped_column(
        SAEnum(MonthlyLeadVolume, native_enum=False, length=32), nullable=False
    )
    current_tools: Mapped[str | None] = mapped_column(String(200), nullable=True, default=None)
    preferred_time_window: Mapped[PreferredTimeWindow] = mapped_column(
        SAEnum(PreferredTimeWindow, native_enum=False, length=32),
        nullable=False,
        default=PreferredTimeWindow.FIRST_AVAILABLE,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True, default=None)
    sms_consent: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    privacy_consent: Mapped[bool] = mapped_column(Boolean, nullable=False)
    consent_ip_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    consent_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    utm_source: Mapped[str | None] = mapped_column(String(100), nullable=True, default=None)
    utm_medium: Mapped[str | None] = mapped_column(String(100), nullable=True, default=None)
    utm_campaign: Mapped[str | None] = mapped_column(String(120), nullable=True, default=None)
    response_status: Mapped[LeadResponseStatus] = mapped_column(
        SAEnum(LeadResponseStatus, native_enum=False, length=32),
        nullable=False,
        default=LeadResponseStatus.RECEIVED,
        index=True,
    )
    admin_notes: Mapped[str | None] = mapped_column(Text, nullable=True, default=None)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )

    dispatch_logs: Mapped[list["LeadDispatchLog"]] = relationship(
        back_populates="lead",
        cascade="all, delete-orphan",
        order_by="LeadDispatchLog.created_at.asc()",
    )


class LeadDispatchLog(Base):
    __tablename__ = "lead_dispatch_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lead_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("leads.id", ondelete="CASCADE"), nullable=False, index=True
    )
    channel: Mapped[DispatchChannel] = mapped_column(
        SAEnum(DispatchChannel, native_enum=False, length=32), nullable=False
    )
    adapter_used: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[DispatchStatus] = mapped_column(
        SAEnum(DispatchStatus, native_enum=False, length=16), nullable=False
    )
    latency_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    payload_preview: Mapped[str] = mapped_column(Text, nullable=False)
    error_detail: Mapped[str | None] = mapped_column(String(500), nullable=True, default=None)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now
    )

    lead: Mapped["Lead"] = relationship(back_populates="dispatch_logs")
