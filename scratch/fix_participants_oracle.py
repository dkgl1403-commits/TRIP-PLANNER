import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
from main import get_db_connection

conn = get_db_connection()
cursor = conn.cursor()

# Find all trips
cursor.execute('SELECT id, login_id FROM trips')
trips = cursor.fetchall()

for trip_id, login_id in trips:
    # Check if the creator is in trip_participants
    cursor.execute('SELECT id FROM trip_participants WHERE trip_id = :1 AND login_id = :2', [trip_id, login_id])
    if not cursor.fetchone():
        # Get user details from users table if we want, but name is enough
        cursor.execute('INSERT INTO trip_participants (trip_id, login_id, name, mobile, email) VALUES (:1, :2, :3, :4, :5)', [trip_id, login_id, login_id, '', ''])
        print(f'Added creator {login_id} to trip {trip_id}')

conn.commit()
conn.close()
print('Done!')
