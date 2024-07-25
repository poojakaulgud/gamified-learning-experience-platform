import { existsSync, mkdirSync, writeFileSync } from 'fs';
import open from 'open';
import chalk from 'chalk';
import { dirname, join } from 'path';

// Function to create directories recursively if they do not exist
function mkdirp(dir) {
  if (existsSync(dir)) {
    return;
  }
  mkdirp(dirname(dir));
  mkdirSync(dir);
}

// Function to convert kebab-case or snake_case to CamelCase
function toCamelCase(str) {
  return str.replace(/[-_]\w/g, (g) => g[1].toUpperCase());
}

// Function to generate Next.js page file
function generatePage(pagePath) {
  const parts = pagePath.split('/');
  const fileName = parts.pop();
  const dirPath = join('src/app/', ...parts);

  mkdirp(dirPath);

  const pageName =
    toCamelCase(fileName).charAt(0).toUpperCase() +
    toCamelCase(fileName).slice(1);

  console.log(
    chalk.yellow(
      `Building ${pageName} page inside of the ${fileName} directory...`
    )
  );

  const filePathPage = join(dirPath, `${fileName}/page.tsx`);
  const filePathPageName = join(dirPath, `${fileName}/${pageName}.tsx`);

  const contentPageName = `
'use client';
import { FC } from 'react';

export interface I${pageName}Props {};

const ${pageName}: FC<I${pageName}Props> = ({}) => {
  return (
	<div>
	  <h1>${pageName}</h1>
	</div>
  );
};

export default ${pageName};

		`;

  const contentPage = `
import {Metadata} from 'next';
import ${pageName} from './${pageName}';

export const metadata: Metadata = {
	title: '${pageName}',
	description: 'Sample Description',
}

const Page = () => {
  return (
	<${pageName} />
  );
}

export default ${pageName};

		`;

  mkdirp(join(dirPath, fileName));
  writeFileSync(filePathPageName, contentPageName.trim());
  writeFileSync(filePathPage, contentPage.trim());
  const url = `http://localhost:3000/${pagePath.replace(/^\/+|\/+$/g, '')}`;
  open(url);
  console.log(chalk.green(`${pageName} page is visible at /${pagePath}.`));
}

// Call generatePage function with desired path to create a new page.
let pagePath = process.argv[2];
if (/\/{2,}/.test(pagePath)) {
  console.error(
    chalk.red('Invalid argument: Consecutive slashes are not allowed.')
  );
  process.exit(1);
}
if (pagePath.slice(-1) === '/') {
  // Remove the trailing slash
  pagePath = pagePath.slice(0, -1);
}

// Replace 'posts/post-1' with your desired path.
generatePage(pagePath);
