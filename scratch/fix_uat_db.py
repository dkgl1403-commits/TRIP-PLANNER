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
if not ai_subject:
    print("AI Subject not found")
    exit()

subject_id = ai_subject[0]

topics_order = [
    "The Dream of the Thinking Machine",
    "The AI Winters",
    "The Big Bang",
    "Linear Algebra & Vectors",
    "Calculus & Gradient Descent",
    "Probability & Statistics",
    "The Neural Network",
    "The Transformer Engine",
    "The Three Stages of Training",
    "The Compute Hierarchy",
    "Datacenters & Scalability",
    "The Ecosystem Map",
    "Beyond Chatbots",
    "Multi-Agent Swarms",
    "The Cutting Edge"
]

for idx, t_name in enumerate(topics_order):
    cursor.execute("UPDATE learning_topics SET order_idx = ? WHERE subject_id = ? AND name = ?", (idx + 1, subject_id, t_name))

conn.commit()
conn.close()
print("Fixed UAT database order_idx!")
"""

stdin, stdout, stderr = client.exec_command("cd /home/ubuntu/TRIP_Planner_UAT/backend && python3")
stdin.write(script)
stdin.channel.shutdown_write()
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
client.close()
