import { join } from "@std/path";

function getPostions(
  lines: string[],
  [startRow, startColumn]: [number, number],
  startDirection: number,
) {
  const rows = lines.length;
  const columns = lines[0].length;
  const directions = [
    [-1, 0], // up
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
  ];

  let row = startRow;
  let column = startColumn;
  let direction = startDirection;

  const positions = new Map<number, number>();
  positions.set(row * columns + column, direction);

  let isLoop = false;
  do {
    const nextRow = row + directions[direction][0];
    if (nextRow < 0 || nextRow >= rows) break;
    const nextColumn = column + directions[direction][1];
    if (nextColumn < 0 || nextColumn >= columns) break;

    if (lines[nextRow][nextColumn] === "#") {
      direction = (direction + 1) % directions.length;
    } else {
      row = nextRow;
      column = nextColumn;
      const index = row * columns + column;
      if (positions.get(index) === direction) {
        isLoop = true;
        break;
      }
      positions.set(row * columns + column, direction);
    }
  } while (true);

  return { positions: positions.keys().toArray(), isLoop };
}

function solve1(input: string): number {
  const lines = input.split("\n");
  const startIndex = input.indexOf("^");
  // width + 1 because of the "\n" chars
  const startColumn = startIndex % (lines[0].length + 1);
  const startRow = (startIndex - startColumn) / (lines[0].length + 1);

  const { positions } = getPostions(lines, [startRow, startColumn], 0);

  return positions.length;
}

function solve2(input: string): number {
  // get all guard postions without obstacle (no need to compute for other positions)
  // filter only the positions that result in a loop (already seen position + direction)
  const lines = input.split("\n");
  const startIndex = input.indexOf("^");
  // width + 1 because of the "\n" chars
  const startColumn = startIndex % (lines[0].length + 1);
  const startRow = (startIndex - startColumn) / (lines[0].length + 1);

  const { positions } = getPostions(lines, [startRow, startColumn], 0);
  return positions
    .filter((position) => position !== startRow * lines[0].length + startColumn)
    .map((position) => {
      const obstacleColumn = position % lines[0].length;
      const obstableRow = (position - obstacleColumn) / lines[0].length;
      const newLines = lines.toSpliced(
        obstableRow,
        1,
        lines[obstableRow].split("").toSpliced(obstacleColumn, 1, "#").join(""),
      );
      return getPostions(newLines, [startRow, startColumn], 0);
    })
    .filter(({ isLoop }) => isLoop)
    .length;
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
console.log(solve1(input));
console.log(solve2(input));
