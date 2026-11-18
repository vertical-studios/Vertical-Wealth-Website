// Pages load their sections through TinaCMS's client, so Astro always builds
// inside `tinacms build`, which serves the content from the repo files.
//
// With TINA_TOKEN set (Vercel env vars), the editor at /admin and the live
// editing route talk to TinaCloud. Without it, the site still builds and
// deploys normally, but /admin is a local-only shell that can't save.
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

if (process.env.TINA_TOKEN) {
  console.log("TinaCloud connected: building the editor at /admin with click-to-edit");
  // --content=local: read content from the repo for a fast, reliable build.
  // --skip-cloud-checks: don't fail the deploy if TinaCloud is still indexing this commit.
  run('npx tinacms build --content=local --skip-cloud-checks --skip-search-index -c "astro build"');
} else {
  console.log("TINA_TOKEN not set: building the site with a local-only editor (see README step 3)");
  run('npx tinacms build --local --skip-cloud-checks --skip-search-index -c "astro build"');
  // A local-mode editor can't save from the live site, so don't publish its page.
  for (const dir of ["dist/client", ".vercel/output/static"]) rmSync(`${dir}/admin/index.html`, { force: true });
}
