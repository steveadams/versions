import { match } from "ts-pattern";

const allBeforeFirstDigitRegEx = new RegExp(/(.*?)\d/);

type Integer = IntRange<10>;

export type VersionNumber = `${Integer}` | `${Integer}${Integer}`;
export type Version = `${VersionNumber}` | `${VersionNumber}.${VersionNumber}`;

export type Comparitor = ">" | "<" | "<=" | ">=";
export type Spec = `${Comparitor}${Version}`;

type Predicate = (comparison: Version, spec: Version) => boolean;

export const extractVersionAndSpec = (
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

export const extractVersions = (
  version: Version
): [VersionNumber, VersionNumber] => {
  const [major, minor = "0"] = version.split(".");

  if (minor.length === 1) {
    return [major, `${minor}0`] as [VersionNumber, VersionNumber];
  }

  return [major, minor] as [VersionNumber, VersionNumber];
};

export const extractComparitor = (spec: Spec): Comparitor => {
  const matches = allBeforeFirstDigitRegEx.exec(spec);

  if (!matches) {
    throw new Error(`Failed to get a valid comparitor from the spec: ${spec}`);
  }

  return matches[1] as Comparitor;
};

const greaterThan: Predicate = (compare, spec) => {
  const [compareMajor, compareMinor] = extractVersions(compare);
  const [specMajor, specMinor] = extractVersions(spec);

  if (compareMajor !== specMajor) {
    return compareMajor > specMajor;
  }

  return compareMinor > specMinor;
};

const lessThan: Predicate = (compare, spec) => {
  const [compareMajor, compareMinor] = extractVersions(compare);
  const [specMajor, specMinor] = extractVersions(spec);

  if (compareMajor !== specMajor) {
    return compareMajor < specMajor;
  }

  return compareMinor < specMinor;
};

const greaterThanOrEqual: Predicate = (compare, spec) => {
  const [compareMajor, compareMinor] = extractVersions(compare);
  const [specMajor, specMinor] = extractVersions(spec);

  if (compareMajor !== specMajor) {
    return compareMajor >= specMajor;
  }

  return compareMinor >= specMinor;
};

const lessThanOrEqual: Predicate = (compare, spec) => {
  const [compareMajor, compareMinor] = extractVersions(compare);
  const [specMajor, specMinor] = extractVersions(spec);

  if (compareMajor !== specMajor) {
    return compareMajor <= specMajor;
  }

  return compareMinor <= specMinor;
};

export const compareVersions = (
  comparison: Version,
  comparitor: Comparitor,
  spec: Version
): boolean =>
  match(comparitor)
    .with(">", () => greaterThan(comparison, spec))
    .with("<", () => lessThan(comparison, spec))
    .with(">=", () => greaterThanOrEqual(comparison, spec))
    .with("<=", () => lessThanOrEqual(comparison, spec))
    .exhaustive();

export const compareVersionWithSpec = (version: Version, spec: Spec) => {
  const comparitor = extractComparitor(spec);
  const specVersion = spec.replace(comparitor, "") as Version;

  return compareVersions(version, comparitor, specVersion);
};

export const unwrapAndCompareVersionsAndSpecs = (
  versionsAndSpecs: string[]
) => {
  return versionsAndSpecs.some((versionAndSpec) => {
    const [version, spec] = extractVersionAndSpec(versionAndSpec);

    return compareVersionWithSpec(version, spec);
  });
};
