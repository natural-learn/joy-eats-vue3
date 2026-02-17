<template>
    <div class="aside-container">
        <div class="header">
            <div class="logo">
                <img width="40" height="40" src="/favicon.ico" alt="">
                <span v-show="isTitleShow">悦享外卖</span>
            </div>
        </div>
        <el-menu
            ref="menuRef"
            default-active="2"
            class="el-menu-vertical-demo"
            :router="true"
            background-color="#ffffff"
            text-color="#000000"
            :collapse-transition="true"
        >
        <el-menu-item 
            v-for="item in menuList"
            :key="item.path"
            :index="item.path">
            <el-icon>
                <component :is="item.icon"/>
            </el-icon>
            <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useSidebarStore } from '@/stores/sidebar';
import { storeToRefs } from 'pinia';

const menuRef = ref(null);
const menuList = [
    { path: '', label: '工作台', icon: 'HomeFilled' },
    { path: '', label: '数据统计', icon: 'PieChart' },
    { path: '', label: '订单管理', icon: 'Document' },
    { path: '/setmeal', label: '套餐管理', icon: 'Present' },
    { path: '/dish', label: '菜品管理', icon: 'DishDot' },
    { path: '/category', label: '分类管理', icon: 'Menu' },
    { path: '/employee', label: '员工管理', icon: 'UserFilled' },
]

const sidebarStore = useSidebarStore();
const { isTitleShow } = storeToRefs(sidebarStore);


</script>

<style scoped lang="scss">
.aside-container {
    width: 100%;
    height: 100vh;
    background-color: #ffffff;
    overflow: hidden;
    .header {
        height: 60px;
        background-color: #3F83FD;
        display: flex;
        justify-content: center;
        align-items: center;
        .logo {
            width: 200px;
            padding: 10px;
            display: flex;
            align-items: center;
            span {
                color: white;
                font-size: 20px;
                font-weight: bold;
                line-height: 60px;
                margin-left: 10px;
            }
        }
    }
}

.el-menu {
    width: 100%;
    border: 0;
    height: 100%;
}

.el-menu-item {
    height: 42px;
    line-height: 38px;
    border-radius: 8px;
    margin: 10px;
    font-size: 15px;
}

.el-menu-item:hover{
    background-color: #F0F2F5;
}

.el-menu-item.is-active {
    background-color: #E3E3E3 !important;
    color: black !important;
}
</style>