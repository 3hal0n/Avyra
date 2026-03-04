# TestNG Demo & Testing Guide

This file documents the 10-minute TestNG demonstration for the Avyra backend. It includes setup, commands, and short 2-minute speaking scripts for each team member.

Files added for the demo (under `backend/src/test/java`):

- `backend/src/test/java/backend/service/impl/GameServiceTest.java` — Dinil (fixtures)
- `backend/src/test/java/backend/controller/ReviewControllerAssertionTest.java` — Rukshan (assertions)
- `backend/src/test/java/backend/controller/ChatbotControllerDataProviderTest.java` — Migara (mocking + DataProvider)
- `backend/src/test/resources/testng.xml` — updated to include the demo classes

## Prerequisites

- Java 17
- Maven (wrapper included: `mvnw`)
- Internet access only for dependencies during first build

## Run Tests Locally

Unix / macOS:

```sh
cd backend
chmod +x mvnw || true
./mvnw -B test
```

Windows (PowerShell):

```powershell
cd backend
.\mvnw -B test
```

To run a single test class (example):

```sh
./mvnw -Dtest=backend.controller.ReviewControllerAssertionTest test
```

## Test Reports

After the test run, the TestNG report and XML are in:

```
backend/target/surefire-reports/
```

Open `backend/target/surefire-reports/index.html` in a browser to view the HTML report.

## pom.xml (TestNG setup reminder)

Ensure these test dependencies/plugins are present (already in project):

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-test</artifactId>
  <scope>test</scope>
  <exclusions> ... (JUnit excluded) ... </exclusions>
</dependency>

<dependency>
  <groupId>org.testng</groupId>
  <artifactId>testng</artifactId>
  <version>7.8.0</version>
  <scope>test</scope>
</dependency>

<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <version>3.1.2</version>
  <configuration>
    <suiteXmlFiles>
      <suiteXmlFile>src/test/resources/testng.xml</suiteXmlFile>
    </suiteXmlFiles>
  </configuration>
</plugin>
```

## Demo flow and 2-minute speaking scripts

Dinil — Initial Setup & Fixtures
- Show `pom.xml` TestNG dependency and that JUnit is excluded.
- Explain `@BeforeMethod`: opens Mockito mocks and constructs `GameServiceImpl` with a mock `GameRepository`.
- Explain `@AfterMethod`: closes mock context (`AutoCloseable`) and sets service to `null` — clears shared state between tests.
- Run `GameServiceTest` and point out fixture isolation: each test uses a fresh mock and service instance.
- Key takeaway: repeatable tests with clean setup/teardown.

Rukshan — Assertions
- Open `ReviewControllerAssertionTest`.
- Hard assertions: `Assert.assertEquals(response.getStatusCode(), HttpStatus.OK)` — stops test immediately on failure.
- Soft assertions: `SoftAssert` collects multiple checks (status, body non-null, size, comment) and reports them together at `softAssert.assertAll()`.
- Run test and show soft assertion behavior by temporarily introducing a failing expectation (optional during dry-run).
- Key takeaway: use hard assertions for critical stops and soft assertions for validating multiple related fields.

Migara — Mocking + DataProvider
- Open `ChatbotControllerDataProviderTest`.
- Explain `@Mock` `ChatbotService` to stub external API calls (no network call during tests).
- Show `@DataProvider("chatPrompts")` feeding multiple prompts and expected replies into a single test method.
- Run test to show each dataset executes as a separate testcase in the report.
- Key takeaway: mocks make tests fast and deterministic; data providers reduce duplication.

Shalon — CI/CD & Reporting
- Open `.github/workflows/maven-test.yml`.
- Explain triggers: `push`, `pull_request`, and `workflow_dispatch` (manual run).
- Quality gate: `./mvnw -B test` runs during CI; if tests fail, the workflow fails and PRs show failing checks.
- Show where to view GitHub Actions logs (Actions tab -> workflow -> run -> logs) and TestNG HTML reports in `backend/target/surefire-reports/` when running locally.

## Files added (paths)

- `backend/src/test/java/backend/service/impl/GameServiceTest.java`
- `backend/src/test/java/backend/controller/ReviewControllerAssertionTest.java`
- `backend/src/test/java/backend/controller/ChatbotControllerDataProviderTest.java`
- `backend/src/test/resources/testng.xml` (updated)

---

If you want, I can also add a short timed 10-minute run-sheet assigning exact timestamps to each speaker (e.g., 0:00–2:00 Dinil, 2:00–4:00 Rukshan, 4:00–6:00 Migara, 6:00–8:00 Shalon, 8:00–10:00 Q&A + CI demo). Ask and I will add it.
