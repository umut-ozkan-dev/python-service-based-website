ADMIN = {"X-Admin-API-Key": "test-admin-secret-key-12345"}


def _lead_payload(**overrides):
    payload = {
        "full_name": "Alex Morgan",
        "work_email": "alex@yourbusiness.com",
        "phone": "+15125550194",
        "business_name": "Oakridge Dental Studio",
        "vertical": "dental",
        "region": "US",
        "monthly_lead_volume": "30_to_75",
        "preferred_time_window": "first_available",
        "sms_consent": False,
        "privacy_consent": True,
    }
    payload.update(overrides)
    return payload


async def test_admin_endpoints_reject_missing_or_wrong_api_key_with_401(client):
    missing = await client.get("/api/v1/admin/leads")
    assert missing.status_code == 401
    assert missing.json()["error"]["code"] == "UNAUTHORIZED"
    wrong = await client.get("/api/v1/admin/leads", headers={"X-Admin-API-Key": "wrong-key"})
    assert wrong.status_code == 401
    assert wrong.json()["error"]["code"] == "UNAUTHORIZED"


async def test_admin_list_and_detail_return_leads_dispatch_logs_and_simulations(client):
    created = await client.post("/api/v1/leads", json=_lead_payload())
    assert created.status_code == 201
    lead_id = created.json()["lead_id"]
    simulated = await client.post(
        "/api/v1/simulations/run",
        json={"vertical": "dental", "channel": "email", "region": "US"},
    )
    assert simulated.status_code == 200

    listing = await client.get("/api/v1/admin/leads", headers=ADMIN)
    assert listing.status_code == 200
    body = listing.json()
    assert body["total"] == 1
    assert len(body["recent_simulations"]) == 1

    detail = await client.get(f"/api/v1/admin/leads/{lead_id}", headers=ADMIN)
    assert detail.status_code == 200
    payload = detail.json()
    assert len(payload["dispatch_logs"]) == 4
    assert len(payload["consent_ip_hash"]) == 64
    assert payload["consent_ip_hash"] != "127.0.0.1"


async def test_admin_patch_lead_status_valid_and_invalid_transitions(client):
    created = await client.post("/api/v1/leads", json=_lead_payload(work_email="book@example.com"))
    lead_id = created.json()["lead_id"]
    booked = await client.patch(
        f"/api/v1/admin/leads/{lead_id}",
        headers=ADMIN,
        json={"response_status": "booked", "admin_notes": "Scheduled Thu 10am"},
    )
    assert booked.status_code == 200
    assert booked.json()["response_status"] == "booked"
    invalid = await client.patch(
        f"/api/v1/admin/leads/{lead_id}",
        headers=ADMIN,
        json={"response_status": "received"},
    )
    assert invalid.status_code == 400
    assert invalid.json()["error"]["code"] == "INVALID_STATUS_TRANSITION"


async def test_lead_submission_sliding_window_rate_limit_returns_429(client):
    for index in range(5):
        response = await client.post(
            "/api/v1/leads",
            json=_lead_payload(work_email=f"owner{index}@oakridge.example"),
        )
        assert response.status_code == 201
    blocked = await client.post(
        "/api/v1/leads",
        json=_lead_payload(work_email="overflow@oakridge.example"),
    )
    assert blocked.status_code == 429
    assert blocked.json()["error"]["code"] == "RATE_LIMIT_EXCEEDED"
    assert int(blocked.headers["Retry-After"]) >= 1
