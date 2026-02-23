import pynvml
import time
import sys

def monitor_vram(warning_threshold=90.0):
    try:
        # Initialize the NVIDIA library
        pynvml.nvmlInit()
        # Get the first GPU (Index 0)
        handle = pynvml.nvmlDeviceGetHandleByIndex(0)
        gpu_name = pynvml.nvmlDeviceGetName(handle)
        
        print(f"👁️ Started tracking GPU: {gpu_name}")
        print("Press CTRL+C to stop.\n")

        while True:
            # Fetch memory stats
            info = pynvml.nvmlDeviceGetMemoryInfo(handle)
            
            total_mb = info.total / (1024 ** 2)
            used_mb = info.used / (1024 ** 2)
            percent_used = (info.used / info.total) * 100

            # Format the output string
            status_line = f"VRAM Usage: {used_mb:.0f} MB / {total_mb:.0f} MB [{percent_used:.1f}%]"

            # Clear the current line and print the new status
            # Using \r brings the cursor back to the start of the line so it updates in place!
            if percent_used >= warning_threshold:
                sys.stdout.write(f"\r🚨 WARNING! DANGER ZONE: {status_line}      ")
                sys.stdout.flush()
            elif percent_used >= 75.0:
                sys.stdout.write(f"\r⚠️ High Load: {status_line}      ")
                sys.stdout.flush()
            else:
                sys.stdout.write(f"\r✅ Safe: {status_line}      ")
                sys.stdout.flush()

            # Check every 1 second
            time.sleep(1)

    except pynvml.NVMLError as e:
        print(f"\n❌ Failed to communicate with NVIDIA driver: {e}")
    except KeyboardInterrupt:
        print("\n\n🛑 Monitoring stopped.")
    finally:
        # Clean up
        try:
            pynvml.nvmlShutdown()
        except:
            pass

if __name__ == "__main__":
    monitor_vram()