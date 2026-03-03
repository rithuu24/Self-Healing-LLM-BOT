def filter_inactive_users():
    print("Loading general user database...")
    
    # A standard list of dictionaries representing user data
    users = [
        {"id": 1, "name": "Alice", "status": "active"},
        {"id": 2, "name": "Bob", "status": "inactive"},
        {"id": 3, "name": "Charlie", "status": "inactive"},
        {"id": 4, "name": "Diana", "status": "active"}
    ]
    
    print(f"Total users before filtering: {len(users)}")
    
    # ❌ THE BROKEN LOGIC (The "List Mutation" Trap):
    # Modifying a list while iterating over it is a notorious Python bug!
    # When 'Bob' is removed, 'Charlie' shifts down into Bob's old index space.
    # The loop then steps forward, completely skipping Charlie. 
    for user in users:
        if user["status"] == "inactive":
            users.remove(user)
            
    # Charlie will incorrectly remain in the "active" list!
    print("\nActive users remaining:")
    for user in users:
        print(f"- {user['name']} (Status: {user['status']})")

if __name__ == "__main__":
    filter_inactive_users()