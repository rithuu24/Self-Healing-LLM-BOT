import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class TestApi {
    public static void main(String[] args) {
        String apiUrl = "http://127.0.0.1:8000/api/heal-code";

        System.out.println("🚀 Sending broken Java (Selenium) code to Guardian Auto-Healer...");
        System.out.println("------------------------------------------------------------");

        // We use Java Text Blocks (introduced in Java 15) to easily format our JSON payload.
        // We simulate a classic Selenium JUnit test failing because an ID changed.
        String jsonPayload = """
        {
            "language": "java",
            "error_message": "org.openqa.selenium.NoSuchElementException: Unable to locate element: {\\"method\\":\\"id\\",\\"selector\\":\\"login-btn-legacy\\"}",
            "source_code": "import org.junit.Test;\\nimport org.openqa.selenium.By;\\nimport org.openqa.selenium.WebDriver;\\n\\npublic class LoginTest {\\n    WebDriver driver;\\n\\n    @Test\\n    public void userLogin() {\\n        driver.get(\\"https://example.com/login\\");\\n        \\n        // The frontend team changed this ID to 'submit-login' yesterday\\n        driver.findElement(By.id(\\"login-btn-legacy\\")).click();\\n    }\\n}"
        }
        """;

        try {
            // 1. Create the HTTP Client
            HttpClient client = HttpClient.newBuilder()
                    .version(HttpClient.Version.HTTP_2)
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            // 2. Build the POST Request
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            // 3. Send the request and get the response
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // 4. Print the results
            if (response.statusCode() == 200) {
                System.out.println("✅ HEALING SUCCESSFUL!\\n");
                System.out.println("📦 Raw AI JSON Response:");
                System.out.println(response.body());
            } else {
                System.out.println("❌ Server Error: " + response.statusCode());
                System.out.println(response.body());
            }

        } catch (java.io.IOException | InterruptedException e) {
            System.out.println("❌ Error: Could not connect to the server.");
            System.out.println("Make sure your FastAPI server is running with: uvicorn main:app --reload");
            System.err.println("Exception details: " + e.getMessage());
        }
    }
}