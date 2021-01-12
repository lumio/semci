import { promises as fs } from 'fs';
import * as path from 'path';

async function main() {
  const pkgFile = path.resolve(__dirname, '../bin/package.json');
  const pkgRaw = await fs.readFile(pkgFile, 'utf-8');
  const pkg = JSON.parse(pkgRaw);

  ['bin', 'main'].forEach(property => {
    if (pkg[property] != null) {
      throw new Error('package.json already contains `bin`');
    }
  })

  pkg.bin = { semci: 'index.js' };
  pkg.main = 'index.js';
  pkg.files = ['bin/**/*'];

  delete pkg.scripts['post-build'];
  delete pkg.scripts['build'];

  await fs.writeFile(pkgFile, JSON.stringify(pkg, null, 2));
}
main();
