module.exports = {
  '**/*.{ts,tsx}': () => 'pnpm run typecheck',
  '**/*.{ts,tsx,js,jsx,md,json}': 'pnpm exec oxfmt --write',
  '**/*.{ts,tsx,js,jsx}': (files) => `pnpm exec oxlint ${files.join(' ')}`,
}
