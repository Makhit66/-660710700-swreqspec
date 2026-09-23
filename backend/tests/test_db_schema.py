import os

from sqlalchemy import create_engine, inspect

from app.config import get_database_url
from app.db.models import AuditLog, Base, Booking, Slot


def test_database_config_uses_postgresql_default():
    original = os.environ.get("DATABASE_URL")
    os.environ.pop("DATABASE_URL", None)
    try:
        database_url = get_database_url()
    finally:
        if original is None:
            os.environ.pop("DATABASE_URL", None)
        else:
            os.environ["DATABASE_URL"] = original

    assert database_url.startswith("postgresql+psycopg://")


def test_schema_contains_booking_tables_and_constraints():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)

    tables = set(inspector.get_table_names())
    assert {"slots", "bookings", "audit_logs"}.issubset(tables)

    slots_columns = {column["name"] for column in inspector.get_columns("slots")}
    bookings_columns = {column["name"] for column in inspector.get_columns("bookings")}
    audit_columns = {column["name"] for column in inspector.get_columns("audit_logs")}

    assert {"slot_date", "start_time", "package_code", "capacity", "remaining"}.issubset(slots_columns)
    assert {"hn", "slot_id", "booking_date", "queue_no", "status", "created_at"}.issubset(bookings_columns)
    assert {"actor_id", "action", "hn", "accessed_at"}.issubset(audit_columns)
    assert "national_id" not in bookings_columns

    assert Slot.__tablename__ == "slots"
    assert Booking.__tablename__ == "bookings"
    assert AuditLog.__tablename__ == "audit_logs"
