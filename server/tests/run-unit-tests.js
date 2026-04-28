import { runRequireRoleTests } from "./requireRole.test.js";
import { runUserPermissionTests } from "./user-permissions.test.js";

const suites = [runRequireRoleTests, runUserPermissionTests];

let totalPassed = 0;

for (const suite of suites) {
  try {
    const result = await suite();
    totalPassed += result.passed;
    console.log(`PASS ${result.name} (${result.passed} cases)`);
  } catch (error) {
    console.error(`FAIL ${suite.name}`);
    console.error(error);
    process.exit(1);
  }
}

console.log(`\nAll unit tests passed (${totalPassed} cases).`);
