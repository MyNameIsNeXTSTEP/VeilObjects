import * as path from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var testDir = path.join(__dirname, 'test-cases');
var testFiles = readdirSync(testDir)
  .filter(file => file.endsWith('.test.js'));

for (let file of testFiles) {
  await import(path.join(testDir, file));
}
