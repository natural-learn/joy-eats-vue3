<template>
    <div class="common-layout">
      <el-container>
        <el-aside width="200px" :style="asideStyle" >
            <JoyEatsAside />
          </el-aside>
        <el-container>
          <el-header>
            <JoyEatsHeader @toggle-title-visible="isTitleShow = !isTitleShow"/>
          </el-header>  
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
import { computed, ref, watch } from 'vue'

const sidebarStore = useSidebarStore();
const { collapse } = storeToRefs(sidebarStore);
const asideStyle = computed(() => {
  const width = collapse.value ? '60px' : '200px'
  return {
    width: width,
    transition: 'width 0.3s',
  }
})
const isTitleShow = ref(true);

</script>

<style scoped lang="scss">
.common-layout {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.el-container {
    height: 100%;
    .el-aside {
      transition: width 0.3s ease;
      overflow: hidden;
    }
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