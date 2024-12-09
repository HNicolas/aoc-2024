import { join } from "@std/path";

function solve1(input: string): number {
  const original = input.split("").map((n) => parseInt(n, 10));
  const compressed: number[] = [];
  let fileIndex = 0;
  let fileNegativeIndex = -1;

  let startCursor = 0;
  let endCursor = (original.length - 1) % 2 === 0
    ? original.length - 1
    : original.length - 2;
  let remainingAtEndCursor = original[endCursor];

  while (startCursor < endCursor) {
    const value = original[startCursor];
    if (value === 0) {
      startCursor += 1;
      continue;
    }

    if (startCursor % 2 == 0) {
      // file
      for (let i = 0; i < value; i += 1) {
        compressed.push(fileIndex);
      }
      fileIndex += 1;
    } else {
      // empty space
      for (let i = 0; i < value; i += 1) {
        if (remainingAtEndCursor > 0) {
          compressed.push(fileNegativeIndex);
          remainingAtEndCursor -= 1;
        } else {
          while (endCursor - 2 > startCursor && remainingAtEndCursor === 0) {
            endCursor -= 2;
            remainingAtEndCursor = original[endCursor];
          }

          if (remainingAtEndCursor > 0) {
            fileNegativeIndex -= 1;
            compressed.push(fileNegativeIndex);
            remainingAtEndCursor -= 1;
          }
        }
      }
    }
    startCursor += 1;
  }

  while (remainingAtEndCursor > 0) {
    compressed.push(fileNegativeIndex);
    remainingAtEndCursor -= 1;
  }

  return compressed.map((v) => v >= 0 ? v : fileIndex - fileNegativeIndex + v)
    .reduce((acc, curr, index) => acc + index * curr, 0);
}

function solve2(input: string): number {
  const original = input.split("").map((n) => parseInt(n, 10));

  let startIndex = 0;
  // file ID, startIndex, length
  let fileId = 0;
  const files: { id: number; startIndex: number; length: number }[] = [];
  // length/startindex (don't forget to update when moving one)
  const freeSpaces: { startIndex: number; length: number }[] = [];
  for (let i = 0; i < original.length; i += 1) {
    const blockLength = original[i];
    if (blockLength === 0) continue;

    if (i % 2 === 0) {
      files.push({
        id: fileId++,
        startIndex,
        length: blockLength,
      });
    } else {
      freeSpaces.push({
        startIndex,
        length: blockLength,
      });
    }
    startIndex += blockLength;
  }

  for (let i = 0; i < files.length; i += 1) {
    const file = files.at(-1 - i)!;
    const foundIndex = freeSpaces.findIndex((freeSpace) =>
      freeSpace.length >= file.length && freeSpace.startIndex < file.startIndex
    );
    if (foundIndex === -1) continue;

    const freeSpace = freeSpaces[foundIndex];
    file.startIndex = freeSpace.startIndex;
    freeSpace.startIndex += file.length;
    freeSpace.length -= file.length;
  }

  return files.reduce(
    (acc, curr) => {
      for (let i = 0; i < curr.length; i += 1) {
        acc += (curr.startIndex + i) * curr.id;
      }
      return acc;
    },
    0,
  );
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
console.log(solve1(input));
console.log(solve2(input));
