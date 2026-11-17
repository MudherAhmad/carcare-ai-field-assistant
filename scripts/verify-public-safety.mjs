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
const allowedPublicProjectUrls = [
  "https://carcare-ai-field-assistant.web.app",
  "https://github.com/MudherAhmad/carcare-ai-field-assistant",
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
  const endpointScanBody = allowedPublicProjectUrls.reduce(
    (content, url) => content.replaceAll(url, ""),
    body,
  );
  const checks = [
    [/AIza[0-9A-Za-z_-]{30,}/g, "Google API key", body],
    [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g, "private key", body],
    [/firebaseapp\.com\/[A-Za-z0-9_-]+/g, "unexpected Firebase URL", body],
    [/https?:\/\/(?:api\.)?carcare[^\s)"']+/gi, "commercial endpoint", endpointScanBody],
  ];
  for (const [pattern, label, content] of checks) {
    if (pattern.test(content)) failures.push(`${label}: ${file}`);
  }
}

if (failures.length) {
  console.error("Public safety scan failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Public safety scan passed for ${tracked.length} tracked files.`);
