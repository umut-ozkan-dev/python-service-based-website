from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import literal, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.core.database import get_db_session
from app.core.errors import AppError
from app.schemas.common import HealthCheckResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthCheckResponse)
async def health_check(
    session: Annotated[AsyncSession, Depends(get_db_session)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> HealthCheckResponse:
    try:
        await session.execute(select(literal(1)))
    except Exception as exc:
        raise AppError(
            status_code=500,
            code="DATABASE_UNAVAILABLE",
            message="Database health check failed.",
        ) from exc
    return HealthCheckResponse(
        status="ok",
        service=settings.app_name,
        version=settings.app_version,
        database="connected",
        timestamp=datetime.now(UTC),
    )
