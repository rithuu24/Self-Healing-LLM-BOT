export {}; // This prevents the 'Cannot redeclare block-scoped variable' error!

// The URL where your FastAPI server is running
const API_URL = "http://127.0.0.1:8000/api/heal-code";

// 1. Define the exact structure we expect to send
interface RepairRequest {
    language: string;
    error_message: string;
    source_code: string;
}

// 2. We simulate a broken Cypress E2E test
const brokenCypressTest: RepairRequest = {
    language: "typescript",
    error_message: "AssertionError: Timed out retrying after 4000ms: Expected to find element: `[data-cy=login-btn]`, but never found it.",
    source_code: `
describe('Authentication Flow', () => {
    it('should log the user in successfully', () => {
        cy.visit('/login');
        
        // The frontend team changed the data attribute to data-testid="login-button"
        // This causes the E2E test to timeout and fail.
        cy.get('[data-cy=login-btn]').click();
        
        cy.get('input[name=username]').type('testuser');
        cy.get('input[name=password]').type('password123');
        cy.get('form').submit();
        
        cy.url().should('include', '/dashboard');
    });
});
`
};

// 3. The async function to call your Python backend
async function runCypressTest() {
    console.log("🚀 Sending broken Cypress test to Guardian Auto-Healer...");
    console.log("-".repeat(60));
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(brokenCypressTest),
        });

        if (response.ok) {
            const aiResult = await response.json();
            
            console.log("✅ HEALING SUCCESSFUL!\n");
            console.log("💡 AI Explanation:");
            console.log(`   ${aiResult.explanation}`);
            console.log(`   Confidence Score: ${aiResult.confidence}\n`);
            
            console.log("🛠️ FIXED CODE:");
            console.log(aiResult.fixed_code);
        } else {
            console.log(`❌ Server Error: ${response.status}`);
            const errorText = await response.text();
            console.log(errorText);
        }
    } catch (error) {
        console.log("❌ Error: Could not connect to the server.");
        console.log("Make sure your FastAPI server is running with: uvicorn main:app --reload");
        console.error(error);
    }
}

// Execute the test
runCypressTest();