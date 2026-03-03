// The URL where your FastAPI server is running
const API_URL = "http://127.0.0.1:8000/api/heal-code";

// 1. Define the exact structure we expect to send
interface RepairRequest {
    language: string;
    error_message: string;
    source_code: string;
}

// 2. We simulate a broken JavaScript/TypeScript function
const brokenTestData: RepairRequest = {
    language: "typescript",
    error_message: "TypeError: Cannot read properties of null (reading 'click')",
    source_code: `
function submitCheckout() {
    // The UI changed, and "submit-btn" no longer exists!
    const btn = document.getElementById('submit-btn');
    
    // This throws an error because btn is null
    btn.click();
}
`
};

// 3. The async function to call your Python backend
async function runTest() {
    console.log("🚀 Sending broken TypeScript code to Guardian Auto-Healer...");
    console.log("-".repeat(50));
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(brokenTestData),
        });

        if (response.ok) {
            // Parse the JSON returned by FastAPI / Ollama
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
runTest();