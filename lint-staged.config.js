const lintStagedConfig = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'npx tsc --noEmit',

  // Lint then format TypeScript and JavaScript files
  '**/*.(ts|tsx|js|css)': (filenames) => [
    `echo ${filenames.join(' ')}`,
    `eslint --fix ${filenames.join(' ')}`,
  ],
};

export default lintStagedConfig;
