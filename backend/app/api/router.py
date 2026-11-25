from fastapi import APIRouter

from app.api.routes import admin, health, leads, simulations

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health.router)
api_router.include_router(simulations.router)
api_router.include_router(leads.router)
api_router.include_router(admin.router)
