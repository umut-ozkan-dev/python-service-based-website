from pydantic import BaseModel, Field

from app.models.enums import RegionCode


class RoiCalculationRequest(BaseModel):
    region: RegionCode
    monthly_enquiries: int = Field(ge=5, le=1000)
    avg_appointment_value: int = Field(ge=100, le=10000)
    current_close_rate_pct: int = Field(ge=5, le=60)
    current_response_minutes: int = Field(ge=1, le=2880)


class RoiCalculationResponse(BaseModel):
    region: RegionCode
    currency_symbol: str
    estimated_monthly_lost_revenue: int
    projected_recovered_revenue: int
    projected_additional_bookings: float
    net_monthly_gain_after_fee: int
    setup_fee: int
    monthly_fee: int
    first_month_total_investment: int
    payback_days: int
    payback_display: str
