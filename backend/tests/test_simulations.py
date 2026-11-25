from sqlalchemy import func, select

from app.models.simulation import DemoSimulation


async def test_simulation_preset_us_dental_sms(client, db_maker):
    response = await client.post(
        "/api/v1/simulations/run",
        json={"vertical": "dental", "channel": "sms", "region": "US"},
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body["steps"]) == 5
    assert [step["elapsed_seconds"] for step in body["steps"]] == [0, 8, 23, 39, 51]
    assert "$189" in body["steps"][1]["message_body"]
    assert "A2P 10DLC" in body["compliance_footer"]
    async with db_maker() as session:
        count = (await session.execute(select(func.count(DemoSimulation.id)))).scalar_one()
    assert count == 1


async def test_simulation_preset_uk_trades_sms_localization(client):
    response = await client.post(
        "/api/v1/simulations/run",
        json={"vertical": "trades", "channel": "sms", "region": "UK"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "combi boiler" in body["steps"][0]["message_body"]
    assert "£75" in body["steps"][1]["message_body"]
    assert body["crm_preview"]["estimated_value_display"] == "£740"
    assert "+44" in body["compliance_footer"]
    assert "STOP" in body["compliance_footer"]


async def test_simulation_custom_enquiry_interpolation_and_short_input_422(client):
    short = await client.post(
        "/api/v1/simulations/run",
        json={
            "vertical": "medspa",
            "channel": "web_form",
            "region": "US",
            "custom_enquiry": "too short",
        },
    )
    assert short.status_code == 422
    error = short.json()["error"]
    assert error["code"] == "VALIDATION_ERROR"
    assert "custom_enquiry" in error["field_errors"]

    custom = "Hi, how much is an urgent appointment tomorrow evening?"
    response = await client.post(
        "/api/v1/simulations/run",
        json={
            "vertical": "medspa",
            "channel": "web_form",
            "region": "US",
            "custom_enquiry": custom,
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["is_custom_enquiry"] is True
    assert body["steps"][0]["message_body"] == custom
    assert "$50" in body["steps"][1]["message_body"]
