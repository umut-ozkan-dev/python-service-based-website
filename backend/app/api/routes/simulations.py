from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.core.database import get_db_session
from app.core.rate_limit import extract_client_ip, rate_limiter
from app.core.security import hash_ip
from app.models.simulation import DemoSimulation
from app.schemas.roi import RoiCalculationRequest, RoiCalculationResponse
from app.schemas.simulation import SimulationRequest, SimulationResponse
from app.services.roi_calculator import calculate_roi
from app.services.simulator_engine import build_simulation_response

router = APIRouter(prefix="/simulations", tags=["simulations"])


@router.post("/run", response_model=SimulationResponse)
async def run_simulation(
    payload: SimulationRequest,
    request: Request,
    session: Annotated[AsyncSession, Depends(get_db_session)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> SimulationResponse:
    client_ip = extract_client_ip(request)
    await rate_limiter.check(
        "simulations", client_ip, settings.rate_limit_simulations_per_min
    )
    sim_response = build_simulation_response(payload)
    session.add(
        DemoSimulation(
            id=sim_response.simulation_id,
            vertical=sim_response.vertical,
            channel=sim_response.channel,
            region=sim_response.region,
            is_custom_enquiry=sim_response.is_custom_enquiry,
            sample_enquiry=sim_response.steps[0].message_body[:300],
            ip_hash=hash_ip(client_ip, settings.ip_hash_salt),
        )
    )
    await session.commit()
    return sim_response


@router.post("/roi", response_model=RoiCalculationResponse)
async def calculate_roi_route(
    payload: RoiCalculationRequest,
    request: Request,
    settings: Annotated[Settings, Depends(get_settings)],
) -> RoiCalculationResponse:
    client_ip = extract_client_ip(request)
    await rate_limiter.check("roi", client_ip, 30)
    return calculate_roi(payload)
