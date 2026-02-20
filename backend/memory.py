import faiss
import numpy as np
import json
import os
import google.generativeai as genai
from config import GOOGLE_API_KEY, MEMORY_JSON, MEMORY_INDEX, EMBEDDING_MODEL

class RecallEngine:
    def __init__(self):
        # Configure the standard library
        genai.configure(api_key=GOOGLE_API_KEY)
        self.dimension = 768  # Standard dimension for Gemini text-embedding-004
        self.fixes = [] 
        
        # Safe loading with fallback: if files are corrupted or missing, start fresh
        if os.path.exists(MEMORY_INDEX) and os.path.exists(MEMORY_JSON):
            try:
                self.index = faiss.read_index(MEMORY_INDEX)
                with open(MEMORY_JSON, 'r') as f:
                    self.fixes = json.load(f)
            except Exception as e:
                print(f"⚠️ Warning: Memory files unreadable, starting fresh. {e}")
                self.index = faiss.IndexFlatL2(self.dimension)
                self.fixes = []
        else:
            self.index = faiss.IndexFlatL2(self.dimension)
    
    def _get_embedding(self, text):
        """Converts text (Error Log) into a Vector."""
        try:
            # Standard Library Embedding Call
            result = genai.embed_content(
                model=EMBEDDING_MODEL,
                content=text,
                task_type="retrieval_query"
            )
            # Extract embedding from dictionary and format for FAISS
            return np.array(result['embedding'], dtype='float32').reshape(1, -1)
        except Exception as e:
            print(f"⚠️ Embedding Error: {e}")
            # Return zero vector on failure to prevent server crash during streaming
            return np.zeros((1, self.dimension), dtype='float32')

    def retrieve(self, error_log):
        """
        The 'Recall' Step: Finds the most similar past fix.
        """
        # If the brain is empty, return early
        if self.index.ntotal == 0:
            return None

        query_vector = self._get_embedding(error_log)
        distances, indices = self.index.search(query_vector, k=1)
        
        # Safely extract FAISS results
        best_idx = int(indices[0][0])
        distance = float(distances[0][0])
        
        # Threshold: If distance is too high (low similarity), ignore it.
        # L2 Distance means smaller is better/closer.
        if best_idx != -1 and distance < 0.5: 
            # Boundary check to prevent IndexError
            if 0 <= best_idx < len(self.fixes):
                return self.fixes[best_idx]['fix']
        
        return None

    def memorize(self, error_log, fixed_code):
        """
        The 'Learning' Step: Saves a successful fix to FAISS.
        """
        vector = self._get_embedding(error_log)
        self.index.add(vector)
        
        self.fixes.append({
            "error": error_log, 
            "fix": fixed_code
        })
        
        # Save to Disk (Persistence) safely
        faiss.write_index(self.index, MEMORY_INDEX)
        with open(MEMORY_JSON, 'w') as f:
            json.dump(self.fixes, f, indent=4) # Added indent for readable JSON