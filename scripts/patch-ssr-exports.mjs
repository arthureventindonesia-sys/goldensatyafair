#!/usr/bin/env node
/**
 * Nitro + Vite 8.2 / Rolldown splits the SSR service into ssr.mjs + ssr2.mjs
 * with a circular import and an undeclared `ssr_exports` binding.
 * Every request then 500s: SyntaxError: Export 'ssr_exports' is not defined.
 * See TanStack/router#8031. Run after `vite build`.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const roots = [".output/server", ".vercel/output/functions/__server.func"];

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
for (const root of roots) {
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

    if (
      src.includes("ssr_exports as") &&
      src.includes("server_default as default") &&
      !src.includes("var ssr_exports")
    ) {
      src = src.replace(/export \{/, `var ssr_exports = { default: server_default, t: server_exports };\nexport {`);
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
