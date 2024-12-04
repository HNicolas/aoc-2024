import { join } from "@std/path";

function solve1(lines: string[]): number {
  let count = 0;
  for (let i = 0; i < lines.length; i += 1) {
    for (let j = 0; j < lines[i].length; j += 1) {
      if (lines[i][j] !== "X") continue;
      for (let k = -1; k <= 1; k += 1) {
        for (let l = -1; l <= 1; l += 1) {
          if (k === 0 && l === 0) continue;

          if (
            i + 3 * k >= 0 && i + 3 * k < lines.length &&
            j + 3 * l >= 0 && j + 3 * l < lines.length &&
            lines[i + 1 * k][j + 1 * l] === "M" &&
            lines[i + 2 * k][j + 2 * l] === "A" &&
            lines[i + 3 * k][j + 3 * l] === "S"
          ) {
            count += 1;
          }
        }
      }
    }
  }
  return count;
}

function solve2(lines: string[]): number {
  let count = 0;
  for (let i = 1; i < lines.length - 1; i += 1) {
    for (let j = 1; j < lines[i].length - 1; j += 1) {
      if (lines[i][j] !== "A") continue;
      for (const k of [-1, 1]) {
        if (
          lines[i - 1 * k][j - 1 * k] === "M" &&
          lines[i + 1 * k][j + 1 * k] === "S"
        ) {
          for (const l of [-1, 1]) {
            if (
              lines[i - 1 * l][j + 1 * l] === "M" &&
              lines[i + 1 * l][j - 1 * l] === "S"
            ) {
              count += 1;
              break;
            }
          }
          break;
        }
      }
    }
  }
  return count;
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
// const path = join(import.meta.dirname ?? "", "sample2.txt");
const input = await Deno.readTextFile(path);
const lines = input.split("\n");
console.log(solve1(lines));
console.log(solve2(lines));
