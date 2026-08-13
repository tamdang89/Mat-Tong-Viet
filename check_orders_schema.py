import json
import urllib.request
import urllib.error

url = 'https://lnhrzszaxwihjccskjkx.supabase.co/rest/v1/orders?limit=1'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuaHJ6c3pheHdpaGpjY3Nramt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1OTk3MTIsImV4cCI6MjEwMjE3NTcxMn0.Sib4r4E7k8eeTSQPdL-Do8B2ayn68t5_jV1wtiFTxCs'

headers = {
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json'
}

req = urllib.request.Request(url, headers=headers)

try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        if isinstance(data, list) and len(data) > 0:
            print("Orders table columns:")
            for key in data[0].keys():
                print(f"  - {key}")
        else:
            print("Orders table is empty, checking via schema...")
            # Try to get column info
            schema_url = 'https://lnhrzszaxwihjccskjkx.supabase.co/rest/v1/information_schema.columns?table_name=eq.orders&select=column_name,data_type'
            schema_req = urllib.request.Request(schema_url, headers=headers)
            try:
                with urllib.request.urlopen(schema_req) as schema_response:
                    schema_data = json.loads(schema_response.read().decode())
                    print("Orders table columns (from schema):")
                    for col in schema_data:
                        print(f"  - {col['column_name']} ({col['data_type']})")
            except Exception as e:
                print(f"Could not fetch schema: {e}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}: {e.reason}")
    try:
        error_data = json.loads(e.read().decode())
        print(json.dumps(error_data, indent=2))
    except:
        pass
except Exception as e:
    print(f"Error: {e}")
