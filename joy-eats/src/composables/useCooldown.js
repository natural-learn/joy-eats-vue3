import { ref } from "vue";
import { ElMessage } from "element-plus";

/**
 * 冷却查询组合函数
 * @param {Function} queryFn 实际执行查询的异步函数
 * @param {number} cooldown 冷却时长（毫秒），默认 5000
 * @param {Object} options 可选配置
 * @param {Function} options.message 自定义消息内容，接收剩余秒数，返回消息字符串
 * @param {boolean} options.resetOnError 查询失败时是否重置冷却，默认 true
 * @returns {Function} 包装后的查询函数
 */
export function useCooldown(queryFn, cooldownTime = 5000, options = {}) {
    const {
        message = (seconds) => `请等待 ${seconds} 秒后再查询`,
        resetOnError = true
    } = options;

    const lastQueryTime = ref(0);
    const execute = async (...args) => {
        const now = Date.now();
        const timeDiff = now - lastQueryTime.value;
        if (timeDiff < cooldownTime) {
            const remainingSeconds = ((cooldownTime - timeDiff) / 1000).toFixed(1);
            ElMessage({
                type: 'warning',
                message: message(remainingSeconds),
                duration: cooldownTime - timeDiff
            })
            return;
        }
        try {
            lastQueryTime.value = now;
            await queryFn(...args);
        } catch (error) {
            if (resetOnError) {
                lastQueryTime.value = 0;    //异常时重复冷却
            }
            ElMessage.error('查询失败，请稍后再试');
            throw error;
        }
    }
    return execute;
}