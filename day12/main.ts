import { join } from "@std/path";

type Coordinates = [number, number];

function countCorners(
  [i, j]: Coordinates,
  grid: string[][],
): number {
  const corners = [
    [-1, 1],
    [1, 1],
    [1, -1],
    [-1, -1],
  ];
  return corners.reduce((acc, [deltaI, deltaJ]) => {
    const i2 = i + deltaI;
    const j2 = j + deltaJ;

    let cell1: string | null = null;
    let cell2: string | null = null;
    let cell3: string | null = null;
    if (i2 >= 0 && i2 < grid.length) {
      if (j2 >= 0 && j2 < grid.length) {
        cell1 = grid[i2][j];
        cell2 = grid[i][j2];
        cell3 = grid[i2][j2];
      } else {
        cell1 = grid[i2][j];
      }
    } else if (j2 >= 0 && j2 < grid.length) {
      cell2 = grid[i][j2];
    }

    if (cell1 !== grid[i][j] && cell2 !== grid[i][j]) {
      acc += 1;
    } else if (cell1 === cell2 && cell3 !== grid[i][j]) {
      acc += 1;
    }

    return acc;
  }, 0);
}

function findSamePlants(
  [i, j]: Coordinates,
  grid: string[][],
): Coordinates[] {
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  return directions.reduce<Coordinates[]>(
    (acc, [deltaI, deltaJ]) => {
      const i2 = i + deltaI;
      const j2 = j + deltaJ;
      if (
        i2 >= 0 && i2 < grid.length &&
        j2 >= 0 && j2 < grid[i2].length &&
        grid[i][j] === grid[i2][j2]
      ) {
        acc.push([i2, j2]);
      }
      return acc;
    },
    [],
  );
}

function getKey(coordinates: Coordinates): string {
  return `${coordinates[0]},${coordinates[1]}`;
}

function solve(input: string): [number, number] {
  const grid = input.split("\n").map((line) => line.split(""));
  const seen = new Set<string>();

  let price1 = 0;
  let price2 = 0;
  for (let i = 0; i < grid.length; i += 1) {
    for (let j = 0; j < grid[i].length; j += 1) {
      let area = 0;
      let perimeter = 0;
      let corners = 0;

      const plants: Coordinates[] = [[i, j]];
      while (plants.length > 0) {
        const coordinates = plants.pop()!;
        const key = getKey(coordinates);
        if (seen.has(key)) continue;

        area += 1;
        const samePlants = findSamePlants(coordinates, grid);
        perimeter += 4 - samePlants.length;
        plants.push(...samePlants);
        seen.add(key);
        corners += countCorners(coordinates, grid);
      }
      price1 += area * perimeter;
      price2 += area * corners;
    }
  }

  return [price1, price2];
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
console.log(solve(input));
