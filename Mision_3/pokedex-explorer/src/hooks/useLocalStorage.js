import { useEffect, useRef, useState } from 'react';

function readStoredValue(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue === null ? fallback : JSON.parse(storedValue);
  } catch {
    return fallback;
  }
}

function parseStoredValue(value, fallback) {
  try {
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

/** Persiste un estado en localStorage y lo sincroniza entre pestañas. */
export default function useLocalStorage(key, initialValue) {
  const initialValueRef = useRef(initialValue);
  const [value, setValue] = useState(() => readStoredValue(key, initialValueRef.current));

  useEffect(() => {
    try {
      const serializedValue = JSON.stringify(value);
      if (window.localStorage.getItem(key) !== serializedValue) {
        window.localStorage.setItem(key, serializedValue);
      }
    } catch {
      // La aplicación sigue funcionando si el navegador bloquea o llena localStorage.
    }
  }, [key, value]);

  useEffect(() => {
    const syncFromAnotherTab = (event) => {
      if (event.key !== key && event.key !== null) return;
      setValue(parseStoredValue(event.key === null ? null : event.newValue, initialValueRef.current));
    };

    window.addEventListener('storage', syncFromAnotherTab);
    return () => window.removeEventListener('storage', syncFromAnotherTab);
  }, [key]);

  return [value, setValue];
}
