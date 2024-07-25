import fs from 'fs';
import chalk from 'chalk';
import path from 'path';
// const path = require("path");

const componentName = process.argv[2];
const htmlElement = process.argv[3] || 'div';

if (!componentName) {
  console.error('Please supply a valid component name');
  process.exit(1);
}
console.log(chalk.yellow(`Building ${componentName} component...`));

const componentDirectory = `./src/components/${componentName}`;

if (fs.existsSync(componentDirectory)) {
  console.error(chalk.red(`Component ${componentName} already exists.`));
  process.exit(1);
}

fs.mkdirSync(componentDirectory);

// Create the React component file
const componentFile = path.join(componentDirectory, `${componentName}.tsx`);
const componentData = `
import { FC } from 'react';

export interface I${componentName}Props {};

export const ${componentName}: FC<I${componentName}Props> = ({}) => {
  return <${htmlElement} className=''>${componentName}</${htmlElement}>;
};

`;
fs.writeFileSync(componentFile, componentData);

console.log(chalk.green(`${componentName} component created.`));
