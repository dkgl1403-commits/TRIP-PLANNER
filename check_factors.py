from backend.finance_pipeline.db import SessionLocal, FinanceFactor

db = SessionLocal()
factors = db.query(FinanceFactor).all()

if not factors:
    print("No factors found in the database yet.")
else:
    for f in factors:
        print(f"- [{f.category}] {f.factor_name} (Confidence: {f.confidence_score}, Impact: {f.impact_weight})")

db.close()
