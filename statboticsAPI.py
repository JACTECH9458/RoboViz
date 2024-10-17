import statbotics
import json
import sys
import argparse  # For getting the team_id argument from Node.js

sb = statbotics.Statbotics()

# Setup argument parser to get the last processed team_id from Node.js
parser = argparse.ArgumentParser()
parser.add_argument("start_team_id", type=int, help="Team ID to start from")
args = parser.parse_args()

start_team_id = args.start_team_id  # Start from this team_id

# Iterate over team IDs starting from the last processed ID
for team_id in range(start_team_id, 11000):
    try:
        team_info = sb.get_team(team_id)
        if team_info['active']:
            json_output = json.dumps({"team": team_info})
            print(json_output)
            sys.stdout.flush()
    except Exception:
        continue
