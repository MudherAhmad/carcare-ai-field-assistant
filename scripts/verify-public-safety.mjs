import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const forbiddenFiles = [
  "google-services.json",
  "GoogleService-Info.plist",
  ".env",
  ".env.local",
  "key.properties",
];

const tracked = execFileSync("git", ["ls-files"], {
  cwd: root,
  encoding: "utf8",
}).split(/\r?\n/).filter(Boolean);

const failures = [];
for (const file of tracked) {
  const normalized = file.replaceAll("\\", "/");
  if (forbiddenFiles.some((name) => normalized === name || normalized.endsWith(`/${name}`))) {
    failures.push(`tracked sensitive file: ${file}`);
  }

  if (/\.(png|jpe?g|gif|webp|mp4|mov|pdf)$/i.test(file)) continue;
  const body = readFileSync(resolve(root, file), "utf8");
  const checks = [
    [/AIza[0-9A-Za-z_-]{30,}/g, "Google API key"],
    [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g, "private key"],
    [/firebaseapp\.com\/[A-Za-z0-9_-]+/g, "unexpected Firebase URL"],
    [/https?:\/\/(?:api\.)?carcare[^\s)"']+/gi, "commercial endpoint"],
  ];
  for (const [pattern, label] of checks) {
    if (pattern.test(body)) failures.push(`${label}: ${file}`);
  }
}

if (failures.length) {
  console.error("Public safety scan failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Public safety scan passed for ${tracked.length} tracked files.`);
