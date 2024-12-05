import { join } from "@std/path";

function parseInput(input: string): [Map<string, string[]>, string[][]] {
  const [rulesInput, updatesInput] = input.split("\n\n");

  // for a given page return the pages that must come before
  const rules = rulesInput.split("\n")
    .reduce((acc, rule) => {
      const [before, after] = rule.split("|");
      const mustBeBefore = acc.get(after);
      if (mustBeBefore) {
        mustBeBefore.push(before);
      } else {
        acc.set(after, [before]);
      }
      return acc;
    }, new Map<string, string[]>());

  const updates = updatesInput.split("\n")
    .map((update) => update.split(","));
  return [rules, updates];
}

function solve1(rules: Map<string, string[]>, updates: string[][]): number {
  return updates.filter((update) =>
    update.every((page, index) => {
      const mustBeBefore = rules.get(page);
      if (!mustBeBefore) return true;

      return update.slice(index + 1).every((p) => !mustBeBefore.includes(p));
    })
  ).reduce(
    (acc, update) => acc + parseInt(update[(update.length - 1) / 2], 10),
    0,
  );
}

function solve2(rules: Map<string, string[]>, updates: string[][]): number {
  return updates.filter((update) =>
    !update.every((page, index) => {
      const mustBeBefore = rules.get(page);
      if (!mustBeBefore) return true;

      return update.slice(index + 1).every((p) => !mustBeBefore.includes(p));
    })
  )
    .map((update) =>
      update.toSorted((a, b) => {
        const mustBeBeforeA = rules.get(a);
        const mustBeBeforeB = rules.get(b);
        if (mustBeBeforeA && mustBeBeforeA.includes(b)) {
          return 1;
        }
        if (mustBeBeforeB && mustBeBeforeB.includes(a)) {
          return -1;
        }
        return 0;
      })
    )
    .reduce(
      (acc, update) => acc + parseInt(update[(update.length - 1) / 2], 10),
      0,
    );
}

const path = join(import.meta.dirname ?? "", "input.txt");
// const path = join(import.meta.dirname ?? "", "sample.txt");
const input = await Deno.readTextFile(path);
const [rules, updates] = parseInput(input);
console.log(solve1(rules, updates));
console.log(solve2(rules, updates));
