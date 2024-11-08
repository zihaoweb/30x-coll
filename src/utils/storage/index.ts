const storage = {
  set(key: string | null, value: string | boolean | null) {
    if (key != null && value != null) {
      uni.setStorageSync(key, value);
    }
  },
  get(key: string | null) {
    if (!localStorage)
      return null;

    if (key == null)
      return null;

    return uni.getStorageSync(key);
  },
  setJSON(key: any, jsonValue: any) {
    if (jsonValue != null)
      this.set(key, JSON.stringify(jsonValue));
  },
  getJSON(key: any) {
    const value = this.get(key);
    if (value != null)
      return JSON.parse(value);
  },
  remove(key: string) {
    uni.removeStorageSync(key);
  },
};

export default storage;
