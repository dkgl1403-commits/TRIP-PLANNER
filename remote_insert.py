import oracledb
import os

wallet_dir = "/home/opc/Wallet_DKGLORACLEDB1"
pw = "Month@062026"

print("Connecting to Oracle Database from Cloud Instance...")
try:
    connection = oracledb.connect(
        user="ADMIN",
        password=pw,
        dsn="dkgloracledb1_low",
        config_dir=wallet_dir,
        wallet_location=wallet_dir,
    )
    
    cursor = connection.cursor()
    
    insert_sql = """
    INSERT INTO users (password_hash, role, name, gender, phone, email, address)
    VALUES (:1, :2, :3, :4, :5, :6, :7)
    """
    
    user_data = (
        "hashed_password_123", 
        "ADMIN", 
        "John Doe", 
        "Male", 
        "+1234567890", 
        "john.doe@tripplanner.com", 
        "123 Oracle Way, Cloud City"
    )
    
    cursor.execute(insert_sql, user_data)
    connection.commit()
    
    print("Test entry inserted successfully!")
    
    # Verify the insertion
    cursor.execute("SELECT user_id, name, email, created_at FROM users")
    for row in cursor:
        print(f"Verified User in DB: ID={row[0]}, Name={row[1]}, Email={row[2]}, Created={row[3]}")
        
    cursor.close()
    connection.close()
    print("Execution complete.")

except Exception as e:
    print(f"Failed to connect or insert: {e}")
