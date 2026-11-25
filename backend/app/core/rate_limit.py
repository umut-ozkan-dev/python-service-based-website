import asyncio
import math
import time
from collections import defaultdict, deque

from starlette.requests import Request

from app.core.errors import AppError


def extract_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip() or "127.0.0.1"
    if request.client and request.client.host:
        return request.client.host
    return "127.0.0.1"


class SlidingWindowRateLimiter:
    def __init__(self) -> None:
        self._buckets: dict[tuple[str, str], deque[float]] = defaultdict(deque)
        self._lock = asyncio.Lock()

    async def check(
        self,
        bucket_name: str,
        client_ip: str,
        max_requests: int,
        window_seconds: float = 60.0,
    ) -> None:
        async with self._lock:
            now = time.monotonic()
            dq = self._buckets[(bucket_name, client_ip)]
            while dq and dq[0] <= now - window_seconds:
                dq.popleft()
            if len(dq) >= max_requests:
                retry_after = max(1, math.ceil(window_seconds - (now - dq[0])))
                raise AppError(
                    status_code=429,
                    code="RATE_LIMIT_EXCEEDED",
                    message=(
                        f"Too many requests. Please wait {retry_after} seconds and try again."
                    ),
                    headers={"Retry-After": str(retry_after)},
                )
            dq.append(now)

    def reset(self) -> None:
        self._buckets.clear()


rate_limiter = SlidingWindowRateLimiter()
