export {}; // Prevents block-scoped variable errors in TypeScript

// Define the structure for a single Node in the Linked List
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

function reverseList(head: ListNode | null): ListNode | null {
    console.log("Initializing Linked List Reversal...");
    
    let prev: ListNode | null = null;
    let curr: ListNode | null = head;

    while (curr !== null) {
        // ❌ THE BROKEN LOGIC (The "Severed Link" Trap):
        // We immediately overwrite curr.next with prev. 
        // Because we didn't save the original curr.next first, the rest 
        // of the linked list is permanently lost in memory!
        
        curr.next = prev;     // The link is broken here
        prev = curr;          // Move prev forward
        curr = curr.next;     // 🚨 BUG: curr is now pointing backwards to prev!
    }

    return prev;
}

// --- Test Execution ---
// Helper function to easily print the linked list
function printList(head: ListNode | null): string {
    let current = head;
    let result = [];
    while (current !== null) {
        result.push(current.val);
        current = current.next;
    }
    return result.join(" -> ") + " -> null";
}

// Create a simple Linked List: 1 -> 2 -> 3 -> 4 -> null
const node4 = new ListNode(4);
const node3 = new ListNode(3, node4);
const node2 = new ListNode(2, node3);
const headNode = new ListNode(1, node2);

console.log("Original List:  " + printList(headNode));

// Run the broken reversal function
const reversedHead = reverseList(headNode);

// Because of the bug, this will output: 1 -> null
// Nodes 2, 3, and 4 have been completely orphaned!
console.log("Reversed List:  " + printList(reversedHead));