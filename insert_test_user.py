import oracledb
import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

wallet_dir = os.getenv("DB_WALLET_DIR")
pw = os.getenv("DB_PASSWORD")
user = os.getenv("DB_USER")
dsn = os.getenv("DB_DSN")

print("Connecting to Oracle Database to insert test user...")
try:
    connection = oracledb.connect(
        user=user,
        password=pw,
        dsn=dsn,
        config_dir=wallet_dir,
        wallet_location=wallet_dir,
    )
    
    cursor = connection.cursor()
    
    insert_sql = """
    INSERT INTO users (password_hash, role, name, gender, phone, email, address)
    VALUES (:1, :2, :3, :4, :5, :6, :7)
    """
    
    # We use a dummy hash for now. user_id and created_at are auto-generated!
    user_data = (
        "hashed_password_123", 
        "ADMIN", 
        "Test User", 
        "Male", 
        "+1234567890", 
        "test@tripplanner.com", 
        "123 Oracle Way, Cloud City"
    )
    
    cursor.execute(insert_sql, user_data)
    connection.commit()
    
    print("Test entry inserted successfully!")
    
    # Verify the insertion
    cursor.execute("SELECT user_id, name, email, created_at FROM users")
    for row in cursor:
        print(f"Found User: ID={row[0]}, Name={row[1]}, Email={row[2]}, Created={row[3]}")
        
    cursor.close()
    connection.close()

except Exception as e:
    print(f"Failed to connect or insert: {e}")
