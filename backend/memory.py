import faiss
import numpy as np
import json
import os
from sentence_transformers import SentenceTransformer

# 1. Initialize the Model (Turns text into 384-dimension vectors)
model = SentenceTransformer('all-MiniLM-L6-v2')

# File to store the actual text data (FAISS only stores vectors)
DB_FILE = "fix_history.json"
INDEX_FILE = "faiss_index.bin"

class HealerMemory:
    def __init__(self):
        self.documents = []  # Stores: {"error": "...", "fix": "..."}
        self.index = None
        self.load_memory()

    def load_memory(self):
        """Loads existing memory from files."""
        if os.path.exists(DB_FILE):
            with open(DB_FILE, 'r') as f:
                self.documents = json.load(f)
        
        if os.path.exists(INDEX_FILE):
            self.index = faiss.read_index(INDEX_FILE)
        else:
            # Create a new FAISS index (Dimension 384 for MiniLM)
            self.index = faiss.IndexFlatL2(384)

    def save_memory(self):
        """Saves memory to disk."""
        with open(DB_FILE, 'w') as f:
            json.dump(self.documents, f)
        faiss.write_index(self.index, INDEX_FILE)

    def add_fix(self, error_msg, fixed_code):
        """
        Learns from a success! Adds the error & fix to memory.
        """
        # 1. Convert error text to vector
        vector = model.encode([error_msg])
        
        # 2. Add to FAISS index
        self.index.add(np.array(vector, dtype=np.float32))
        
        # 3. Store the text data
        self.documents.append({"error": error_msg, "fix": fixed_code})
        self.save_memory()
        print(f"🧠 Memory Updated: Stored fix for '{error_msg[:30]}...'")

    def find_similar_fix(self, current_error):
        """
        Searches memory for a similar past error.
        Returns the code fix if found, else None.
        """
        if self.index.ntotal == 0:
            return None

        # 1. Search FAISS for the closest vector
        query_vector = model.encode([current_error])
        distances, indices = self.index.search(np.array(query_vector, dtype=np.float32), 1)
        
        best_match_index = indices[0][0]
        distance = distances[0][0]

        # 2. Threshold (If distance is too high, it's not relevant)
        if distance < 1.0 and best_match_index != -1:
            match = self.documents[best_match_index]
            print(f"💡 Recall: Found a similar fix from the past! (Dist: {distance:.2f})")
            return match['fix']
        
        return None