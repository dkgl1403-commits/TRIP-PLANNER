import paramiko

key = paramiko.RSAKey.from_private_key_file(r'C:\Users\dkgl1\.ssh\server_key.pem')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname='80.225.208.24', username='ubuntu', pkey=key)

cmd = """cd /home/ubuntu/TRIP_Planner_UAT/backend && PYTHONPATH=. python3 -c "
from learning.db import SessionLocal, LearningClass, LearningSubject
db = SessionLocal()
masters = db.query(LearningClass).filter_by(name='Masterclass').all()
print('FOUND MASTERCLASSES:', [(c.id, c.level, c.name) for c in masters])
for c in masters:
    if c.level == 11:
        print(f'Deleting old duplicate Masterclass level 11 (id: {c.id})')
        subs = db.query(LearningSubject).filter_by(class_id=c.id).all()
        for s in subs:
            db.delete(s)
        db.delete(c)
db.commit()
print('REMAINING CLASSES:')
for c in db.query(LearningClass).order_by(LearningClass.level.asc()).all():
    subs = db.query(LearningSubject).filter_by(class_id=c.id).all()
    print(f'Level {c.level}: {c.name} -> {[s.name for s in subs]}')
db.close()
" """

stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))

client.close()
