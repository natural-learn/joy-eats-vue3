import { defineStore } from "pinia";

export const useSidebarStore = defineStore('sidebar', {
    // 状态：存储折叠状态（默认不折叠）
    state: () => ({
        collapse: false,
        isTitleShow: true
    }),
    actions: {
        // 切换折叠状态
        toggleCollapse() {
            this.collapse = !this.collapse;
        },
        // 手动设置折叠状态（可选，扩展用）
        setCollapse(value) {
            this.collapse = value;
        },
        toggleTitleShow() {
            this.isTitleShow = !this.isTitleShow;
        }
    }
})