import {
  isPositive,
  reversePath,
  scalePath64,
  scalePathsD,
  union,
} from "../Clipper";
import { FillRule } from "../Core/CoreEnums";
import { Path64, isPath64 } from "../Core/Path64";
import { PathD, isPathD } from "../Core/PathD";
import { Paths64 } from "../Core/Paths64";
import { PathsD } from "../Core/PathsD";

const minkowskiInternal = (
  pattern: Path64,
  path: Path64,
  isSum: boolean,
  isClosed: boolean,
): Paths64 => {
  const delta = isClosed ? 0 : 1;
  const patLen = pattern.length;
  const pathLen = path.length;
  const tmp = new Paths64();

  for (const pathPt of path) {
    const path2: Path64 = new Path64();

    if (isSum) {
      for (const basePt of pattern) {
        path2.push({ x: pathPt.x + basePt.x, y: pathPt.y + basePt.y });
      }
    } else {
      for (const basePt of pattern) {
        path2.push({ x: pathPt.x - basePt.x, y: pathPt.y - basePt.y });
      }
    }

    tmp.push(path2);
  }

  const result = new Paths64();
  let g = isClosed ? pathLen - 1 : 0;
  let h = patLen - 1;
  for (let i = delta; i < pathLen; i++) {
    for (let j = 0; j < patLen; j++) {
      const quad: Path64 = new Path64([
        tmp[g][h],
        tmp[i][h],
        tmp[i][j],
        tmp[g][j],
      ]);
      if (!isPositive(quad)) {
        result.push(reversePath(quad));
      } else {
        result.push(quad);
      }
      h = j;
    }
    g = i;
  }

  return result;
};

export function sum(pattern: Path64, path: Path64, isClosed: boolean): Paths64;
export function sum(
  pattern: PathD,
  path: PathD,
  isClosed: boolean,
  decimalPlaces?: number,
): PathsD;
export function sum(
  pattern: Path64 | PathD,
  path: Path64 | PathD,
  isClosed: boolean,
  decimalPlaces?: number,
): Paths64 | PathsD;

export function sum(
  pattern: Path64 | PathD,
  path: Path64 | PathD,
  isClosed: boolean,
  decimalPlaces: number = 2,
): Paths64 | PathsD {
  if (isPath64(pattern) && isPath64(path)) {
    return union(
      minkowskiInternal(pattern, path, true, isClosed),
      FillRule.NonZero,
    );
  } else if (isPathD(pattern) && isPathD(path)) {
    const scale = Math.pow(10, decimalPlaces);
    const tmp = union(
      minkowskiInternal(
        scalePath64(pattern, scale),
        scalePath64(path, scale),
        true,
        isClosed,
      ),
      FillRule.NonZero,
    );
    return scalePathsD(tmp, 1 / scale);
  }
  throw new Error("todo: change message");
}

export function diff(pattern: Path64, path: Path64, isClosed: boolean): Paths64;
export function diff(
  pattern: PathD,
  path: PathD,
  isClosed: boolean,
  decimalPlaces?: number,
): PathsD;
export function diff(
  pattern: Path64 | PathD,
  path: Path64 | PathD,
  isClosed: boolean,
  decimalPlaces?: number,
): Paths64 | PathsD;

export function diff(
  pattern: Path64 | PathD,
  path: Path64 | PathD,
  isClosed: boolean,
  decimalPlaces: number = 2,
): Paths64 | PathsD {
  if (isPath64(pattern) && isPath64(path)) {
    return union(
      minkowskiInternal(pattern, path, false, isClosed),
      FillRule.NonZero,
    );
  } else if (isPathD(pattern) && isPathD(path)) {
    const scale = Math.pow(10, decimalPlaces);
    const tmp = union(
      minkowskiInternal(
        scalePath64(pattern, scale),
        scalePath64(path, scale),
        false,
        isClosed,
      ),
      FillRule.NonZero,
    );
    return scalePathsD(tmp, 1 / scale);
  }
  throw new Error("todo: change message");
}

export const Minkowski = {
  sum,
  diff,
} as const;