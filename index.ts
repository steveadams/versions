import { match } from "ts-pattern";

const allBeforeFirstDigit = new RegExp(/(.*?)\d/);

type ZeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type VersionPart = `${ZeroToNine}` | `${ZeroToNine}${ZeroToNine}`;
export type Version = `${VersionPart}` | `${VersionPart}.${VersionPart}`;

export type Operator = typeof VALID_OPERATORS[number];
export type Spec = `${Operator}${Version}`;

type Predicate = (
  testVersion: [VersionPart, VersionPart],
  specVersion: [VersionPart, VersionPart]
) => boolean;

const VALID_OPERATORS = [">", "<", "<=", ">="] as const;

export const parseVersionAndSpec = (
  versionAndSpec: string
): [Version, Spec] => {
  const values = versionAndSpec.split(",");

  if (values.length === 2) {
    return values as [Version, Spec];
  }

  throw new Error(
    `Received invalid version and spec string: '${versionAndSpec}'`
  );
};

export const parseVersionParts = (
  version: Version
): [VersionPart, VersionPart] => {
  const [major, minor = "0"] = version.split(".");

  if (minor.length === 1) {
    return [major, `${minor}0`] as [VersionPart, VersionPart];
  }

  return [major, minor] as [VersionPart, VersionPart];
};

export const parseOperator = (spec: Spec): Operator => {
  const matches = allBeforeFirstDigit.exec(spec);

  if (!matches || !matches[1]) {
    throw new Error(`Failed to parse a valid operator from the spec: ${spec}`);
  }

  const operator = matches[1] as Operator;

  if (!VALID_OPERATORS.includes(operator)) {
    throw new Error(`The given operator is invalid: ${operator}`);
  }

  return operator;
};

// TODO: Is there a way to dynamically call operators?
// Quick look says no
const greaterThan: Predicate = ([major, minor], [specMajor, specMinor]) =>
  major !== specMajor ? major > specMajor : minor > specMinor;

const lessThan: Predicate = ([major, minor], [specMajor, specMinor]) =>
  major !== specMajor ? major < specMajor : minor < specMinor;

const greaterThanOrEqual: Predicate = (
  [major, minor],
  [specMajor, specMinor]
) => (major !== specMajor ? major >= specMajor : minor >= specMinor);

const lessThanOrEqual: Predicate = ([major, minor], [specMajor, specMinor]) =>
  major !== specMajor ? major <= specMajor : minor <= specMinor;

export const compareVersions = (
  versionForComparison: Version,
  operator: Operator,
  specVersion: Version
): boolean => {
  const compare = parseVersionParts(versionForComparison);
  const spec = parseVersionParts(specVersion);

  return match(operator)
    .with(">", () => greaterThan)
    .with("<", () => lessThan)
    .with(">=", () => greaterThanOrEqual)
    .with("<=", () => lessThanOrEqual)
    .exhaustive()(compare, spec);
};

export const testVersionAgainstSpec = (version: Version, spec: Spec) => {
  const operator = parseOperator(spec);
  const specVersion = spec.replace(operator, "") as Version;

  return compareVersions(version, operator, specVersion);
};

export const compare = (versionsAndSpecs: string[]) => {
  return versionsAndSpecs.some((versionAndSpec) => {
    const [version, spec] = parseVersionAndSpec(versionAndSpec);

    return testVersionAgainstSpec(version, spec);
  });
};
