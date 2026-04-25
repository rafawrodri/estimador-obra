/**
 * storage.js — Adaptador localStorage
 * Substitui o window.storage do Claude.ai por localStorage padrão do browser.
 * Mesma API: get(key), set(key, value), delete(key), list(prefix)
 */

const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) throw new Error('Key not found');
      return { key, value };
    } catch (e) {
      throw e;
    }
  },

  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (e) {
      throw e;
    }
  },

  async delete(key) {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch (e) {
      throw e;
    }
  },

  async list(prefix = '') {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keys.push(k);
      }
      return { keys, prefix };
    } catch (e) {
      throw e;
    }
  },
};

export default storage;
