import json
import time
from typing import Any

import httpx

from app.adapters.base import DispatchResult
from app.models.enums import DispatchChannel, DispatchStatus


class HttpWebhookAdapter:
    def __init__(self, url: str, auth_token: str = "", timeout_seconds: float = 6.0) -> None:
        self.url = url
        self.auth_token = auth_token
        self.timeout_seconds = timeout_seconds

    async def send(self, channel: DispatchChannel, payload: dict[str, Any]) -> DispatchResult:
        start = time.perf_counter()
        preview = json.dumps(payload, default=str)[:1000]
        headers = {"Content-Type": "application/json"}
        if self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        body = {"event": channel.value, "source": "relay60", "data": payload}
        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                resp = await client.post(self.url, json=body, headers=headers)
            latency_ms = max(1, int((time.perf_counter() - start) * 1000))
            if 200 <= resp.status_code < 300:
                return DispatchResult(
                    adapter_used="http_webhook",
                    status=DispatchStatus.SENT,
                    latency_ms=latency_ms,
                    payload_preview=preview,
                    error_detail=None,
                )
            return DispatchResult(
                adapter_used="http_webhook",
                status=DispatchStatus.FAILED,
                latency_ms=latency_ms,
                payload_preview=preview,
                error_detail=f"HTTP {resp.status_code}"[:500],
            )
        except httpx.HTTPError as err:
            latency_ms = max(1, int((time.perf_counter() - start) * 1000))
            return DispatchResult(
                adapter_used="http_webhook",
                status=DispatchStatus.FAILED,
                latency_ms=latency_ms,
                payload_preview=preview,
                error_detail=str(err)[:500],
            )
