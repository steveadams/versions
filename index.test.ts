import { expect, test } from "vitest";
import {
  parseVersionParts,
  compareVersions,
  parseOperator,
  compareVersionWithSpec,
  compare,
  parseVersionAndSpec,
} from "./";

// parseVersionAndSpec tests - - -

test("parseVersionAndSpec parses correct version and spec from strings", () => {
  expect(parseVersionAndSpec("1.0,>5.5")).toEqual(["1.0", ">5.5"]);
  expect(parseVersionAndSpec("0.5,>=0")).toEqual(["0.5", ">=0"]);
  expect(parseVersionAndSpec("0,>=0")).toEqual(["0", ">=0"]);
  expect(parseVersionAndSpec("1.85,>=1.08")).toEqual(["1.85", ">=1.08"]);
});

test("parseVersionAndSpec parses correct version and spec from strings", () => {
  expect(() => parseVersionAndSpec("123")).toThrowError(
    /invalid version and spec/
  );
});

// parseVersionAndSpec tests - - -

test("parseVersions parses correct versions from Version strings", () => {
  expect(parseVersionParts("1")).toEqual(["1", "00"]);
  expect(parseVersionParts("1.0")).toEqual(["1", "00"]);
  expect(parseVersionParts("1.00")).toEqual(["1", "00"]);
  expect(parseVersionParts("0.01")).toEqual(["0", "01"]);
  expect(parseVersionParts("0.00")).toEqual(["0", "00"]);
  expect(parseVersionParts("99.01")).toEqual(["99", "01"]);
});

// parseOperator tests - - -

test("parseOperator parses correct operator from Spec strings", () => {
  expect(parseOperator(">0.00")).toBe(">");
  expect(parseOperator(">0.01")).toBe(">");
  expect(parseOperator(">=1.03")).toBe(">=");
  expect(parseOperator("<=1")).toBe("<=");
  expect(parseOperator("<1")).toBe("<");
});

test("parseOperator throws when given invalid operator", () => {
  // @ts-expect-error
  expect(() => parseOperator("==0.00")).toThrowError(/invalid/);
  // @ts-expect-error
  expect(() => parseOperator("!0.00")).toThrowError(/invalid/);
  2;
});

// compareVersions operator tests - - -

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

// compareVersionWithSpec tests

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

// compareVersionAndSpecs tests

test("compare yields correct results", () => {
  expect(compare(["1.1,<=2.01", "1.1,>1", "1.1,<=2"])).toBe(true);
  expect(compare(["12.01,>12", "12.01,>0.12", "12.01,>=1"])).toBe(true);
  expect(compare(["12.01,<12", "12.01,>0.12", "12.01,>=1"])).toBe(true);
});

test("compare throws when expected", () => {
  expect(() =>
    // @ts-expect-error
    compare("pineapples are bad for people with diabetes")
  ).toThrowError(/not a function/);
  expect(() =>
    compare(["pineapples are bad for people with diabetes"])
  ).toThrowError(/invalid version and spec/);
});
