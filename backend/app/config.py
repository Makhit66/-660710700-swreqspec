import os

# รองรับ: CON-TECH-01

def get_database_url() -> str:
    """Return the configured database URL for PostgreSQL in production."""
    return os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@localhost:5432/booking",
    )
