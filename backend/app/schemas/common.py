from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ErrorDetail(BaseModel):
    code: str
    message: str
    field_errors: dict[str, str] | None = None


class ErrorResponse(BaseModel):
    error: ErrorDetail


class HealthCheckResponse(BaseModel):
    status: str
    service: str
    version: str
    database: str
    timestamp: datetime


class DispatchLogItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    channel: str
    adapter_used: str
    status: str
    latency_ms: int
    payload_preview: str
    error_detail: str | None
    created_at: datetime
