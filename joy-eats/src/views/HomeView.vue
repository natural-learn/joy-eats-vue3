<template>
    <div class="common-layout">
      <el-container>
        <el-header>
          <JoyEatsHeader />
        </el-header>
        <el-container>
          <el-aside width="200px" :style="asideStyle">
            <JoyEatsAside />
          </el-aside>
          <el-main>
            <router-view />
          </el-main>
        </el-container>
      </el-container>
  </div>
</template>

<script setup>
import JoyEatsHeader from '@/components/JoyEatsHeader.vue'
import JoyEatsAside from '@/components/JoyEatsAside.vue'
import { useSidebarStore } from '@/stores/sidebar'
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue'

const sidebarStore = useSidebarStore();
const { collapse } = storeToRefs(sidebarStore);
const asideStyle = computed(() => {
  const width = collapse.value ? '64px' : '200px'
  return {
    width: width,
    transition: 'width 0.3s',
  }
})
watch(collapse,(newValue,oldValue) => {
    console.log(`collapse从${oldValue}变成了${newValue}`);
    // if (menuRef.value) {
    //     console.log(menuRef.value.$el);
    //     const menuElement = menuRef.value.$el;
    //     menuElement.style.width = '60px'
    // }
})
</script>

<style scoped>
.common-layout {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.el-container {
    height: 100%;
}

.el-header {
  margin: 0;
  padding: 0;
}

.el-main {
    height: 100%;
    background-color: #f0f2f5;
    padding: 20px;
    padding-bottom: 110px;
}
</style>