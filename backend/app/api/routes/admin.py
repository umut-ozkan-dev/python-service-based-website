from datetime import UTC, datetime
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.database import get_db_session
from app.core.errors import AppError
from app.core.security import require_admin_api_key
from app.models.enums import (
    ALLOWED_ADMIN_TRANSITIONS,
    IndustryVertical,
    LeadResponseStatus,
    RegionCode,
)
from app.models.lead import Lead
from app.models.simulation import DemoSimulation
from app.schemas.lead import LeadAdminUpdateRequest, LeadDetailResponse, LeadListResponse

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_admin_api_key)],
)


def _lead_filters(region, vertical, status):
    clauses = []
    if region is not None:
        clauses.append(Lead.region == region)
    if vertical is not None:
        clauses.append(Lead.vertical == vertical)
    if status is not None:
        clauses.append(Lead.response_status == status)
    return clauses


@router.get("/leads", response_model=LeadListResponse)
async def list_leads(
    session: Annotated[AsyncSession, Depends(get_db_session)],
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    region: RegionCode | None = None,
    vertical: IndustryVertical | None = None,
    status: LeadResponseStatus | None = None,
) -> LeadListResponse:
    clauses = _lead_filters(region, vertical, status)
    count_stmt = select(func.count(Lead.id))
    list_stmt = select(Lead).order_by(Lead.created_at.desc()).offset(offset).limit(limit)
    for clause in clauses:
        count_stmt = count_stmt.where(clause)
        list_stmt = list_stmt.where(clause)
    total = (await session.execute(count_stmt)).scalar_one()
    items = (await session.execute(list_stmt)).scalars().all()
    sims = (
        await session.execute(
            select(DemoSimulation).order_by(DemoSimulation.created_at.desc()).limit(10)
        )
    ).scalars().all()
    return LeadListResponse(
        total=total,
        limit=limit,
        offset=offset,
        items=list(items),
        recent_simulations=list(sims),
    )


async def _load_lead(session: AsyncSession, lead_id: str) -> Lead:
    stmt = select(Lead).options(selectinload(Lead.dispatch_logs)).where(Lead.id == lead_id)
    lead = (await session.execute(stmt)).scalar_one_or_none()
    if lead is None:
        raise AppError(
            status_code=404,
            code="LEAD_NOT_FOUND",
            message=f"Lead '{lead_id}' was not found.",
        )
    return lead


@router.get("/leads/{lead_id}", response_model=LeadDetailResponse)
async def get_lead(
    lead_id: str,
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> Lead:
    return await _load_lead(session, lead_id)


@router.patch("/leads/{lead_id}", response_model=LeadDetailResponse)
async def update_lead(
    lead_id: str,
    payload: LeadAdminUpdateRequest,
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> Lead:
    lead = await _load_lead(session, lead_id)
    if payload.response_status is not None and payload.response_status != lead.response_status:
        allowed = ALLOWED_ADMIN_TRANSITIONS[lead.response_status]
        target = payload.response_status
        if target not in allowed:
            raise AppError(
                status_code=400,
                code="INVALID_STATUS_TRANSITION",
                message=(
                    f"Cannot transition lead from '{lead.response_status.value}' "
                    f"to '{target.value}'."
                ),
            )
        lead.response_status = target
    if payload.admin_notes is not None:
        lead.admin_notes = payload.admin_notes
    lead.updated_at = datetime.now(UTC)
    await session.commit()
    return await _load_lead(session, lead_id)
