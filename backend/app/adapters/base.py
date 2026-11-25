from dataclasses import dataclass
from typing import Any, Protocol

from app.models.enums import DispatchChannel, DispatchStatus


@dataclass(frozen=True)
class DispatchResult:
    adapter_used: str
    status: DispatchStatus
    latency_ms: int
    payload_preview: str
    error_detail: str | None = None


class ChannelAdapter(Protocol):
    async def send(self, channel: DispatchChannel, payload: dict[str, Any]) -> DispatchResult: ...
