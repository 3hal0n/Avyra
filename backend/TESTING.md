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

## Allure Reports (with TestNG)

Allure integration is configured in `backend/pom.xml` using `allure-testng` and `allure-maven`.

When you run tests, Allure raw results are generated at:

```
backend/target/allure-results/
```

Generate and open the Allure HTML report:

```sh
cd backend
./mvnw -B test
./mvnw -B allure:report
```

The generated HTML report is created at:

```
backend/target/site/allure-maven-plugin/index.html
```

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

## Final demo checklist (what we committed)

- Total new demo tests added: 7+ (unit + controller focused) — deterministic, mock-based, and safe for CI.
- Per-person test count (minimum 3 each):
  - Dinil (`GameServiceTest`): 3 tests — fixture/BeforeMethod + getAll + getById + filtered query
  - Rukshan (`ReviewControllerAssertionTest`): 3 tests — postReview (hard assert), getReviews (soft asserts), deleteReview
  - Migara (`ChatbotControllerDataProviderTest`): 3 tests — data-provider chat cases, chat error path, getGames
  - Shalon (`BackendApplicationTests`): 3 tests — contextLoads, activeProfile check, importantBeans existence

  Shalon (exact tests to run)
  - `backend/src/test/java/backend/BackendApplicationTests.java`
    - `contextLoads()` — verifies Spring context starts
    - `activeProfile_shouldContainTest()` — verifies `test` profile is active
    - `importantBeans_shouldBeCreated()` — verifies key controllers are present in context (e.g., `chatbotController`, `gameController`)

  Recommended demo actions for Shalon
  - Run only the backend context checks quickly to demonstrate the Spring Boot test context:

  ```sh
  cd backend
  ./mvnw -Dtest=backend.BackendApplicationTests#contextLoads test
  ./mvnw -Dtest=backend.BackendApplicationTests#activeProfile_shouldContainTest test
  ./mvnw -Dtest=backend.BackendApplicationTests#importantBeans_shouldBeCreated test
  ```

  - Then run the whole test suite to show CI-style execution and reporting:

  ```sh
  ./mvnw -B test
  ```

  - Open the report locally: `backend/target/surefire-reports/index.html`

  What to show in the demo (Shalon)
  - Explain that these context tests validate the application wiring and environment before other unit tests run.
  - Show the HTML TestNG report and explain where to find failing stack traces and test XML artifacts in `target/surefire-reports/`.
  - If you want to demonstrate CI, trigger the workflow manually (`workflow_dispatch`) and show the Actions run and logs.

## 10-minute timed run-sheet (exact)

- 0:00 — 0:15: Intro slide (tool selection + slides) — Team lead
- 0:15 — 2:15: Dinil — Setup & Fixtures
  - Show `pom.xml` TestNG dependency and `GameServiceTest` `@BeforeMethod`/`@AfterMethod`
  - Run `getAllGames_shouldReturnMappedDtos` and `getGameById_shouldReturnGame_whenIdExists`
- 2:15 — 4:15: Rukshan — Assertions
  - Open `ReviewControllerAssertionTest`
  - Run `postReview_shouldReturnSuccess_hardAssertions` and `getReviews_shouldReturnExpectedReview_softAssertions`
- 4:15 — 6:15: Migara — Mocking + DataProvider
  - Open `ChatbotControllerDataProviderTest`
  - Run the data-provider test (shows 3 datasets) and `chat_shouldReturnBadRequest_whenServiceThrowsException`
- 6:15 — 8:15: Shalon — CI/CD & Reporting
  - Open `.github/workflows/maven-test.yml` and `backend/TESTING.md`
  - Explain triggers and quality gate, show local `backend/target/surefire-reports/index.html` (or screenshot)
- 8:15 — 9:30: Quick replay or show CI run screenshot
- 9:30 — 10:00: Closing, where to find report, interview/video links, and Q&A handoff

## Quick checklist to include in the written report

- Cover page with required fields and page numbers in footer
- Interview evidence: LinkedIn profile link + video interview link (all four participated)
- Workload distribution table (who did which tests + lines changed)
- Reflection tying interview insights to QE practices (CI gates, flaky test mitigation, mocking)
- Test artifacts: include TestNG HTML report and at least one CI run screenshot

If you want, I will commit a short `demo-checklist.md` with the per-person bullet points and a one-page viva cheat-sheet. Should I add those now?
