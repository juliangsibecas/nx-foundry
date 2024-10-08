import { Tree } from 'nx/src/generators/tree';
import ignore from 'ignore';

export function addGitIgnoreEntry(host: Tree) {
  if (!host.exists('.gitignore')) {
    return;
  }

  let content = host.read('.gitignore', 'utf-8').trimEnd();

  const ig = ignore();

  if (content.includes("# Foundry")) {
    return
  }

  ig.add(content);

  content = `${content}\n\n# Foundry
cache/
out/
!/broadcast
/broadcast/*/31337/
/broadcast/**/dry-run/
docs/
.env
  `;

  host.write('.gitignore', content);
}
