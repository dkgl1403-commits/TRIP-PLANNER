import paramiko

key = paramiko.RSAKey.from_private_key_file(r'C:\Users\dkgl1\.ssh\server_key.pem')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname='80.225.208.24', username='ubuntu', pkey=key, timeout=10)

script = """
import sqlite3

conn = sqlite3.connect('learning_local.db')
cursor = conn.cursor()

# Get AI subject ID
cursor.execute("SELECT id FROM learning_subjects WHERE name='Artificial Intelligence'")
ai_subject = cursor.fetchone()
if ai_subject:
    subject_id = ai_subject[0]
    cursor.execute("DELETE FROM learning_topics WHERE subject_id = ? AND name = ?", (subject_id, "The Aha Moment: Backpropagation"))
    conn.commit()
    print("Deleted 'The Aha Moment: Backpropagation' from UAT database!")
else:
    print("AI Subject not found")

conn.close()
"""

stdin, stdout, stderr = client.exec_command("cd /home/ubuntu/TRIP_Planner_UAT/backend && python3")
stdin.write(script)
stdin.channel.shutdown_write()
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
client.close()
