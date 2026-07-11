from datetime import datetime, timedelta, timezone
def get_ist_now():
    return datetime.now(timezone.utc) + timedelta(hours=5, minutes=30)
