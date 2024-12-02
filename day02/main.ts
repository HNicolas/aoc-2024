import { join } from "@std/path";

function isSafeReport(levels: number[], tolerateFailure = false): boolean {
  if (levels.length < 2) return true;
  let sign: number = 0;
  for (let i = 1; i < levels.length; i += 1) {
    const delta = levels[i - 1] - levels[i];
    if (delta ** 2 < 1 || delta ** 2 > 9) {
      if (tolerateFailure) {
        return isSafeReport(levels.toSpliced(i - 1, 1)) ||
          isSafeReport(levels.toSpliced(i, 1));
      }
      return false;
    }
    if (sign === 0) {
      sign = Math.sign(delta);
    } else if (sign !== Math.sign(delta)) {
      if (tolerateFailure) {
        return isSafeReport(levels.toSpliced(i - 2, 1)) ||
          isSafeReport(levels.toSpliced(i - 1, 1)) ||
          isSafeReport(levels.toSpliced(i, 1));
      }
      return false;
    }
  }
  return true;
}

function parseLine(line: string): number[] {
  return line.split(" ").map((v) => parseInt(v, 10));
}

function solve1(lines: string[]): number {
  return lines.reduce((acc, line) => {
    const levels = parseLine(line);
    return acc + (isSafeReport(levels) ? 1 : 0);
  }, 0);
}

function solve2(lines: string[]): number {
  return lines.reduce((acc, line) => {
    const levels = parseLine(line);
    return acc + (isSafeReport(levels, true) ? 1 : 0);
  }, 0);
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
const lines = input.split("\n");
console.log(solve1(lines));
console.log(solve2(lines));
