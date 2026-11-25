from collections.abc import AsyncGenerator

from sqlalchemy import event
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import StaticPool

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


def build_async_engine(db_url: str) -> AsyncEngine:
    if db_url.startswith("sqlite") and ":memory:" in db_url:
        engine = create_async_engine(
            db_url,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    elif db_url.startswith("sqlite"):
        engine = create_async_engine(db_url, connect_args={"check_same_thread": False})
    else:
        engine = create_async_engine(db_url, pool_pre_ping=True)

    if db_url.startswith("sqlite"):

        @event.listens_for(engine.sync_engine, "connect")
        def _enable_sqlite_fk(dbapi_connection, _connection_record) -> None:
            cursor = dbapi_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=ON")
            cursor.close()

    return engine


engine = build_async_engine(get_settings().async_database_url)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


def get_session_maker() -> async_sessionmaker[AsyncSession]:
    return async_session_maker


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session
