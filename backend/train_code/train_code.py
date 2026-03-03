from sklearn.linear_model import LinearRegression
import numpy as np

def train_simple_model():
    print("Initializing training data...")
    
    # 1. Generate some dummy training data (e.g., predicting house prices)
    # X represents the feature (e.g., number of bedrooms)
    # y represents the target label (e.g., price)
    X_train = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
    y_train = np.array([200, 400, 600, 800, 1000])

    # 2. Initialize the AI model
    model = LinearRegression()

    print("Starting the training process...")
    
    # ❌ THE BROKEN LINE: 
    # Scikit-learn expects X_train to be a 2D matrix (rows and columns), 
    # but we passed it a 1D array. This will crash the training loop!
    model.fit(X_train, y_train)

    # 4. Output the results
    print("Training complete!")
    print("Model Weight (Coefficient):", model.coef_[0])

if __name__ == "__main__":
    try:
        train_simple_model()
    except Exception as e:
        print(f"\nCRASH DETECTED: {type(e).__name__}: {str(e)}")