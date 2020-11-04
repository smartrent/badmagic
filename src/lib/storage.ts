type GetPayload = {
  key: string;
};

type SetPayload = {
  key: string;
  value: any;
};

export default {
  get({ key }: GetPayload) {
    try {
      const item = localStorage.getItem(key);

      // @ts-ignore
      return JSON.parse(item);
    } catch (err) {
      console.error("Unable to parse JSON from localStorage", err);
      return null;
    }
  },

  set({ key, value }: SetPayload) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error("Unable to stringify JSON for localStorage", err);
    }
  },
};
