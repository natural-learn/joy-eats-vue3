import { Storage } from "@/utils/storage";
import { defineStore } from "pinia";

export const TOKEN = "JOY-TOKEN";

export const useApp = defineStore('app', {
    state: () => ({
        title: '悦享外卖',
        authorization: Storage.get(TOKEN),
        device: 'desktop',
    }),
    actions: {
        setToken(data) {
            this.authorization = data;
            // 保存到localStorage
            Storage.set(TOKEN, data);
        },
        clearToken() {
            // 清除token
            this.authorization = '';
            Storage.remove(TOKEN);
            //...
        },
        initToken(token) {
            this.clearToken();
            this.setToken(token);
        }
    }
})
