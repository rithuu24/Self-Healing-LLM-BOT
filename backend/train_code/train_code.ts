export {}; // Prevents block-scoped variable errors in TypeScript

function findTargetIndex(arr: number[], target: number): number {
    console.log(`Initializing Binary Search for target: ${target}`);
    
    let left = 0;
    let right = arr.length - 1;

    // We keep searching as long as the search window is valid
    while (left <= right) {
        // Calculate the middle index
        let mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            return mid; // Target found!
        } 
        else if (arr[mid] < target) {
            // ❌ THE BROKEN LOGIC (The Infinite Loop Trap):
            // If the target is greater than the mid value, we need to search the right half.
            // But by setting `left = mid` instead of `left = mid + 1`, 
            // the pointers can get permanently stuck on the same numbers when left and right are adjacent.
            left = mid; 
        } 
        else {
            // Searching the left half
            right = mid - 1; 
        }
    }

    return -1; // Target not found
}

// --- Test Execution ---
const sortedNumbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

// This will work perfectly:
console.log(`Result: ${findTargetIndex(sortedNumbers, 23)}\n`);

// 🚨 This will freeze your terminal in an infinite loop!
console.log("Searching for a number not in the array...");
console.log(`Result: ${findTargetIndex(sortedNumbers, 24)}`);