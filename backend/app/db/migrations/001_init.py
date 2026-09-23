from sqlalchemy.engine import Engine

from app.db.models import Base

# รองรับ: CON-TECH-01, DOM-PDPA-01, IF-HIS-01


def upgrade(engine: Engine) -> None:
    """Create the initial PostgreSQL schema for slots, bookings, and audit logs."""
    Base.metadata.create_all(bind=engine)
