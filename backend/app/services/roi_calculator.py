import math

from app.models.enums import RegionCode
from app.schemas.roi import RoiCalculationRequest, RoiCalculationResponse


def _round_half_up(value: float) -> int:
    return math.floor(value + 0.5)


def calculate_roi(req: RoiCalculationRequest) -> RoiCalculationResponse:
    monthly_enquiries = req.monthly_enquiries
    avg_appointment_value = req.avg_appointment_value
    current_close_rate_pct = req.current_close_rate_pct
    current_response_minutes = req.current_response_minutes

    if req.region == RegionCode.US:
        currency_symbol = "$"
        setup_fee = 995
        monthly_fee = 497
    else:
        currency_symbol = "£"
        setup_fee = 795
        monthly_fee = 397
    first_month_total_investment = setup_fee + monthly_fee

    if current_response_minutes <= 5:
        uplift_factor = 0.12
    elif current_response_minutes <= 30:
        uplift_factor = 0.28
    elif current_response_minutes <= 120:
        uplift_factor = 0.48
    elif current_response_minutes <= 360:
        uplift_factor = 0.65
    else:
        uplift_factor = 0.80

    base_close_rate = current_close_rate_pct / 100.0
    optimal_close_rate = min(0.70, base_close_rate * (1.0 + uplift_factor))
    missed_appointments_raw = monthly_enquiries * max(0.0, optimal_close_rate - base_close_rate)
    estimated_monthly_lost_revenue = _round_half_up(missed_appointments_raw * avg_appointment_value)
    recovered_appointments_raw = missed_appointments_raw * 0.75
    projected_additional_bookings = round(recovered_appointments_raw * 10) / 10
    projected_recovered_revenue = _round_half_up(
        recovered_appointments_raw * avg_appointment_value
    )
    net_monthly_gain_after_fee = projected_recovered_revenue - monthly_fee

    if projected_recovered_revenue <= 0:
        payback_days = 365
        payback_display = "90+ days"
    else:
        daily_recovered = projected_recovered_revenue / 30.0
        payback_days = min(365, max(1, math.ceil(first_month_total_investment / daily_recovered)))
        payback_display = f"{payback_days} days" if payback_days <= 90 else "90+ days"

    return RoiCalculationResponse(
        region=req.region,
        currency_symbol=currency_symbol,
        estimated_monthly_lost_revenue=estimated_monthly_lost_revenue,
        projected_recovered_revenue=projected_recovered_revenue,
        projected_additional_bookings=projected_additional_bookings,
        net_monthly_gain_after_fee=net_monthly_gain_after_fee,
        setup_fee=setup_fee,
        monthly_fee=monthly_fee,
        first_month_total_investment=first_month_total_investment,
        payback_days=payback_days,
        payback_display=payback_display,
    )
