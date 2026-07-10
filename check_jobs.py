import urllib.request, json
jobs = json.loads(urllib.request.urlopen('https://api.github.com/repos/dkgl1403-commits/TRIP-PLANNER/actions/runs/28808119176/jobs').read())
for j in jobs['jobs']:
    print(f"{j['name']}: {j['conclusion']}")
    for step in j['steps']:
        print(f"  - {step['name']}: {step['conclusion']}")
