<template>
    <div class="report-root">
        <div class="top">
            <div class="left">
                <el-button
                    v-for="btn in orderBtnList"
                    :key="btn.key"
                    :class="{ 'active-btn': activeBtn === btn.key }"
                    @click="handleBtnClick(btn.key)"
                    plain
                    size="default"
                >
                {{ btn.name }}
            </el-button>
            </div>
        </div>
        <div class="statistics-container">
            <!-- 栅格布局：2行2列，列间距20px，行间距20px -->
            <el-row :gutter="20">
            <!-- 第一行第一列：营业额统计 -->
            <el-col :span="12" class="statistics-col">
                <el-card class="statistics-card">
                <template #header>
                    <span class="card-title">营业额统计</span>
                </template>
                <div class="card-content">
                    <!-- 这里放营业额图表/数值，示例占位 -->
                    <div class="content-placeholder">
                    <span class="unit">营业额(元)</span>
                    </div>
                </div>
                </el-card>
            </el-col>

            <!-- 第一行第二列：用户统计 -->
            <el-col :span="12" class="statistics-col">
                <el-card class="statistics-card">
                <template #header>
                    <span class="card-title">用户统计</span>
                </template>
                <div class="card-content">
                    <!-- 这里放用户统计图表，示例占位 -->
                    <div class="content-placeholder">
                    <span class="legend">
                        <span style="color: #F5A623;">●</span> 用户总量（个）
                        <span style="color: #F56C6C; margin-left: 10px;">●</span> 新增用户（个）
                    </span>
                    </div>
                </div>
                </el-card>
            </el-col>

            <!-- 第二行第一列：订单统计 -->
            <el-col :span="12" class="statistics-col">
                <el-card class="statistics-card">
                <template #header>
                    <span class="card-title">订单统计</span>
                </template>
                <div class="card-content">
                    <!-- 订单完成率展示，处理NaN的情况 -->
                    <div class="order-rate">
                    <span>订单完成率 = </span>
                    <span class="order-label">有效订单 / 订单总数</span>
                    <div class="rate-value">{{ orderCompletionRate || '0' }}%</div>
                    </div>
                </div>
                </el-card>
            </el-col>

            <!-- 第二行第二列：销量排名TOP10 -->
            <el-col :span="12" class="statistics-col">
                <el-card class="statistics-card">
                <template #header>
                    <span class="card-title">销量排名TOP10</span>
                </template>
                <div class="card-content">
                    <!-- 销量排名列表/图表占位 -->
                    <div class="content-placeholder"></div>
                </div>
                </el-card>
            </el-col>
            </el-row>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const orderBtnList = [
  { key: 'yesterday', name: '昨天' },
  { key: 'seven', name: '近7天' },
  { key: 'thirty', name: '近30天' },
  { key: 'week', name: '本周' },
  { key: 'month', name: '本月' },
];

const orderCompletionRate = ref('NaN') // 示例NaN，实际可判断：有效订单/订单总数，避免除以0
</script>

<style scoped lang="scss">
.statistics-container {
  padding: 20px;
}

/* 列的底部间距（行间距） */
.statistics-col {
  margin-bottom: 20px;
}

/* 统计卡片样式，固定最小高度保证布局整齐 */
.statistics-card {
  min-height: 300px; /* 可根据需求调整高度 */
  box-sizing: border-box;
}

/* 卡片标题样式 */
.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 卡片内容区域，flex布局居中（可根据实际内容调整） */
.card-content {
  width: 100%;
  height: calc(100% - 40px); /* 减去header高度，适配卡片高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

/* 占位区域样式（替换成图表/数据后可删除） */
.content-placeholder {
  color: #999;
  font-size: 14px;
}

/* 订单完成率区域样式 */
.order-rate {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.order-label {
  margin: 0 8px;
  color: #999;
}

.rate-value {
  font-size: 20px;
  color: #F56C6C;
  margin-top: 10px;
}

/* 图例样式 */
.legend {
  font-size: 14px;
  color: #999;
}
</style>