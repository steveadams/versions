import { expect, test } from "vitest";
import {
  extractVersions,
  compareVersions,
  Version,
  Spec,
  extractComparitor,
  compareVersionWithSpec,
  unwrapAndCompareVersionsAndSpecs as compareVersionsAndSpecs,
} from "./";

test("extractVersions pulls correct versions from  Version strings", () => {
  expect(extractVersions("1")).toEqual(["1", "00"]);
  expect(extractVersions("1.0")).toEqual(["1", "00"]);
  expect(extractVersions("2.1")).toEqual(["2", "10"]);
  expect(extractVersions("2.21")).toEqual(["2", "21"]);
  expect(extractVersions("2.01")).toEqual(["2", "01"]);
  expect(extractVersions("0.01")).toEqual(["0", "01"]);
  expect(extractVersions("99.01")).toEqual(["99", "01"]);
});

test("extractComparitors pulls correct comparitor from Spec strings", () => {
  expect(extractComparitor(">0.00")).toBe(">");
  expect(extractComparitor(">0.01")).toBe(">");
  expect(extractComparitor(">=1.03")).toBe(">=");
  expect(extractComparitor("<=1")).toBe("<=");
  expect(extractComparitor("<1")).toBe("<");
});

test("compareVersions: '>' yields correct results", () => {
  expect(compareVersions("1.01", ">", "1.1")).toBe(false);
  expect(compareVersions("1.1", ">", "1.01")).toBe(true);
  expect(compareVersions("2", ">", "2")).toBe(false);
  expect(compareVersions("2.01", ">", "2.1")).toBe(false);
  expect(compareVersions("4.01", ">", "3.09")).toBe(true);
});

test("compareVersions: '<' yields correct results", () => {
  expect(compareVersions("1.01", "<", "1.1")).toBe(true);
  expect(compareVersions("1.1", "<", "1.01")).toBe(false);
  expect(compareVersions("2", "<", "2")).toBe(false);
  expect(compareVersions("2.01", "<", "2.1")).toBe(true);
  expect(compareVersions("4.01", "<", "3.09")).toBe(false);
});

test("compareVersions: '>=' yields correct results", () => {
  expect(compareVersions("1.1", ">=", "1.1")).toBe(true);
  expect(compareVersions("1.1", ">=", "1.01")).toBe(true);
  expect(compareVersions("2", ">=", "2")).toBe(true);
  expect(compareVersions("2.01", ">=", "2.1")).toBe(false);
  expect(compareVersions("4.01", ">=", "3.09")).toBe(true);
});

test("compareVersions: '<=' yields correct results", () => {
  expect(compareVersions("1.1", "<=", "1.1")).toBe(true);
  expect(compareVersions("1.1", "<=", "1.01")).toBe(false);
  expect(compareVersions("2", "<=", "2")).toBe(true);
  expect(compareVersions("2.01", "<=", "2.1")).toBe(true);
  expect(compareVersions("4.01", "<=", "3.09")).toBe(false);
});

test("compareVersionWithSpec yields correct results", () => {
  expect(compareVersionWithSpec("1.1", ">1.1")).toBe(false);
  expect(compareVersionWithSpec("1.1", "<=1.01")).toBe(false);
  expect(compareVersionWithSpec("1.10", "<=1.09")).toBe(false);
  expect(compareVersionWithSpec("0.5", "<=1.09")).toBe(true);
  expect(compareVersionWithSpec("2", "<2")).toBe(false);
  expect(compareVersionWithSpec("2", ">2")).toBe(false);
  expect(compareVersionWithSpec("2", ">2.0")).toBe(false);
  expect(compareVersionWithSpec("2.1", ">2.0")).toBe(true);
  expect(compareVersionWithSpec("2.01", ">2.1")).toBe(false);
  expect(compareVersionWithSpec("4.01", ">=3.09")).toBe(true);
});

test("compareVersionsAndSpecs yields correct results", () => {
  expect(compareVersionsAndSpecs(["1.1,<=2.01", "1.1,>1", "1.1,<=2"])).toBe(
    true
  );
  expect(
    compareVersionsAndSpecs(["12.01,>12", "12.01,>0.12", "12.01,>=1"])
  ).toBe(true);
  expect(
    compareVersionsAndSpecs(["12.01,<12", "12.01,>0.12", "12.01,>=1"])
  ).toBe(true);
});
