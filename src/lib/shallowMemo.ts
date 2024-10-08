import { useEffect, useRef } from "react";

export function useShallowMemo<
  T extends Record<string, unknown> | readonly unknown[]
>(value: T): T {
  const ref = useRef(value);

  useEffect(() => {
    if (!shallowEqual(value, ref.current)) {
      ref.current = value;
    }
  }, [value]);

  return ref.current;
}

function shallowEqual<T extends Record<string, unknown> | readonly unknown[]>(
  current: T,
  previous: T
): boolean {
  const isArray = Array.isArray(current);
  const prevIsArray = Array.isArray(previous);

  if (isArray && prevIsArray) {
    return (
      current.length === previous.length &&
      current.every((value, i) => Object.is(value, previous[i]))
    );
  } else if (isArray !== prevIsArray) {
    return false;
  }

  const currentKeys = Object.keys(current) as (keyof T & string)[];

  if (currentKeys.length !== Object.keys(previous).length) {
    return false;
  }

  return currentKeys.every((key) => Object.is(current[key], previous[key]));
}
