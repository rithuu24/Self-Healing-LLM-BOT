import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

public class LoginAutomationTest {

    @Test
    public void testEnterpriseLoginFlow() {
        // Initialize the browser driver
        WebDriver driver = new ChromeDriver();
        
        try {
            // Navigate to the company portal
            driver.get("https://enterprise-portal.com/login");
            
            // Enter username and password
            driver.findElement(By.id("username")).sendKeys("admin_user");
            driver.findElement(By.id("password")).sendKeys("SecurePass123!");
            
            // ✅ FIXED: Updated button ID to match current frontend
            // The button ID was changed from 'login-btn-legacy' to 'submit-auth'
            WebElement loginButton = driver.findElement(By.id("submit-auth"));
            loginButton.click();
            
            // Verify successful login by checking the URL
            assertTrue(driver.getCurrentUrl().contains("/dashboard"));
            
        } finally {
            // Always close the browser
            driver.quit();
        }
    }
}