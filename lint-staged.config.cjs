// Payload regenerates src/payload-types.ts on every init (the dev server
// included), so formatting it never holds. `format:check` excludes it and so
// does the hook, or every dev-server start would dirty the file.
const isGenerated = (file) => file.endsWith('src/payload-types.ts')

const formattable = (files) => files.filter((file) => !isGenerated(file))

module.exports = {
  '**/*.{ts,tsx}': () => 'pnpm run typecheck',
  '**/*.{ts,tsx,js,jsx,md,json}': (files) => {
    const targets = formattable(files)
    return targets.length > 0 ? [`pnpm exec oxfmt --write ${targets.join(' ')}`] : []
  },
  '**/*.{ts,tsx,js,jsx}': (files) => `pnpm exec oxlint --threads=2 ${files.join(' ')}`,
}
