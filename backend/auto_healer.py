import time
import subprocess
import requests
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# The local backend URL (This matches your healer_backend.py running on port 8000)
API_URL = "http://127.0.0.1:8001/api/heal-code"

class AutoHealHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_modified = time.time()

    def on_modified(self, event):
        # Only trigger on Python files, and ignore directories
        if event.is_directory or not event.src_path.endswith(".py"):
            return
        
        # 🚨 CRITICAL: Ignore already fixed files and your server scripts to prevent infinite loops
        filename = os.path.basename(event.src_path)
        if "_fixed.py" in filename or filename in ["auto_healer.py", "healer_backend.py", "main.py", "web_backend.py"]:
            return

        # Debounce: Prevents the script from firing twice if your editor double-saves
        current_time = time.time()
        if current_time - self.last_modified < 2.0:
            return
        self.last_modified = current_time

        print(f"\n👀 [WATCHER] Detected save on: {filename}")
        self.run_and_heal(event.src_path)

    def run_and_heal(self, filepath):
        print(f"⚙️ [WATCHER] Running {os.path.basename(filepath)} to check for errors...")
        
        # Execute the python file and capture the output and errors
        result = subprocess.run(
            ["python", filepath], 
            capture_output=True, 
            text=True
        )

        # If it ran perfectly, do nothing!
        if result.returncode == 0:
            print("✅ [WATCHER] Code ran perfectly! No healing needed.")
            return

        # If it crashed, grab the exact terminal error message and the broken code
        print("❌ [WATCHER] Crash detected! Sending to Local AI for healing...")
        error_message = result.stderr.strip()
        
        with open(filepath, "r", encoding="utf-8") as file:
            source_code = file.read()

        payload = {
            "language": "python",
            "error_message": error_message,
            "source_code": source_code
        }

        try:
            # Send the payload to your local GPU backend
            response = requests.post(API_URL, json=payload)
            
            if response.status_code == 200:
                ai_data = response.json()
                
                # Create the new filename (e.g., test_script.py becomes test_script_fixed.py)
                fixed_filepath = filepath.replace(".py", "_fixed.py")
                
                # Save the AI's fixed code
                with open(fixed_filepath, "w", encoding="utf-8") as f:
                    f.write(ai_data.get("fixed_code", ""))
                
                print(f"✨ [WATCHER] Healing Complete!")
                print(f"🧠 AI Explanation: {ai_data.get('explanation')}")
                print(f"📁 Fixed code safely saved to: {os.path.basename(fixed_filepath)}")
            else:
                print(f"⚠️ [WATCHER] Backend Error: Status {response.status_code}")
                print(response.text)
                
        except requests.exceptions.ConnectionError:
            print("⚠️ [WATCHER] Connection Failed! Is your `healer_backend.py` running in another terminal?")

if __name__ == "__main__":
    path_to_watch = "."  # Watches the current folder you run the script in
    print("="*60)
    print(f"🛡️  Guardian Auto-Healer is now watching: {os.path.abspath(path_to_watch)}")
    print("   Make sure `python healer_backend.py` is running in another terminal.")
    print("   Create and save a broken Python file to test it!")
    print("="*60)

    event_handler = AutoHealHandler()
    observer = Observer()
    observer.schedule(event_handler, path_to_watch, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down Auto-Healer...")
        observer.stop()
    observer.join()