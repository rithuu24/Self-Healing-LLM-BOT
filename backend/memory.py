import faiss
import numpy as np
import json
import os
import google.generativeai as genai # <--- FIXED IMPORT
from config import GOOGLE_API_KEY, MEMORY_JSON, MEMORY_INDEX, EMBEDDING_MODEL

class RecallEngine:
    def __init__(self):
        # Configure the standard library
        genai.configure(api_key=GOOGLE_API_KEY)
        self.dimension = 768  # Standard dimension for text-embedding-004
        self.fixes = [] 
        
        # Load existing memory if available
        if os.path.exists(MEMORY_INDEX) and os.path.exists(MEMORY_JSON):
            self.index = faiss.read_index(MEMORY_INDEX)
            with open(MEMORY_JSON, 'r') as f:
                self.fixes = json.load(f)
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
            # Extract embedding from dictionary
            return np.array(result['embedding'], dtype='float32').reshape(1, -1)
        except Exception as e:
            print(f"⚠️ Embedding Error: {e}")
            # Return zero vector on failure to prevent crash
            return np.zeros((1, self.dimension), dtype='float32')

    def retrieve(self, error_log):
        """
        The 'Recall' Step: Finds the most similar past fix.
        """
        if self.index.ntotal == 0:
            return None

        query_vector = self._get_embedding(error_log)
        distances, indices = self.index.search(query_vector, k=1)
        
        best_idx = indices[0][0]
        distance = distances[0][0]
        
        # Threshold: If distance is too high (low similarity), ignore it.
        if best_idx != -1 and distance < 0.5: 
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
        
        # Save to Disk (Persistence)
        faiss.write_index(self.index, MEMORY_INDEX)
        with open(MEMORY_JSON, 'w') as f:
            json.dump(self.fixes, f, indent=2)