import paramiko

key = paramiko.RSAKey.from_private_key_file(r'C:\Users\dkgl1\.ssh\server_key.pem')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname='80.225.208.24', username='ubuntu', pkey=key)

cmd = """python3 -c "
import sys, os
sys.path.insert(0, '/home/ubuntu/TRIP_Planner_UAT/backend')
from learning.db import SessionLocal, LearningClass, LearningSubject
os.chdir('/home/ubuntu/TRIP_Planner_UAT/backend')
db = SessionLocal()
print('=== REMOTE UAT CLASSES ===')
for c in db.query(LearningClass).all():
    subs = db.query(LearningSubject).filter_by(class_id=c.id).all()
    print(f'ID: {c.id} | Level: {c.level} | Name: \"{c.name}\" | Subjects: {[s.name for s in subs]}')
db.close()
" """

stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
client.close()
