#!/usr/bin/env node
/**
 * Nitro + Vite 8.2 / Rolldown 1.2.2–1.2.6 splits the SSR service into
 * ssr.mjs + ssr2.mjs with a circular import and an undeclared `ssr_exports`
 * binding. Every request then 500s:
 *   SyntaxError: Export 'ssr_exports' is not defined
 * See TanStack/router#8031. Run after `vite build` and on service start.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const roots = [
  join(process.cwd(), ".output/server"),
  join(here, "../.output/server"),
  "/var/www/goldensatyafair/.output/server",
  join(process.cwd(), ".vercel/output/functions/__server.func"),
];

const EXPORT_ALL = `var __exportAll$1 = (all, no_symbols) => {
	const target = {};
	for (const name in all) Object.defineProperty(target, name, { get: all[name], enumerable: true });
	if (!no_symbols) Object.defineProperty(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
`;

function walk(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const next = join(dir, entry.name);
    if (entry.isDirectory()) walk(next, acc);
    else if (entry.name.endsWith(".mjs") || entry.name.endsWith(".js")) acc.push(next);
  }
  return acc;
}

let patched = 0;
const seen = new Set();
for (const root of roots) {
  if (!existsSync(root) || seen.has(root)) continue;
  seen.add(root);
  for (const file of walk(root)) {
    const base = file.split("/").pop() || "";
    if (base !== "ssr.mjs" && base !== "ssr2.mjs") continue;
    let src = readFileSync(file, "utf8");
    let changed = false;

    if (/import \{ u as __exportAll\$1 \} from ["']\.\/ssr\.mjs["'];/.test(src)) {
      src = src.replace(
        /import \{ u as __exportAll\$1 \} from ["']\.\/ssr\.mjs["'];\n?/,
        EXPORT_ALL,
      );
      changed = true;
    }

    if (/\bssr_exports as\b/.test(src) && !/\bvar ssr_exports\b/.test(src) && !/\bconst ssr_exports\b/.test(src)) {
      const ns =
        /\bserver_default\b/.test(src) && /\bserver_exports\b/.test(src)
          ? "{ default: server_default, t: server_exports }"
          : "{}";
      src = src.replace(/export \{/, `var ssr_exports = ${ns};\nexport {`);
      changed = true;
    }

    if (changed) {
      writeFileSync(file, src);
      patched += 1;
      console.log(`[patch-ssr] ${file}`);
    }
  }
}

if (patched === 0) console.log("[patch-ssr] no files needed patching");
else console.log(`[patch-ssr] patched ${patched} file(s)`);
