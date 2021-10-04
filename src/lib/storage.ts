type GetPayload = {
  key: string;
};

type SetPayload = {
  key: string;
  value: any;
};

export default {
  get({ key }: GetPayload): any {
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
  },

  set({ key, value }: SetPayload): any {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return value;
    } catch (err) {
      console.error("Unable to stringify JSON for localStorage", err);
    }
  },
};
