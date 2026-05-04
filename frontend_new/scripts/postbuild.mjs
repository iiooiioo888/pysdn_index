import { readdirSync, copyFileSync } from 'fs';
import { join } from 'path';

const distAssets = join(process.cwd(), 'dist', 'assets');
const files = readdirSync(distAssets);
const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));

if (cssFile) {
  copyFileSync(join(distAssets, cssFile), join(distAssets, 'styles.css'));
  console.log(`copied ${cssFile} → assets/styles.css`);
  copyFileSync(join(distAssets, cssFile), join(process.cwd(), 'dist', 'styles.css'));
  console.log(`copied ${cssFile} → dist/styles.css`);
} else {
  console.warn('no index-*.css found, skipping postbuild copy');
}
