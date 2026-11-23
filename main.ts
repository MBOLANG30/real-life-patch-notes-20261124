import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Real-Life Patch Notes — one line, in the terse register of a real
// release note. The bug: the "doorway effect" — you walk into a room and
// your brain instantly drops the reason you went there. The fix is stated
// as if it shipped, which is what makes the wince land as a laugh.
const LINE =
  "v2.4.1: fixed a bug where walking through a doorway erased why you entered the room.";

// Gate: the sealed scorer requires UTF-8 text of 1-160 characters, not
// only whitespace. Validate here so a bad line fails loudly instead of
// silently producing an entry the judge never sees.
if (LINE.length < 1 || LINE.length > 160) {
  throw new Error(`line must be 1-160 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be only whitespace");
}
// A patch note is one line: reject any embedded newline, and require the
// version-number prefix so the entry always reads like a real release note.
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
if (!/^v\d+\.\d+\.\d+:/.test(LINE)) {
  throw new Error("line must start with a version number, e.g. v2.4.1:");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
// Create the output dir if missing, but NEVER delete it or its contents:
// the grader mounts it, and anything already there must survive the run.
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
