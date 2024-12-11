import { join } from "@std/path";

type Block = {
  index: number;
  length: number;
};

type FileBlock = Block & { id: number };

type DiskScan = {
  files: FileBlock[];
  freeSpaces: Block[];
};

function scanDisk(disk: number[]): DiskScan {
  const files: FileBlock[] = [];
  const freeSpaces: Block[] = [];

  let id = 0;
  let index = 0;
  for (let i = 0; i < disk.length; i += 1) {
    const blockLength = disk[i];
    if (blockLength === 0) continue;

    if (i % 2 === 0) {
      files.push({
        id: id++,
        index,
        length: blockLength,
      });
    } else {
      freeSpaces.push({
        index,
        length: blockLength,
      });
    }
    index += blockLength;
  }
  return { files, freeSpaces };
}

function solve(input: string, fragmentFiles = true): number {
  const disk = input.split("").map((n) => parseInt(n, 10));
  const { files, freeSpaces } = scanDisk(disk);

  loop: for (let i = files.length - 1; i >= 0; i -= 1) {
    const file = files[i];

    if (fragmentFiles) {
      while (file.length > 0) {
        const freeSpaceIndex = freeSpaces.findIndex((freeSpace) =>
          freeSpace.length > 0 && freeSpace.index < file.index
        );
        if (freeSpaceIndex === -1) break loop;

        const freeSpace = freeSpaces[freeSpaceIndex];
        const moved = Math.min(freeSpace.length, file.length);
        files.push({
          id: file.id,
          index: freeSpace.index,
          length: moved,
        });
        file.length -= moved;
        freeSpace.index += moved;
        freeSpace.length -= moved;
      }
    } else {
      const freeSpaceIndex = freeSpaces.findIndex((freeSpace) =>
        freeSpace.length >= file.length && freeSpace.index < file.index
      );
      if (freeSpaceIndex === -1) continue;

      const freeSpace = freeSpaces[freeSpaceIndex];
      file.index = freeSpace.index;
      freeSpace.index += file.length;
      freeSpace.length -= file.length;
    }
  }

  return files.reduce(
    (acc, curr) => {
      for (let i = 0; i < curr.length; i += 1) {
        acc += (curr.index + i) * curr.id;
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
console.log(solve(input, false));
