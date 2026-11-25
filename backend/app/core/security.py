import hashlib
import hmac
from typing import Annotated

from fastapi import Depends, Header

from app.core.config import Settings, get_settings
from app.core.errors import AppError


def hash_ip(ip_address: str, salt: str) -> str:
    return hashlib.sha256(f"{ip_address}:{salt}".encode()).hexdigest()


async def require_admin_api_key(
    x_admin_api_key: Annotated[str | None, Header()] = None,
    settings: Annotated[Settings, Depends(get_settings)] = ...,  # noqa: B008
) -> None:
    if not x_admin_api_key:
        raise AppError(
            status_code=401,
            code="UNAUTHORIZED",
            message="Invalid or missing X-Admin-API-Key header.",
        )
    supplied = x_admin_api_key.encode("utf-8")
    expected = settings.admin_api_key.encode("utf-8")
    if not hmac.compare_digest(supplied, expected):
        raise AppError(
            status_code=401,
            code="UNAUTHORIZED",
            message="Invalid or missing X-Admin-API-Key header.",
        )
