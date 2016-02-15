import {exec} from 'child_process';
import fs from 'fs';
import path from 'path';

/* eslint no-console: 0 */

const pkg = require(path.join(__dirname, '../package.json'));

/**
 * Determines whether or not the project has the Bower setup by checking for
 * the presence of a bower.json file.
 *
 * @return {Boolean}
 */
const hasBower = () => {
  try {
    fs.statSync(path.join(__dirname, '../bower.json'));
    return true;
  } catch (x) {
    return false;
  }
};

const commands = [];

// If the project supports Bower, perform special extra versioning step.
if (hasBower()) {
  commands.push('git add package.json');
  commands.push(`git commit -m "${pkg.version}"`);

  // We only need a build in the Bower-supported case because of the
  // temporary addition of the dist/ directory.
  commands.push('npm run build');
  commands.push('git add -f dist');
}

if (commands.length) {
  exec(commands.join(' && '), (err, stdout, stderr) => {
    if (err) {
      process.stdout.write(err.stack);
      process.exit(err.status || 1);
    } else {
      process.stdout.write(stdout);
    }
  });
}
