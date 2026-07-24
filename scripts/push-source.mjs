import fs from "node:fs";
import http from "isomorphic-git/http/node";
import git from "isomorphic-git";

const dir = process.cwd();
const url = process.env.SITES_REPOSITORY_URL;
const token = process.env.SITES_REPOSITORY_TOKEN;
const authorEmail = process.env.GIT_AUTHOR_EMAIL ?? "shinyk84@gmail.com";

if (!url || !token) {
  throw new Error("Missing temporary Sites repository credentials.");
}

if (!fs.existsSync(`${dir}/.git`)) {
  await git.init({ fs, dir, defaultBranch: "main" });
}

await git.add({ fs, dir, filepath: "." });
const sha = await git.commit({
  fs,
  dir,
  author: { name: "shinyk84", email: authorEmail },
  message: "Create simple introduction page",
});

await git.push({
  fs,
  http,
  dir,
  url,
  ref: "main",
  force: true,
  onAuth: () => ({ username: "x-access-token", password: token }),
});

process.stdout.write(sha);

