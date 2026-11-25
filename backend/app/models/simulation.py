import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.enums import EnquiryChannel, IndustryVertical, RegionCode


def utc_now() -> datetime:
    return datetime.now(UTC)


class DemoSimulation(Base):
    __tablename__ = "demo_simulations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vertical: Mapped[IndustryVertical] = mapped_column(
        SAEnum(IndustryVertical, native_enum=False, length=32), nullable=False, index=True
    )
    channel: Mapped[EnquiryChannel] = mapped_column(
        SAEnum(EnquiryChannel, native_enum=False, length=32), nullable=False
    )
    region: Mapped[RegionCode] = mapped_column(
        SAEnum(RegionCode, native_enum=False, length=8), nullable=False
    )
    is_custom_enquiry: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    sample_enquiry: Mapped[str] = mapped_column(String(300), nullable=False)
    ip_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=utc_now, index=True
    )
