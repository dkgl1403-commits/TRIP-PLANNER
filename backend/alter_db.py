from main import get_db_connection  
conn = get_db_connection()  
cursor = conn.cursor()  
try: cursor.execute('ALTER TABLE trips ADD description VARCHAR2(4000)')  
except Exception as e: print(e)  
conn.commit()  
conn.close()  
