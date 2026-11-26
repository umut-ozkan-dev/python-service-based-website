from sqlalchemy import func, select

from app.models.simulation import DemoSimulation


async def test_simulation_preset_us_lead_ops_sms(client, db_maker):
    response = await client.post(
        "/api/v1/simulations/run",
        json={"vertical": "lead_ops", "channel": "sms", "region": "US"},
    )
    assert response.status_code == 200
    body = response.json()
    assert [step["elapsed_seconds"] for step in body["steps"]] == [0, 8, 23, 39, 51]
    assert all(step["requires_approval"] is False for step in body["steps"])
    assert body["webhook_json_preview"]["workflow"] == "lead_ops"
    assert body["webhook_json_preview"]["human_gate"]["required"] is False
    assert "explicit opt-in" in body["compliance_footer"]
    async with db_maker() as session:
        count = (await session.execute(select(func.count(DemoSimulation.id)))).scalar_one()
    assert count == 1


async def test_simulation_uk_dispatch_and_approval_gate(client):
    response = await client.post(
        "/api/v1/simulations/run",
        json={"vertical": "dispatch_quotes", "channel": "sms", "region": "UK"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "SW11" in body["steps"][0]["message_body"]
    assert "£3,400" in body["steps"][0]["message_body"]
    gate = next(step for step in body["steps"] if step["requires_approval"])
    assert gate["approval_action_label"] == "Approve custom quote draft"
    assert "+44" in body["compliance_footer"]
    assert "STOP" in body["compliance_footer"]
    assert body["webhook_json_preview"]["human_gate"]["required"] is True


async def test_simulation_client_admin_and_internal_ops(client):
    onboarding = await client.post(
        "/api/v1/simulations/run",
        json={"vertical": "client_admin", "channel": "email", "region": "US"},
    )
    assert onboarding.status_code == 200
    assert any(step["requires_approval"] for step in onboarding.json()["steps"])
    internal = await client.post(
        "/api/v1/simulations/run",
        json={"vertical": "internal_ops", "channel": "web_form", "region": "UK"},
    )
    assert internal.status_code == 200
    body = internal.json()
    assert "Support Plan v3" in body["steps"][1]["message_body"]
    assert all(step["requires_approval"] is False for step in body["steps"])


async def test_simulation_custom_enquiry_interpolation_and_short_input_422(client):
    short = await client.post(
        "/api/v1/simulations/run",
        json={
            "vertical": "lead_ops",
            "channel": "web_form",
            "region": "US",
            "custom_enquiry": "too short",
        },
    )
    assert short.status_code == 422
    error = short.json()["error"]
    assert error["code"] == "VALIDATION_ERROR"
    assert "custom_enquiry" in error["field_errors"]

    custom = "Hi, how much is an urgent workflow review tomorrow evening?"
    response = await client.post(
        "/api/v1/simulations/run",
        json={
            "vertical": "lead_ops",
            "channel": "web_form",
            "region": "US",
            "custom_enquiry": custom,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["is_custom_enquiry"] is True
    assert body["steps"][0]["message_body"] == custom
    assert "Approved pricing" in body["steps"][1]["message_body"]
    assert "event_id" in body["webhook_json_preview"]
