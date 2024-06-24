import { useCallback, useEffect, useRef } from "react";

export function useStableCallback<
  F extends (...args: readonly any[]) => unknown
>(
  value: ((...args: Parameters<F>) => ReturnType<F>) | null | undefined,
  fallback: (...args: Parameters<F>) => ReturnType<F>
): (...args: Parameters<F>) => ReturnType<F> {
  const ref = useRef({ value, fallback });
  ref.current = { value, fallback };

  return useCallback(
    (...args) =>
      ref.current.value
        ? ref.current.value(...args)
        : ref.current.fallback(...args),
    []
  );
}

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
