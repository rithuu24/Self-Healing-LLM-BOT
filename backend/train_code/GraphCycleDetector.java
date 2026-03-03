import java.util.ArrayList;
import java.util.List;

public class GraphCycleDetector {

    // Helper function to perform DFS and look for back-edges (cycles)
    private static boolean detectCycleDFS(int current, List<List<Integer>> adj, boolean[] visited, boolean[] recStack) {
        
        // If the node is already in the current recursion stack, we found a cycle!
        if (recStack[current]) {
            return true;
        }
        // If it's already visited and not in the stack, no cycle down this path
        if (visited[current]) {
            return false;
        }

        // Mark the current node as visited and add it to the recursion stack
        visited[current] = true;
        recStack[current] = true;

        // Traverse all neighbors
        for (int neighbor : adj.get(current)) {
            if (detectCycleDFS(neighbor, adj, visited, recStack)) {
                return true;
            }
        }

        // ❌ THE BROKEN LOGIC (The "Lingering Phantom" Trap):
        // In a directed graph, we must backtrack and remove the current node 
        // from the recursion stack once we finish exploring all its paths.
        // If we forget this line, cross-edges will be falsely identified as cycles!
        
        // recStack[current] = false;  <-- THIS CRITICAL LINE IS MISSING

        return false;
    }

    public static void main(String[] args) {
        System.out.println("Initializing Directed Graph Cycle Detection...");

        int vertices = 4;
        List<List<Integer>> adj = new ArrayList<>(vertices);
        for (int i = 0; i < vertices; i++) {
            adj.add(new ArrayList<>());
        }

        // Building a DAG (Directed Acyclic Graph) - It has NO cycles.
        // 0 -> 1
        // 0 -> 2
        // 1 -> 2
        // 2 -> 3
        adj.get(0).add(1);
        adj.get(0).add(2);
        adj.get(1).add(2);
        adj.get(2).add(3);

        boolean[] visited = new boolean[vertices];
        boolean[] recStack = new boolean[vertices];
        
        boolean hasCycle = false;
        for (int i = 0; i < vertices; i++) {
            if (detectCycleDFS(i, adj, visited, recStack)) {
                hasCycle = true;
                break;
            }
        }

        // Because of the bug, this will falsely output: "Graph contains a cycle: true"
        System.out.println("Graph contains a cycle: " + hasCycle);
    }
}