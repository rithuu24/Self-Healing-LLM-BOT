class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int x) { 
        val = x; 
    }
}

public class BSTValidator {

    public static boolean isValidBST(TreeNode root) {
        if (root == null) {
            return true;
        }

        // ❌ THE BROKEN LOGIC (The "Local Only" Trap):
        // This only checks if the IMMEDIATE left and right children are valid.
        // It completely fails to enforce the core rule of a BST: 
        // ALL nodes in the right subtree must be strictly greater than the root,
        // and ALL nodes in the left subtree must be strictly less.
        
        if (root.left != null && root.left.val >= root.val) {
            return false;
        }
        if (root.right != null && root.right.val <= root.val) {
            return false;
        }

        // Recursively check the children
        return isValidBST(root.left) && isValidBST(root.right);
    }

    public static void main(String[] args) {
        System.out.println("Initializing Binary Search Tree Validation...");

        // Constructing a tricky tree that exposes the bug:
        //       5
        //      / \
        //     4   6
        //        / \
        //       3   7
        // 
        // Notice the '3' is on the right side of the '5', which violates BST rules!
        // But since 3 is less than its immediate parent 6, our broken code will think it's fine.

        TreeNode root = new TreeNode(5);
        root.left = new TreeNode(4);
        root.right = new TreeNode(6);
        root.right.left = new TreeNode(3); // The rule-breaker
        root.right.right = new TreeNode(7);

        boolean result = isValidBST(root);
        
        System.out.println("Is the tree a valid BST? " + result);
        // Our broken script will incorrectly print: "true"
    }
}