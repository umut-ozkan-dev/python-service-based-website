import json
import logging
import time
from typing import Any

from app.adapters.base import DispatchResult
from app.models.enums import DispatchChannel, DispatchStatus

logger = logging.getLogger("relay60.dispatch")


class LocalLogAdapter:
    async def send(self, channel: DispatchChannel, payload: dict[str, Any]) -> DispatchResult:
        start = time.perf_counter()
        preview = json.dumps(payload, default=str)[:1000]
        logger.info("[LOCAL_DISPATCH] channel=%s payload=%s", channel.value, preview)
        latency_ms = max(1, int((time.perf_counter() - start) * 1000))
        return DispatchResult(
            adapter_used="local_console_db",
            status=DispatchStatus.SENT,
            latency_ms=latency_ms,
            payload_preview=preview,
            error_detail=None,
        )
