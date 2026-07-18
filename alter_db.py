from finance_pipeline.db import engine
from sqlalchemy import text

with engine.begin() as conn:
    conn.execute(text("ALTER TABLE raw_market_data_v2 ALTER COLUMN volume TYPE BIGINT;"))
    print("Column altered.")
