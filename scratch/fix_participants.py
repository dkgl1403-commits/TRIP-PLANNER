import sqlite3

conn = sqlite3.connect('backend/trip_planner.db')
cursor = conn.cursor()

# Find all trips
cursor.execute('SELECT id, login_id FROM trips')
trips = cursor.fetchall()

for trip_id, login_id in trips:
    # Check if the creator is in trip_participants
    cursor.execute('SELECT id FROM trip_participants WHERE trip_id = ? AND login_id = ?', (trip_id, login_id))
    if not cursor.fetchone():
        # Get user details from users table if we want, but name is enough
        cursor.execute('INSERT INTO trip_participants (trip_id, login_id, name, mobile, email) VALUES (?, ?, ?, ?, ?)', (trip_id, login_id, login_id, '', ''))
        print(f'Added creator {login_id} to trip {trip_id}')

conn.commit()
conn.close()
print('Done!')
