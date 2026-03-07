package backend;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.Assert;
import org.testng.annotations.Test;

@SpringBootTest
@ActiveProfiles("test")
public class BackendApplicationTests extends AbstractTestNGSpringContextTests {

	@Autowired
	private ApplicationContext applicationContext;

	@Autowired
	private Environment environment;

	@Test
	public void contextLoads() {
		Assert.assertNotNull(applicationContext);
	}

	@Test
	public void activeProfile_shouldContainTest() {
		Assert.assertTrue(Arrays.asList(environment.getActiveProfiles()).contains("test"));
	}

	@Test
	public void importantBeans_shouldBeCreated() {
		Assert.assertNotNull(applicationContext.getBean("chatbotController"));
		Assert.assertNotNull(applicationContext.getBean("gameController"));
	}

}
