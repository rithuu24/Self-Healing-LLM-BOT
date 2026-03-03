public class ArraySearcher {

    // Method to find the index of a target number in an array
    public static int findTarget(int[] numbers, int target) {
        
        // ❌ THE BROKEN LINE:
        // Using '<=' instead of '<' will cause an ArrayIndexOutOfBoundsException
        // when the loop tries to access numbers[numbers.length]
        for (int i = 0; i <= numbers.length; i++) {
            if (numbers[i] == target) {
                return i;
            }
        }
        return -1; // Return -1 if the target is not found
    }

    public static void main(String[] args) {
        int[] data = {10, 25, 32, 45, 50};
        int searchFor = 60; 
        
        System.out.println("Starting search operation...");
        
        try {
            int result = findTarget(data, searchFor);
            
            if (result != -1) {
                System.out.println("Target found at index: " + result);
            } else {
                System.out.println("Target not found in the array.");
            }
        } catch (Exception e) {
            System.out.println("CRASH DETECTED: " + e.toString());
        }
    }
}