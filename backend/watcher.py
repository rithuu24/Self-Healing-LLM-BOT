import time
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from healer import trigger_marr_loop
from config import TEST_FILE, SOURCE_FILE

class AutoHealHandler(FileSystemEventHandler):
    def __init__(self):
        self.last_triggered = time.time()

    def on_modified(self, event):
        # Only care about changes to our specific test file
        if os.path.abspath(event.src_path) == os.path.abspath(TEST_FILE):
            
            # Debounce: VS Code sometimes triggers multiple 'save' events at once. 
            # This ensures we only run the healer once per save.
            current_time = time.time()
            if current_time - self.last_triggered > 2:
                self.last_triggered = current_time
                
                print(f"\n👀 Change detected in {os.path.basename(TEST_FILE)}...")
                print("🛡️ Analyzing code integrity...")
                
                # Trigger the exact same pipeline the frontend uses
                result = trigger_marr_loop(TEST_FILE, SOURCE_FILE)
                
                if result["status"] == "healed":
                    print("✨ AUTO-HEAL COMPLETE: The file has been fixed. Check VS Code!")
                elif result["status"] == "success":
                    print("✅ Code is healthy. No action needed.")
                else:
                    print("💀 Auto-Heal failed to fix the issue.")
                
                print("-" * 50)
                print("🛡️ Guardian Active. Watching for next save...")

def start_watcher():
    watch_dir = os.path.dirname(os.path.abspath(TEST_FILE))
    
    # Ensure the directory exists before watching
    if not os.path.exists(watch_dir):
        print(f"❌ Error: Cannot find the directory {watch_dir}")
        return

    event_handler = AutoHealHandler()
    observer = Observer()
    
    # Watch the directory
    observer.schedule(event_handler, path=watch_dir, recursive=False)
    
    print("=" * 50)
    print(f"🛡️  GUARDIAN ONLINE  🛡️")
    print(f"Watching: {TEST_FILE}")
    print("Press 'Ctrl + S' in VS Code to trigger auto-healing.")
    print("=" * 50)
    
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\n🛑 Guardian deactivated.")
    
    observer.join()

if __name__ == "__main__":
    start_watcher()