# Demo Checklist — TestNG Live Demo (Simple Guide)

This checklist explains everything simply as if you (each team member) know nothing about testing. Follow it during the live demo.

1) What is a test?
- A test is a small program that checks one piece of your application to make sure it works as expected.
- Tests run automatically and either pass or fail.

2) What is TestNG?
- TestNG is a testing framework for Java. It helps organize and run tests, provides annotations to control setup/teardown, supports data-driven tests, and creates reports.

3) Basic TestNG annotations (what they do)
- `@Test` — marks a method as a test case that TestNG will run.
- `@BeforeMethod` — runs before each `@Test` method. Use it to create fresh objects or mocks.
- `@AfterMethod` — runs after each `@Test` method. Use it to clean up or close resources.
- `@DataProvider` — provides different sets of input data to a single test method.
- `@BeforeClass` / `@AfterClass` — run once before/after all tests in the class (not used in our demo but good to know).

4) What are assertions?
- Assertions check that the code under test produced the expected result.
- If an assertion fails the test fails.
- Hard assertion example: stop the test immediately on failure.
  - `Assert.assertEquals(actual, expected);`
- Soft assertion example: continue checking multiple conditions and report all failures at the end.
  - `SoftAssert soft = new SoftAssert(); soft.assertEquals(a, b); ... soft.assertAll();`

5) Mocking and why we use it
- Mocking replaces real components (like remote APIs) with fake objects that return controlled results.
- This keeps tests fast, reliable, and safe (no real network calls or keys).
- We use `@Mock` and `@InjectMocks` from Mockito to create and inject these fake objects.

6) Quick annotation examples (copyable snippets)

Before/After for each test:

```java
@BeforeMethod
public void setUp() {
    closeable = MockitoAnnotations.openMocks(this);
    service = new MyService(mockRepo);
}

@AfterMethod
public void tearDown() throws Exception {
    closeable.close();
}
```

Data provider example:

```java
@DataProvider(name = "cases")
public Object[][] cases() {
    return new Object[][]{
        {"input1", "expected1"},
        {"input2", "expected2"}
    };
}

@Test(dataProvider = "cases")
public void testWithData(String input, String expected) {
    // use mock to return a value and assert
}
```

7) Commands to run during the demo (copyable)

Unix / macOS:
```sh
cd backend
chmod +x mvnw || true
./mvnw -B test
```

Windows PowerShell:
```powershell
cd backend
.\mvnw -B test
```

Run a single class (example):
```sh
./mvnw -Dtest=backend.controller.ReviewControllerAssertionTest test
```

8) Where to find reports
- After running tests locally, open: `backend/target/surefire-reports/index.html`
- In GitHub Actions, open the Actions tab → select run → logs. Attach the report files if needed.

9) Per-person demo checklist (what to show, step-by-step)

- Dinil — Setup & Fixtures (3 tests to demo)
  - Show `pom.xml` contains TestNG dependency and JUnit exclusions.
  - Open `backend/src/test/java/backend/service/impl/GameServiceTest.java`.
  - Point to `@BeforeMethod` and explain it creates fresh mock objects.
  - Run `getAllGames_shouldReturnMappedDtos` and explain mapping from `Game` → `GameDTO`.
  - Run `getGameById_shouldReturnGame_whenIdExists` and explain how `when(...).thenReturn(...)` controls mock behavior.
  - Tip: Say “BeforeMethod runs every test so each test starts clean”.

- Rukshan — Assertions (3 tests to demo)
  - Open `backend/src/test/java/backend/controller/ReviewControllerAssertionTest.java`.
  - Run `postReview_shouldReturnSuccess_hardAssertions` and explain hard asserts stop on failure.
  - Run `getReviews_shouldReturnExpectedReview_softAssertions` and show how `SoftAssert` collects multiple checks and reports them at `softAssert.assertAll()`.
  - Run `deleteReview_shouldReturnSuccess_hardAssertions` and explain verifying interactions `verify(reviewService).deleteReview(10L)`.

- Migara — Mocking + DataProvider (3 tests to demo)
  - Open `backend/src/test/java/backend/controller/ChatbotControllerDataProviderTest.java`.
  - Explain `@Mock ChatbotService` prevents real API calls.
  - Run the data provider test — describe that TestNG will run the same test three times with different inputs.
  - Run `chat_shouldReturnBadRequest_whenServiceThrowsException` to show how we test error handling.
  - Run `getGames_shouldReturnGameList_whenServiceSucceeds` to show returning structured data from mocks.

- Shalon — CI/CD + Reporting (3 tests to demo)
  - Open `.github/workflows/maven-test.yml` to explain triggers: `push`, `pull_request`, and manual `workflow_dispatch`.
  - Explain CI runs `./mvnw -B test` and acts as a quality gate (failed tests fail the workflow).
  - Show how to view the report locally (`backend/target/surefire-reports/index.html`) and explain to the examiner that the same checks run in CI automatically.

Shalon — exact tests to run (step-by-step)
- Open `backend/src/test/java/backend/BackendApplicationTests.java` and explain the three tests:
  - `contextLoads()` — Spring context startup
  - `activeProfile_shouldContainTest()` — confirms `test` profile
  - `importantBeans_shouldBeCreated()` — checks key controllers exist

- Commands to run these individually (quick demo):
```sh
cd backend
./mvnw -Dtest=backend.BackendApplicationTests#contextLoads test
./mvnw -Dtest=backend.BackendApplicationTests#activeProfile_shouldContainTest test
./mvnw -Dtest=backend.BackendApplicationTests#importantBeans_shouldBeCreated test
```

- Then run full suite and open report:
```sh
./mvnw -B test
open target/surefire-reports/index.html
```

Shalon viva prep (exact questions & short answers)
- Q: Why run context tests in CI? — A: They ensure application wiring, profiles, and essential beans are present before running more granular tests; failing fast avoids noisy downstream failures.
- Q: Where do you find test failures in Actions? — A: Actions → select run → Jobs → step `Run TestNG Tests via Maven` → View logs; also download `target/surefire-reports` artifacts if uploaded.
- Q: How do you prevent secrets from leaking in CI logs? — A: Use GitHub Secrets and reference them via `env:`; avoid printing secret values in logs.
- Q: How to rerun a single failing test locally? — A: Use `./mvnw -Dtest=ClassName#methodName test` to rerun only that test for fast feedback.
- Q: How to handle flaky tests in CI? — A: Mark flaky tests, investigate root causes (timing, external deps), add mocks or retries, and avoid ignoring failures silently.

10) Live demo tips
- Practice the run-sheet twice. Keep each person to ~2 minutes.
- If a test fails during demo, show the failure, explain root cause, and re-run a single fixed test.
- Do not commit real API keys. Use mocks or GitHub Secrets for CI.

11) Short viva cheat-sheet (for quick review)
- What is `@DataProvider`? — provides multiple inputs to one test.
- What is a mock? — fake object used to simulate dependencies.
- What is the difference between hard and soft asserts? — hard stops; soft accumulates.
- Why run tests in CI? — automatic quality gate and fast feedback for PRs.

---

If this is good, I will commit the file and mark the todo as completed. Want me to push these changes to your repo now? 
