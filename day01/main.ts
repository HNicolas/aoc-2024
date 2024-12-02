import { join } from "@std/path";

function parseLine(line: string): [number, number] {
  const [left, right] = line.split(/\s+/);
  return [parseInt(left, 10), parseInt(right, 10)];
}

function solve1(lines: string[]): number {
  const leftArray: number[] = [];
  const rightArray: number[] = [];
  for (const line of lines) {
    const [left, right] = parseLine(line);
    leftArray.push(left, 10);
    rightArray.push(right, 10);
  }
  leftArray.sort();
  rightArray.sort();
  const distance = leftArray.reduce(
    (acc, left, index) => {
      const right = rightArray[index];
      return acc + Math.abs(left - right);
    },
    0,
  );
  return distance;
}

function solve2(lines: string[]): number {
  const leftMap = new Map<number, number>();
  const rightMap = new Map<number, number>();
  for (const line of lines) {
    const [left, right] = parseLine(line);
    leftMap.set(left, (leftMap.get(left) ?? 0) + 1);
    rightMap.set(right, (rightMap.get(right) ?? 0) + 1);
  }
  const similarity = leftMap.entries()
    .toArray()
    .reduce(
      (acc, [n, count]) => {
        return acc + count * n * (rightMap.get(n) ?? 0);
      },
      0,
    );
  return similarity;
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
const lines = input.split("\n");
console.log(solve1(lines));
console.log(solve2(lines));
