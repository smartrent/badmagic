export function get(key: string): any {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return null;
    }

    return JSON.parse(item);
  } catch (err) {
    console.error("Unable to parse JSON from localStorage", err);
    return null;
  }
}

export function set(key: string, value: any): any {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (err) {
    console.error("Unable to stringify JSON for localStorage", err);
  }
}

export function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("Unable to stringify JSON for localStorage", err);
  }
}
