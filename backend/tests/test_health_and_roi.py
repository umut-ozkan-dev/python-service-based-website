async def test_health_check_returns_200_and_connected_db(client):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["database"] == "connected"
    assert response.headers.get("X-Request-ID")


async def test_roi_calculator_us_default_benchmark(client):
    response = await client.post(
        "/api/v1/simulations/roi",
        json={
            "region": "US",
            "monthly_enquiries": 65,
            "avg_appointment_value": 850,
            "current_close_rate_pct": 22,
            "current_response_minutes": 120,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["currency_symbol"] == "$"
    assert body["setup_fee"] == 995
    assert body["monthly_fee"] == 497
    assert body["estimated_monthly_lost_revenue"] == 5834
    assert body["projected_recovered_revenue"] == 4376
    assert body["payback_days"] == 11
    assert body["payback_display"] == "11 days"


async def test_roi_calculator_uk_and_extreme_bounds_no_zero_division(client):
    response = await client.post(
        "/api/v1/simulations/roi",
        json={
            "region": "UK",
            "monthly_enquiries": 5,
            "avg_appointment_value": 100,
            "current_close_rate_pct": 60,
            "current_response_minutes": 5,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["currency_symbol"] == "£"
    assert body["setup_fee"] == 795
    assert body["monthly_fee"] == 397
    assert body["projected_recovered_revenue"] > 0
    assert body["payback_display"] == "90+ days"
