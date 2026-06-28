import oracledb

wallet_dir = r"C:\Personal\Projects\TRIP_Planner\Wallet_DKGLORACLEDB1"
pw = "Month@062026"

full_dsn = "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.ap-mumbai-1.oraclecloud.com))(connect_data=(service_name=gaaf864e3f72711_dkgloracledb1_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"

print("Initializing connection...")
try:
    connection = oracledb.connect(
        user="ADMIN",
        password=pw,
        dsn=full_dsn,
        wallet_location=wallet_dir,
        wallet_password=pw
    )
    
    print("Connected successfully!")
    cursor = connection.cursor()
    
    insert_sql = """
    INSERT INTO users (password_hash, role, name, gender, phone, email, address)
    VALUES (:1, :2, :3, :4, :5, :6, :7)
    """
    
    user_data = (
        "test_hash_password_123", 
        "ADMIN", 
        "John Doe", 
        "Male", 
        "+1234567890", 
        "john.doe@tripplanner.com", 
        "123 Cloud Way, Oracle City"
    )
    
    cursor.execute(insert_sql, user_data)
    connection.commit()
    print("User inserted successfully!")
    
    cursor.execute("SELECT user_id, name, email FROM users")
    for row in cursor:
        print(row)
        
    cursor.close()
    connection.close()

except Exception as e:
    print(f"Error: {e}")
