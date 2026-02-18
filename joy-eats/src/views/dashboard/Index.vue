<template>
  <div class="dashboard-container">
    <!-- 今日数据模块 -->
    <el-card class="dashboard-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">今日数据 2026.02.18</span>
          <el-link class="more-link">详细数据></el-link>
        </div>
      </template>
      <!-- 核心：恢复5列均分的栅格布局 + 独立数据卡片 -->
      <el-row :gutter="12" class="data-row">
        <!-- 营业额 -->
        <el-col :span="4.8" class="data-col">
          <div class="data-card">
            <div class="data-label">营业额</div>
            <div class="data-value">¥</div>
          </div>
        </el-col>
        <!-- 有效订单 -->
        <el-col :span="4.8" class="data-col">
          <div class="data-card">
            <div class="data-label">有效订单</div>
            <div class="data-value"></div>
          </div>
        </el-col>
        <!-- 订单完成率 -->
        <el-col :span="4.8" class="data-col">
          <div class="data-card">
            <div class="data-label">订单完成率</div>
            <div class="data-value rate-value">NaN%</div>
          </div>
        </el-col>
        <!-- 平均客单价 -->
        <el-col :span="4.8" class="data-col">
          <div class="data-card">
            <div class="data-label">平均客单价</div>
            <div class="data-value">¥</div>
          </div>
        </el-col>
        <!-- 新增用户 -->
        <el-col :span="4.8" class="data-col">
          <div class="data-card">
            <div class="data-label">新增用户</div>
            <div class="data-value"></div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 订单管理模块 -->
    <el-card class="dashboard-card" style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span class="card-title">订单管理 2026.02.18</span>
          <el-link class="more-link">订单明细></el-link>
        </div>
      </template>
      <el-row :gutter="12" class="data-row">
        <!-- 待接单 -->
        <el-col :span="4.8" class="data-col">
          <div class="data-card">
            <el-icon class="data-icon"><Timer /></el-icon>
            <div class="data-label">待接单</div>
            <div class="data-value"></div>
          </div>
        </el-col>
        <!-- 待派送 -->
        <el-col :span="4.8" class="data-col">
          <div class="data-card">
            <el-icon class="data-icon"><Bicycle /></el-icon>
            <div class="data-label">待派送</div>
            <div class="data-value"></div>
          </div>
        </el-col>
        <!-- 已完成 -->
        <el-col :span="4.8" class="data-col">
          <div class="data-card">
            <el-icon class="data-icon"><CircleCheck /></el-icon>
            <div class="data-label">已完成</div>
            <div class="data-value"></div>
          </div>
        </el-col>
        <!-- 已取消 -->
        <el-col :span="4.8" class="data-col">
          <div class="data-card">
            <el-icon class="data-icon"><CircleClose /></el-icon>
            <div class="data-label">已取消</div>
            <div class="data-value"></div>
          </div>
        </el-col>
        <!-- 全部订单 -->
        <el-col :span="4.8" class="data-col">
          <div class="data-card">
            <el-icon class="data-icon"><List /></el-icon>
            <div class="data-label">全部订单</div>
            <div class="data-value"></div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 菜品总览 + 套餐总览（2列均分） -->
    <el-row :gutter="16" style="margin-top: 16px;">
      <!-- 菜品总览 -->
      <el-col :span="12">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">菜品总览</span>
              <el-link class="more-link">菜品管理></el-link>
            </div>
          </template>
          <el-row :gutter="12" class="goods-row">
            <el-col :span="8" class="goods-col">
              <div class="goods-card">
                <el-icon class="goods-icon"><Shop /></el-icon>
                <div class="goods-label">已启售</div>
                <div class="goods-value"></div>
              </div>
            </el-col>
            <el-col :span="8" class="goods-col">
              <div class="goods-card">
                <el-icon class="goods-icon"><Lock /></el-icon>
                <div class="goods-label">已停售</div>
                <div class="goods-value"></div>
              </div>
            </el-col>
            <el-col :span="8" class="goods-col">
              <el-button class="add-btn" type="primary" round>
                <el-icon><Plus /></el-icon>
                新增菜品
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 套餐总览 -->
      <el-col :span="12">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">套餐总览</span>
              <el-link class="more-link">套餐管理></el-link>
            </div>
          </template>
          <el-row :gutter="12" class="goods-row">
            <el-col :span="8" class="goods-col">
              <div class="goods-card">
                <el-icon class="goods-icon"><Shop /></el-icon>
                <div class="goods-label">已启售</div>
                <div class="goods-value"></div>
              </div>
            </el-col>
            <el-col :span="8" class="goods-col">
              <div class="goods-card">
                <el-icon class="goods-icon"><Lock /></el-icon>
                <div class="goods-label">已停售</div>
                <div class="goods-value"></div>
              </div>
            </el-col>
            <el-col :span="8" class="goods-col">
              <el-button class="add-btn" type="primary" round>
                <el-icon><Plus /></el-icon>
                新增套餐
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单信息 -->
    <el-card class="dashboard-card" style="margin-top: 16px;">
      <template #header>
        <span class="card-title">订单信息</span>
      </template>
      <el-tabs v-model="activeTab" class="order-tabs">
        <el-tab-pane label="待接单" name="toAccept"></el-tab-pane>
        <el-tab-pane label="待派送" name="toDeliver"></el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Timer, Bicycle, CircleCheck, CircleClose, List, 
  Shop, Lock, Plus 
} from '@element-plus/icons-vue'

