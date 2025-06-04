type StorageType = 'session' | 'local';

class Cache {
    private storage: Storage;

    constructor(type: StorageType) {
        this.storage = type === 'local' ? localStorage : sessionStorage;
    }

    set(key: string, value: any, ttl: number = 0) {
        const data = {
            value,
            expiry: ttl ? Date.now() + ttl : null
        };
        this.storage.setItem(key, JSON.stringify(data));
    }

    get(key: string) {
        const itemStr = this.storage.getItem(key);
        if (!itemStr) {
            return null;
        }

        const item = JSON.parse(itemStr);
        if (item.expiry && Date.now() > item.expiry) {
            this.storage.removeItem(key);

            return null;
        }

        return item.value;
    }

    remove(key: string) {
        this.storage.removeItem(key);
    }

    clear() {
        this.storage.clear();
    }
}

export const sessionCache = new Cache('session');
export const localCache = new Cache('local');
