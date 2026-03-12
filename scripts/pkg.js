import { readFile, writeFile } from 'node:fs/promises';
import glob from 'fast-glob';

const paths = await glob(
  'packages/*/package.json',
  {
    absolute: true,
  },
);

for (const path of paths) {
  readFile(path, 'utf8').then((data) => {
    const json = JSON.parse(data.toString());
    const name = json.name.split('/')[1];
    const frameworkName = name[0].toUpperCase() + name.slice(1);

    switch (name) {
      // todo
    }

    return writeFile(path, `${ JSON.stringify(json, null, 2) }\n`);
  });
}
