import { join } from "@std/path";

// mul(x,y)
function computeLine(line: string): number {
  const matches = line.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g);
  return matches.toArray().reduce(
    (acc, match) => acc + parseInt(match[1], 10) * parseInt(match[2], 10),
    0,
  );
}

function computeLine2(
  line: string,
  enableMul: boolean,
): { count: number; enableMul: boolean } {
  const matches = line.matchAll(/do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\)/g);
  return matches.toArray().reduce(
    (acc, match) => {
      switch (match[0]) {
        case "do()":
          acc.enableMul = true;
          break;
        case "don't()":
          acc.enableMul = false;
          break;
        default:
          if (acc.enableMul) {
            acc.count += parseInt(match[1], 10) * parseInt(match[2], 10);
          }
          break;
      }
      return acc;
    },
    {
      count: 0,
      enableMul,
    },
  );
}

function solve1(lines: string[]): number {
  return lines.reduce((acc, line) => acc + computeLine(line), 0);
}

function solve2(lines: string[]): number {
  return lines.reduce(
    (acc, line) => {
      const { count, enableMul } = computeLine2(line, acc.enableMul);
      acc.count += count;
      acc.enableMul = enableMul;
      return acc;
    },
    { count: 0, enableMul: true },
  )
    .count;
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample2.txt");
const input = await Deno.readTextFile(path);
const lines = input.split("\n");
console.log(solve1(lines));
console.log(solve2(lines));