// 订单信息标签页激活态
const activeTab = ref('toAccept')
</script>

<style lang="scss" scoped>
// -------------------- 蓝白主题变量 + 布局控制变量 --------------------
$link-color: #1E88E5;         // 浅蓝色链接
$btn-blue: #1E88E5;           // 按钮蓝色
$btn-blue-hover: #1976D2;     // 按钮hover色
$bg-page: #F5F7FA;            // 页面浅灰背景
$bg-data-card: #FFF9E8;       // 数据卡片浅米色
$bg-card-wrap: #FFFFFF;       // 外层卡片白色背景
$text-main: #333;             // 主要文字色
$text-secondary: #666;        // 次要文字色
$text-placeholder: #999;      // 占位文字/图标色
$border-color: #E5E9F2;       // 卡片边框色
$gap-sm: 4px;                 // 小间距
$gap-md: 8px;                 // 中间距
$gap-lg: 12px;                // 大间距
$gap-xl: 16px;                // 超大间距
$data-card-height: 100px;     // 数据卡片固定高度
$border-radius: 6px;          // 圆角（匹配参考图）

// -------------------- 全局容器 --------------------
.dashboard-container {
  background-color: $bg-page;
  min-height: 100vh;

  // 外层卡片通用样式
  .dashboard-card {
    background-color: $bg-card-wrap;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    box-shadow: none;
    overflow: hidden;

    // 卡片头部：标题+链接 对齐
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $gap-lg $gap-xl !important; // 还原卡片头部内边距
      border-bottom: 1px solid $border-color;

      .card-title {
        font-size: 14px;
        color: $text-main;
        font-weight: 500;
      }

      .more-link {
        font-size: 12px;
        color: $link-color !important;
        text-decoration: none;
      }
    }

    // -------------------- 今日数据/订单管理 布局修复 --------------------
    .data-row {
      padding: $gap-xl; // 卡片内边距，避免元素贴边
      margin: 0 !important;

      .data-col {
        // 强制列宽均分，避免自适应混乱
        flex: 0 0 calc(20% - #{$gap-lg}); 
        max-width: calc(20% - #{$gap-lg});

        .data-card {
          background-color: $bg-data-card;
          border-radius: $border-radius;
          height: $data-card-height;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start; // 文字左对齐（匹配参考图）
          padding: 0 $gap-lg;
          box-sizing: border-box;

          .data-icon {
            font-size: 14px;
            color: $text-placeholder;
            margin-bottom: $gap-sm;
          }

          .data-label {
            font-size: 12px;
            color: $text-secondary;
            margin-bottom: $gap-md;
          }

          .data-value {
            font-size: 16px;
            color: $text-main;
            font-weight: 600;

            &.rate-value {
              font-size: 18px;
              font-weight: 700;
            }
          }
        }
      }
    }

    // -------------------- 菜品/套餐总览 布局修复 --------------------
    .goods-row {
      padding: $gap-xl;
      margin: 0 !important;

      .goods-col {
        flex: 0 0 calc(33.33% - #{$gap-lg});
        max-width: calc(33.33% - #{$gap-lg});

        .goods-card {
          background-color: $bg-data-card;
          border-radius: $border-radius;
          height: $data-card-height;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center; // 文字/图标居中
          padding: 0 $gap-lg;
          box-sizing: border-box;

          .goods-icon {
            font-size: 16px;
            color: $text-placeholder;
            margin-bottom: $gap-sm;
          }

          .goods-label {
            font-size: 12px;
            color: $text-secondary;
            margin-bottom: $gap-md;
          }

          .goods-value {
            font-size: 16px;
            color: $text-main;
            font-weight: 600;
          }
        }

        .add-btn {
          background-color: $btn-blue;
          border: none;
          height: $data-card-height;
          width: 100%;
          font-size: 14px;
          font-weight: 500;
          border-radius: $border-radius;

          &:hover {
            background-color: $btn-blue-hover;
          }
        }
      }
    }

    // -------------------- 订单信息标签页 布局修复 --------------------
    .order-tabs {
      padding: $gap-lg $gap-xl;

      :deep {
        .el-tabs__nav-wrap {
          justify-content: flex-start; // 标签页左对齐（匹配参考图）
          margin-bottom: $gap-lg;
        }

        .el-tabs__item {
          padding: $gap-md $gap-xl;
          margin-right: $gap-md;
          font-size: 12px;

          &.is-active {
            background-color: $btn-blue;
            color: #fff;
            border-radius: $border-radius;
          }
        }
      }
    }
  }
}
</style>