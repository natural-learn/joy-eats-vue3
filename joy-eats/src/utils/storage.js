/**
 * 存储工具类
 * 提供localStorage和sessionStorage操作方法
 */
export class Storage {
    /**
   * localStorage 存储
   */
  static set(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    console.log("保存到localStorage")
    localStorage.setItem(key, value);
  }

  static get(key) {
    const data = localStorage.getItem(key);
    try {
      return JSON.parse(data);
    } catch {
      // 如果解析失败，返回原始字符串
      return data;
    }
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  /**
   * sessionStorage 存储
   */
  static sessionSet(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  static sessionGet(key, defaultValue) {
    const value = sessionStorage.getItem(key);
    if (!value) return defaultValue;

    try {
      return JSON.parse(value);
    } catch {
      // 如果解析失败，返回原始字符串
      return value;
    }
  }

  static sessionRemove(key) {
    sessionStorage.removeItem(key);
  }
}