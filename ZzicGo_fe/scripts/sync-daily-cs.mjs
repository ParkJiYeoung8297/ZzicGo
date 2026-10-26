import { mkdir, copyFile } from 'node:fs/promises';
const source = new URL('../../daily_cs/public/', import.meta.url);
const target = new URL('../public/daily-cs/', import.meta.url);
await mkdir(target, { recursive: true });
for (const file of ['index.html', 'style.css', 'config.js', 'markdown.js', 'app.js']) {
  await copyFile(new URL(file, source), new URL(file, target));
}
