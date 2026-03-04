package backend;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.Test;

@SpringBootTest
@ActiveProfiles("test")
public class BackendApplicationTests extends AbstractTestNGSpringContextTests {

	@Test
	public void contextLoads() {
	}

}
