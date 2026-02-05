<template>
    <div class="header-container">
        <div class="left">
            <div class="nav" @click="toggleCollapse">
                <el-icon><Fold /></el-icon>
            </div>
            <div class="status">
                营业中
            </div>
        </div>
        <div class="right">
            <div class="bus-status-box">
                <div class="icon">
                    <el-icon><CircleCheckFilled /></el-icon>
                </div>
                <div class="bus-label">营业状态设置</div>
            </div>
            <el-select 
                ref="selectRef"
                placeholder="请选择"
                :teleported="false"
                @mouseleave="selectRef.toggleMenu(false)">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
            </el-select>
        </div>
    </div>
</template>

<script setup>
import { useSidebarStore } from '@/stores/sidebar'; 
import { ref } from 'vue';
const sidebarStore = useSidebarStore();
const toggleCollapse = () => {
    sidebarStore.toggleCollapse();
    sidebarStore.toggleTitleShow();
}
const options = ref([]);
</script>

<style scoped lang="scss">
.header-container {
    width: 100%;
    height: 60px;
    background-color: #3F83FD;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
        display: flex;
        align-items: center;
        .status {
            margin-left: 15px;
            padding: 0 3px 0 3px;
            color: white;
            background-color: #FD3333;
            border-radius: 3px;
        }
        .nav {
            cursor: pointer;
            margin-top: 5px;
            .el-icon {
                color: white;
                font-size: 20px;
                margin-left: 10px;
            }
        }
    }
    .right {
        display: flex;
        align-items: center;

        .el-select {
            width: 120px;
            margin-right: 20px;
        }

        .bus-status-box {
            display: flex;
            margin-right: 20px;
            .icon {
                margin-top: 3px;
                margin-right: 5px;
                color: white;
            }
            .bus-label {
                color: white;
            }
        }
    }
}
</style>