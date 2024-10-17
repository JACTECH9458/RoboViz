import statbotics
import json
import sys  # Import sys for flushing the output

sb = statbotics.Statbotics()

# Iterate over team IDs from 0 to 10,000
for team_id in range(10000):
    try:
        team_info = sb.get_team(team_id)  # Attempt to get the team data
        if team_info['active']:  # Check if the team is active
            # Print the team data as a JSON string for the Electron app to capture
            json_output = json.dumps({"team": team_info})  # Ensure valid JSON
            print(json_output)  # Print only JSON output
            sys.stdout.flush()  # Flush the output buffer
    except Exception as e:
        # If an error occurs (e.g., team doesn't exist), continue to the next team
        continue
