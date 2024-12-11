import { join } from "@std/path";

function transformStone(stone: number): number[] {
  if (stone === 0) return [1];

  const stoneStr = stone.toString();
  if (stoneStr.length % 2 === 0) {
    return [
      parseInt(stoneStr.slice(0, stoneStr.length / 2), 10),
      parseInt(stoneStr.slice(stoneStr.length / 2), 10),
    ];
  }

  return [stone * 2024];
}

function solve(input: string, iterations: number): bigint {
  let stones = input.split(" ")
    .map((stone) => parseInt(stone, 10))
    .reduce(
      (acc, stone) => {
        acc.set(stone, (acc.get(stone) ?? 0) + 1);
        return acc;
      },
      new Map<number, number>(),
    );

  for (let i = 0; i < iterations; i += 1) {
    stones = stones.entries()
      .toArray()
      .flatMap(([stone, count]) => transformStone(stone).map((s) => [s, count]))
      .reduce(
        (acc, [stone, count]) => {
          acc.set(stone, (acc.get(stone) ?? 0) + count);
          return acc;
        },
        new Map<number, number>(),
      );
  }

  return stones.values().reduce((acc, count) => acc + BigInt(count), BigInt(0));
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
console.log(solve(input, 25));
console.log(solve(input, 75));
