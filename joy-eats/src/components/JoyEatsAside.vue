<template>
    <div class="aside-container">
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
import { ref, watch, computed } from 'vue';

const menuRef = ref(null);


const menuList = [
    { path: '', label: '工作台', icon: 'HomeFilled' },
    { path: '', label: '数据统计', icon: 'PieChart' },
    { path: '', label: '订单管理', icon: 'Document' },
    { path: '', label: '套餐管理', icon: 'Present' },
    { path: '', label: '菜品管理', icon: 'DishDot' },
    { path: '', label: '分类管理', icon: 'Menu' },
    { path: '/employee', label: '员工管理', icon: 'UserFilled' },
]
</script>

<style scoped>
.aside-container {
    width: 100%;
    height: 100vh;
    background-color: #ffffff;
    overflow: hidden;
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