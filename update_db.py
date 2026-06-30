import oracledb
import os

try:
    wallet_password = "Password123#"
    dsn = "dkgloracledb1_high"
    wallet_dir = r"C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1"
    
    conn = oracledb.connect(
        user="ADMIN",
        password=wallet_password,
        dsn=dsn,
        config_dir=wallet_dir,
        wallet_location=wallet_dir,
        wallet_password=wallet_password
    )
    cursor = conn.cursor()
    
    print("Adding columns to TRIPS...")
    try: cursor.execute("ALTER TABLE trips ADD status VARCHAR2(20) DEFAULT 'Planned'")
    except Exception as e: print(f"status column already exists or error: {e}")
        
    try: cursor.execute("ALTER TABLE trips ADD actual_start_time TIMESTAMP")
    except Exception as e: print(f"actual_start_time column already exists or error: {e}")
        
    print("Adding columns to TRIP_PARTICIPANTS...")
    try: cursor.execute("ALTER TABLE trip_participants ADD login_id VARCHAR2(50)")
    except Exception as e: print(f"login_id column already exists or error: {e}")

    try: cursor.execute("ALTER TABLE trip_participants ADD last_lat NUMBER")
    except Exception as e: print(f"last_lat column already exists or error: {e}")

    try: cursor.execute("ALTER TABLE trip_participants ADD last_lon NUMBER")
    except Exception as e: print(f"last_lon column already exists or error: {e}")

    try: cursor.execute("ALTER TABLE trip_participants ADD last_updated TIMESTAMP")
    except Exception as e: print(f"last_updated column already exists or error: {e}")

    conn.commit()
    print("Database updated successfully!")

except Exception as e:
    print(f"Database error: {e}")
finally:
    if 'conn' in locals():
        conn.close()
