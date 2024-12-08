import { join } from "@std/path";

function isInBounds(
  point: [number, number],
  height: number,
  width: number,
): boolean {
  return point[0] >= 0 && point[0] < height &&
    point[1] >= 0 && point[1] < width;
}

function solve1(input: string): number {
  const grid = input.split("\n").map((line) => line.split(""));

  const height = grid.length;
  const width = grid[0].length;

  const antennas = new Map<string, [number, number][]>();
  const antinodes = new Set<string>();

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const char = grid[row][col];
      if (char === ".") continue;

      const sameFrequencyAntennas = antennas.get(char);
      if (!sameFrequencyAntennas) {
        antennas.set(char, [[row, col]]);
        continue;
      }

      for (const [row2, col2] of sameFrequencyAntennas) {
        const deltaRow = row2 - row;
        const deltaCol = col2 - col;
        const antinode1: [number, number] = [row - deltaRow, col - deltaCol];
        const antinode2: [number, number] = [row2 + deltaRow, col2 + deltaCol];

        if (isInBounds(antinode1, height, width)) {
          antinodes.add(`${antinode1[0]},${antinode1[1]}`);
        }
        if (isInBounds(antinode2, height, width)) {
          antinodes.add(`${antinode2[0]},${antinode2[1]}`);
        }
      }

      sameFrequencyAntennas.push([row, col]);
    }
  }
  return antinodes.size;
}

function solve2(input: string): number {
  const grid = input.split("\n").map((line) => line.split(""));

  const height = grid.length;
  const width = grid[0].length;

  const antennas = new Map<string, [number, number][]>();
  const antinodes = new Set<string>();

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const char = grid[row][col];
      if (char === ".") continue;

      const sameFrequencyAntennas = antennas.get(char);
      if (!sameFrequencyAntennas) {
        antennas.set(char, [[row, col]]);
        continue;
      }

      antinodes.add(`${row},${col}`);
      for (const [row2, col2] of sameFrequencyAntennas) {
        antinodes.add(`${row2},${col2}`);
        const deltaRow = row2 - row;
        const deltaCol = col2 - col;
        let antinode1: [number, number] = [row - deltaRow, col - deltaCol];
        while (isInBounds(antinode1, height, width)) {
          antinodes.add(`${antinode1[0]},${antinode1[1]}`);
          antinode1 = [antinode1[0] - deltaRow, antinode1[1] - deltaCol];
        }

        let antinode2: [number, number] = [row2 + deltaRow, col2 + deltaCol];
        while (isInBounds(antinode2, height, width)) {
          antinodes.add(`${antinode2[0]},${antinode2[1]}`);
          antinode2 = [antinode2[0] + deltaRow, antinode2[1] + deltaCol];
        }
      }

      sameFrequencyAntennas.push([row, col]);
    }
  }
  return antinodes.size;
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
console.log(solve1(input));
console.log(solve2(input));
