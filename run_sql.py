import oracledb
import traceback

wallet_dir = r"C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1"
pw = "Month@062026"

try:
    print("Connecting to Oracle Database...")
    connection = oracledb.connect(
        user="ADMIN",
        password=pw,
        dsn="dkgloracledb1_low",
        config_dir=wallet_dir,
        wallet_location=wallet_dir,
    )
    
    cursor = connection.cursor()
    
    create_table_sql = """
    CREATE TABLE users (
        user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        password_hash VARCHAR2(255) NOT NULL,
        role VARCHAR2(50) DEFAULT 'USER' NOT NULL,
        name VARCHAR2(100),
        gender VARCHAR2(20),
        phone VARCHAR2(20),
        email VARCHAR2(100),
        address VARCHAR2(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
    """
    
    create_index1 = "CREATE INDEX idx_users_name ON users(name)"
    create_index2 = "CREATE INDEX idx_users_phone ON users(phone)"
    
    print("Executing CREATE TABLE...")
    try:
        cursor.execute(create_table_sql)
        print("Table 'users' created successfully!")
    except Exception as e:
        print(f"Table error (it might already exist): {e}")

    print("Executing CREATE INDEX 1...")
    try:
        cursor.execute(create_index1)
        print("Index on 'name' created successfully!")
    except Exception as e:
        print(f"Index error: {e}")

    print("Executing CREATE INDEX 2...")
    try:
        cursor.execute(create_index2)
        print("Index on 'phone' created successfully!")
    except Exception as e:
        print(f"Index error: {e}")
    
    connection.commit()
    cursor.close()
    connection.close()
    print("\nAll database operations completed successfully!")

except Exception as e:
    print(f"Database connection failed: {e}")
    traceback.print_exc()
