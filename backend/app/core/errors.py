import logging

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = logging.getLogger("relay60")


class AppError(Exception):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        field_errors: dict[str, str] | None = None,
        headers: dict[str, str] | None = None,
    ) -> None:
        self.status_code = status_code
        self.code = code
        self.message = message
        self.field_errors = field_errors
        self.headers = headers
        super().__init__(message)


def _error_body(code: str, message: str, field_errors: dict[str, str] | None) -> dict:
    return {"error": {"code": code, "message": message, "field_errors": field_errors}}


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(_request, exc: AppError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_body(exc.code, exc.message, exc.field_errors),
            headers=exc.headers,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_handler(_request, exc: RequestValidationError) -> JSONResponse:
        field_errors: dict[str, str] = {}
        for err in exc.errors():
            loc = err.get("loc") or ()
            key = str(loc[-1]) if loc else "body"
            if key in field_errors:
                continue
            message = str(err.get("msg", "Invalid value."))
            prefix = "Value error, "
            if message.startswith(prefix):
                message = message[len(prefix) :]
            field_errors[key] = message
        return JSONResponse(
            status_code=422,
            content=_error_body(
                "VALIDATION_ERROR",
                "One or more fields failed validation.",
                field_errors,
            ),
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(_request, exc: HTTPException) -> JSONResponse:
        headers = dict(exc.headers) if exc.headers else None
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_body(f"HTTP_{exc.status_code}", str(exc.detail), None),
            headers=headers,
        )

    @app.exception_handler(Exception)
    async def unhandled_handler(_request, exc: Exception) -> JSONResponse:
        logging.exception("Unhandled server error", exc_info=exc)
        return JSONResponse(
            status_code=500,
            content=_error_body(
                "INTERNAL_SERVER_ERROR",
                "An unexpected server error occurred. Please try again.",
                None,
            ),
        )
