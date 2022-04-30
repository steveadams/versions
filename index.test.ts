import { expect, test } from "vitest";
import {
  extractVersions,
  compareVersions,
  Version,
  Spec,
  Comparitor,
  extractComparitor,
  compareVersionWithSpec,
  unwrapAndCompareVersionsAndSpecs as compareVersionsAndSpecs,
} from "./";

type ExtractVersionsCase = [
  version: Version,
  expected: ReturnType<typeof extractVersions>
];

const extractVersionsCases: ExtractVersionsCase[] = [
  ["1", ["1", "00"]],
  ["1.0", ["1", "00"]],
  ["2.1", ["2", "10"]],
  ["2.21", ["2", "21"]],
  ["2.01", ["2", "01"]],
  ["0.01", ["0", "01"]],
  ["99.01", ["99", "01"]],
];

test("extractVersions pulls correct versions from  Version strings", () => {
  extractVersionsCases.forEach(([version, expected]) =>
    expect(extractVersions(version)).toEqual(expected)
  );
});

type ExtractComparitorCase = [spec: Spec, expected: Comparitor];

const extractComparitorCases: ExtractComparitorCase[] = [
  [">0.00", ">"],
  [">0.01", ">"],
  [">=1.03", ">="],
  ["<=1", "<="],
  ["<1", "<"],
];

test("extractComparitors pulls correct comparitor from Spec strings", () => {
  extractComparitorCases.forEach(([spec, expected]) =>
    expect(extractComparitor(spec)).toEqual(expected)
  );
});

type CompareCase = [compare: Version, specVersion: Version, expected: boolean];

const greaterThanCases: CompareCase[] = [
  ["1.01", "1.1", false],
  ["1.1", "1.01", true],
  ["2", "2", false],
  ["2.01", "2.1", false],
  ["4.01", "3.09", true],
];

test("compareVersions: '>' yields correct results", () => {
  greaterThanCases.forEach(([compare, spec, expected]) =>
    expect(compareVersions(compare, ">", spec)).toBe(expected)
  );
});

const lessThanCases: CompareCase[] = [
  ["1.01", "1.1", true],
  ["1.1", "1.01", false],
  ["2", "2", false],
  ["2.01", "2.1", true],
  ["4.01", "3.09", false],
];

test("compareVersions: '<' yields correct results", () => {
  lessThanCases.forEach(([compare, spec, expected]) =>
    expect(compareVersions(compare, "<", spec)).toBe(expected)
  );
});

const greaterThanOrEqualCases: CompareCase[] = [
  ["1.1", "1.1", true],
  ["1.1", "1.01", true],
  ["2", "2", true],
  ["2.01", "2.1", false],
  ["4.01", "3.09", true],
];

test("compareVersions: '>=' yields correct results", () => {
  greaterThanOrEqualCases.forEach(([compare, spec, expected]) =>
    expect(compareVersions(compare, ">=", spec)).toBe(expected)
  );
});

const lessThanOrEqualCases: CompareCase[] = [
  ["1.1", "1.1", true],
  ["1.1", "1.01", false],
  ["2", "2", true],
  ["2.01", "2.1", true],
  ["4.01", "3.09", false],
];

test("compareVersions: '<=' yields correct results", () => {
  lessThanOrEqualCases.forEach(([compare, spec, expected]) =>
    expect(compareVersions(compare, "<=", spec)).toBe(expected)
  );
});

type CompareVersionWithSpecCase = [
  compare: Version,
  spec: Spec,
  expected: boolean
];

const compareVersionWithSpecCases: CompareVersionWithSpecCase[] = [
  ["1.1", ">1.1", false],
  ["1.1", "<=1.01", false],
  ["1.10", "<=1.09", false],
  ["0.5", "<=1.09", true],
  ["2", "<2", false],
  ["2", ">2", false],
  ["2", ">2.0", false],
  ["2.1", ">2.0", true],
  ["2.01", ">2.1", false],
  ["4.01", ">=3.09", true],
];

test("compareVersionWithSpec yields correct results", () => {
  compareVersionWithSpecCases.forEach(([compare, spec, expected]) =>
    expect(compareVersionWithSpec(compare, spec)).toBe(expected)
  );
});

type CompareVersionsAndSpecsCases = [values: string[], expected: boolean];

const compareVersionsAndSpecsCases: CompareVersionsAndSpecsCases[] = [
  [["1.1,<=2.01", "1.1,>1", "1.1,<=2"], true],
  [["12.01,>12", "12.01,>0.12", "12.01,>=1"], true],
  [["12.01,<12", "12.01,>0.12", "12.01,>=1"], true],
];

test("compareVersionsAndSpecs yields correct results", () => {
  compareVersionsAndSpecsCases.forEach(([values, expected]) =>
    expect(compareVersionsAndSpecs(values)).toBe(expected)
  );
});
