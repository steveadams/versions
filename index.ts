import { match } from "ts-pattern";

const allBeforeFirstDigit = new RegExp(/(.*?)\d/);

type Integer = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type VersionPart = `${Integer}` | `${Integer}${Integer}`;
export type Version = `${VersionPart}` | `${VersionPart}.${VersionPart}`;

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

export const extractVersionParts = (
  version: Version
): [VersionPart, VersionPart] => {
  const [major, minor = "0"] = version.split(".");

  if (minor.length === 1) {
    return [major, `${minor}0`] as [VersionPart, VersionPart];
  }

  return [major, minor] as [VersionPart, VersionPart];
};

export const extractComparitor = (spec: Spec): Comparitor => {
  const matches = allBeforeFirstDigit.exec(spec);

  if (!matches) {
    throw new Error(`Failed to get a valid comparitor from the spec: ${spec}`);
  }

  return matches[1] as Comparitor;
};

const greaterThan: Predicate = (compare, spec) => {
  const [major, minor] = extractVersionParts(compare);
  const [specMajor, specMinor] = extractVersionParts(spec);

  return major !== specMajor ? major > specMajor : minor > specMinor;
};

const lessThan: Predicate = (comparable, spec) => {
  const [major, minor] = extractVersionParts(comparable);
  const [specMajor, specMinor] = extractVersionParts(spec);

  return major !== specMajor ? major < specMajor : minor < specMinor;
};

const greaterThanOrEqual: Predicate = (comparable, spec) => {
  const [major, minor] = extractVersionParts(comparable);
  const [specMajor, specMinor] = extractVersionParts(spec);

  return major !== specMajor ? major >= specMajor : minor >= specMinor;
};

const lessThanOrEqual: Predicate = (comparable, spec) => {
  const [major, minor] = extractVersionParts(comparable);
  const [specMajor, specMinor] = extractVersionParts(spec);

  return major !== specMajor ? major <= specMajor : minor <= specMinor;
};

export const compareVersions = (
  versionForComparison: Version,
  comparitor: Comparitor,
  specVersion: Version
): boolean =>
  match(comparitor)
    .with(">", () => greaterThan(versionForComparison, specVersion))
    .with("<", () => lessThan(versionForComparison, specVersion))
    .with(">=", () => greaterThanOrEqual(versionForComparison, specVersion))
    .with("<=", () => lessThanOrEqual(versionForComparison, specVersion))
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
