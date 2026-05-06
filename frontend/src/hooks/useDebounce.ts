import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delayInMilliseconds = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayInMilliseconds);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [value, delayInMilliseconds]);

  return debouncedValue;
}