import { join } from "@std/path";

function canBeSolved(
  testValue: number,
  numbers: number[],
  canConcatenate = false,
): boolean {
  const toTest = [{ testValue, numbers }];
  while (toTest.length > 0) {
    const current = toTest.pop()!;
    if (current.numbers.length === 1) {
      if (current.numbers[0] === current.testValue) {
        return true;
      }
      continue;
    }

    const lastNumber = current.numbers[current.numbers.length - 1];
    if (current.testValue % lastNumber === 0) {
      toTest.push({
        testValue: current.testValue / lastNumber,
        numbers: current.numbers.slice(0, -1),
      });
    }
    if (current.testValue >= lastNumber) {
      toTest.push({
        testValue: current.testValue - lastNumber,
        numbers: current.numbers.slice(0, -1),
      });
    }
    if (
      canConcatenate &&
      current.testValue.toString().endsWith(lastNumber.toString())
    ) {
      toTest.push({
        testValue: parseInt(
          current.testValue.toString().slice(
            0,
            -1 * lastNumber.toString().length,
          ),
          10,
        ),
        numbers: current.numbers.slice(0, -1),
      });
    }
  }
  return false;
}

function solve1(input: string): number {
  const lines = input.split("\n");

  let calibrationResult = 0;
  for (const line of lines) {
    const [testValue, ...numbers] = line.split(/:? /)
      .map((n) => parseInt(n, 10));
    if (canBeSolved(testValue, numbers)) {
      calibrationResult += testValue;
    }
  }
  return calibrationResult;
}

function solve2(input: string): number {
  const lines = input.split("\n");

  let calibrationResult = 0;
  for (const line of lines) {
    const [testValue, ...numbers] = line.split(/:? /)
      .map((n) => parseInt(n, 10));
    if (canBeSolved(testValue, numbers, true)) {
      calibrationResult += testValue;
    }
  }
  return calibrationResult;
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
console.log(solve1(input));
console.log(solve2(input));
