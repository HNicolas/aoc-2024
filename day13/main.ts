import { join } from "@std/path";

function solve(input: string, offset = 0): number {
  // x1 * a + y1 * b = z1
  // x2 * a + y2 * b = z2
  // b = (z1 - x1 * a) / y1
  // y1 * x2 * a + y2 * z1 - y2 * x1 * a = z2 * y1
  // a = (z2 * y1 - y2 * z1) / (y1 * x2 - y2 * x1)

  return input.split("\n\n")
    .map((block) => block.match(/\d+/g)!.map((v) => parseInt(v, 10)))
    .reduce(
      (acc, [x1, x2, y1, y2, z1, z2]) => {
        if (y1 * x2 === y2 * x1) return acc;

        const a = ((z2 + offset) * y1 - y2 * (z1 + offset)) /
          (y1 * x2 - y2 * x1);
        const b = (z1 + offset - x1 * a) / y1;

        if (Number.isInteger(a) && Number.isInteger(b)) {
          acc += 3 * a + b;
        }
        return acc;
      },
      0,
    );
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
console.log(solve(input));
console.log(solve(input, 10000000000000));
