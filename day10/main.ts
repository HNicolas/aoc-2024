import { join } from "@std/path";

function solve(input: string, countDistinct = false): number {
  const grid = input.split("\n").map((line) =>
    line.split("").map((n) => parseInt(n, 10))
  );

  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  let score = 0;
  for (let i = 0; i < grid.length; i += 1) {
    for (let j = 0; j < grid[i].length; j += 1) {
      if (grid[i][j] !== 0) continue;

      let height = 0;
      let currentIndexes = [[i, j, 1]];
      while (currentIndexes.length > 0 && height < 9) {
        const seen = new Map<string, number>();
        const nextIndexes = [];
        for (const [row, col, indexScore] of currentIndexes) {
          for (const [rowDelta, colDelta] of directions) {
            const newRow = row + rowDelta;
            const newCol = col + colDelta;
            if (
              newRow >= 0 && newRow < grid.length &&
              newCol >= 0 && newCol < grid[newRow].length &&
              grid[newRow][newCol] === height + 1
            ) {
              const currentScore = seen.get(`${newRow},${newCol}`);
              if (!currentScore) {
                nextIndexes.push([newRow, newCol]);
                seen.set(`${newRow},${newCol}`, indexScore);
              } else if (countDistinct) {
                seen.set(`${newRow},${newCol}`, currentScore + indexScore);
              }
            }
          }
        }
        height += 1;
        currentIndexes = nextIndexes.map(([row, col]) => {
          const indexScore = seen.get(`${row},${col}`)!;
          return [row, col, indexScore];
        });
      }

      if (height === 9) {
        score += currentIndexes.reduce(
          (acc, [, , indexScore]) => acc + indexScore,
          0,
        );
      }
    }
  }
  return score;
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
console.log(solve(input));
console.log(solve(input, true));
