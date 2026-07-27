import time

def main():
    print("Starting Oracle Keep-Alive Memory Allocator...")
    # 6 GB = 6 * 1024 * 1024 * 1024 bytes
    TARGET_BYTES = 6 * 1024 * 1024 * 1024
    
    print(f"Allocating {TARGET_BYTES / (1024**3):.2f} GB of memory...")
    try:
        # bytearray is a contiguous block of memory
        dummy_data = bytearray(TARGET_BYTES)
        print("Memory allocation successful. Sleeping indefinitely to hold memory...")
    except MemoryError:
        print("Failed to allocate memory! Check system limits.")
        return

    # Sleep infinitely so the memory is held
    while True:
        time.sleep(3600)

if __name__ == "__main__":
    main()
