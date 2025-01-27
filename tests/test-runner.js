import * as path from 'path';
import { readdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


var testResults = {};
var originalAssert = console.assert;

/**
 * Path console.assert globally for custom behavior. 
 */
console.assert = function (condition, message) {
  if (!condition) {
    testResults.failed++;
    testResults.failures.push({
      message: message || 'Assertion failed',
      stack: new Error().stack
    });
  } else {
    testResults.passed++;
  }
  originalAssert.apply(console, arguments);
};

var testDir = path.join(__dirname, 'test-cases');
var testFiles = readdirSync(testDir)
  .filter(file => file.endsWith('.test.js'));

function generateJUnitReport(results) {
  const testCases = Object.entries(results)
    .map(([ name, result ]) => {
      if (result.passed) {
        return `<testcase classname="js-test" name="${name}"/>`;
      } else {
        return `
          <testcase classname="js-test" name="${name}">
            <failure message="${result.message}"/>
        </testcase>`;
      }
    }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
  <testsuites>
      <testsuite name="js-test" tests="${Object.keys(results).length}">
          ${testCases}
      </testsuite>
  </testsuites>`;
};

globalThis.tests = function (tests) {
  Object.entries(tests)
    .forEach(([ name, testFn ]) => {
      try {
        testFn();
        testResults[name] = { passed: true };
      } catch (e) {
        testResults[name] = {
          passed: false,
          message: e.message
        };
      }
    });
};

for (let file of testFiles) {
  await import(path.join(testDir, file));
}

writeFileSync('test-results.xml', generateJUnitReport(testResults));
