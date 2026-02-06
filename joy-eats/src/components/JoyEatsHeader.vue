<template>
    <div class="header-container">
        <div class="left">
            <div class="nav" @click="toggleCollapse">
                <el-icon><Fold /></el-icon>
            </div>
            <div class="status" :class="statusClasses">
                {{ statusText }}
            </div>
        </div>
        <div class="right">
            <div class="bus-status-box" @click="setBusStatus">
                <div class="icon">
                    <el-icon><CircleCheckFilled /></el-icon>
                </div>
                <div class="bus-label">营业状态设置</div>
            </div>
            <el-dialog
                v-model="dialogVisible"
                title="营业状态设置"
                width="450px"
                :close-on-click-modal="false"
                class="business-status-dialog"
            >
                <!-- 单选按钮组 -->
                <el-radio-group 
                    v-model="businessStatus" 
                    class="status-radio-group"
                    @change="radioChange"
                >
                <!-- 营业中选项 -->
                <el-radio 
                    value="open" 
                    class="status-radio-item"
                    :class="{ 'active-item': businessStatus === 'open' }"
                >
                <div class="radio-content">
                    <div class="radio-title">营业中</div>
                    <div class="radio-desc">
                        当前餐厅处于营业状态，自动接收任何订单，可点击打烊进入店铺打烊状态。
                    </div>
                    </div>
                </el-radio>

                <!-- 打烊中选项 -->
                <el-radio 
                    value="closed" 
                    class="status-radio-item"
                    :class="{ 'active-item': businessStatus === 'closed' }"
                >
                <div class="radio-content">
                    <div class="radio-title">打烊中</div>
                    <div class="radio-desc">
                        当前餐厅处于打烊状态，仅接受营业时间内的预定订单，可点击营业中手动恢复营业状态。
                    </div>
                    </div>
                </el-radio>
                </el-radio-group>
                <!-- 弹窗底部按钮区 -->
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="handleCancel" class="cancel-btn">取消</el-button>
                        <el-button type="primary" @click="handleConfirm" class="confirm-btn">确定</el-button>
                    </div>
                </template>
            </el-dialog>
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
import { SetShopStatus, GetShopStatus } from '@/api/shop';
import { useSidebarStore } from '@/stores/sidebar'; 
import { ElMessage } from 'element-plus';
import { ref, onMounted, computed } from 'vue';
const sidebarStore = useSidebarStore();
const toggleCollapse = () => {
    sidebarStore.toggleCollapse();
    sidebarStore.toggleTitleShow();
}
const options = ref([]);

const dialogVisible = ref(false);
const setBusStatus = () => {
    dialogVisible.value = true;
}

// 营业状态（默认营业中）
const businessStatus = ref('open');

const handleCancel = () => {
    dialogVisible.value = false;
}

const handleConfirm = async () => {
    if (businessStatus.value === 'open') {
        const { code, message } = await SetShopStatus(1);
        if (code === 1) {
            ElMessage.success('修改店铺状态为：营业中');
            isOpen.value = true;
        } else {
            ElMessage.error('修改店铺失败');
        }
    } else if(businessStatus.value === 'closed') {
        const { code, message } = await SetShopStatus(0);
        if (code === 1) {
            ElMessage.success('修改店铺状态为：打烊中');
            isOpen.value = false;
        } else {
            ElMessage.error('修改店铺失败');
        }
    }
    dialogVisible.value = false;
}

const isOpen = ref(true);
const statusText = computed(() => isOpen.value ? '营业中' : '打烊中');
const statusClasses = computed(() => ({
    'status': true,
    'open': isOpen.value,
    'closed': !isOpen.value
}))

const fetchData = async () => {
    // 获取店铺状态
    const { code, message, data } = await GetShopStatus();
    if (code !== 1) {
        ElMessage.warning(`获取店铺状态失败：${message}`);
        isOpen.value = false;
        return;
    }
    if (data === 1) {
        // 店铺营业中
        businessStatus.value = 'open';
        isOpen.value = true;
    } else if (data === 0) {
        // 店铺打烊中
        businessStatus.value = 'closed';
        isOpen.value = false;
    }
}

onMounted(() => {
    fetchData();
})
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
            display: inline-block;
            padding: 2px 8px; /* 内边距，控制标签大小 */
            border-radius: 4px; /* 圆角，贴合截图效果 */
            font-size: 12px; /* 文字大小 */
            font-weight: 500; /* 文字加粗 */
            line-height: 1.4; /* 行高，保证文字垂直居中 */
            color: #E53E3E; /* 文字色：红色系，贴合截图 */
            background-color: #FEE; /* 背景色：浅粉色，贴合截图 */
            border: 1px solid #FCC; /* 浅红边框，增强质感 */
            margin-left: 10px;
            position: relative;
        }

        /* 营业中样式 */
        .status.open {
            background-color: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #81c784;
        }

        /* 打烊中样式 */
        .status.closed {
            background-color: #ffebee;
            color: #c62828;
            border: 1px solid #ef9a9a;
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
            width: 130px;
            height: 60px;
            align-items: center;
            justify-content: center;
            .icon {
                margin-top: 3px;
                margin-right: 5px;
                color: white;
            }
            .bus-label {
                color: white;
            }
        }
        .bus-status-box:hover {
            background-color: #409eff;
            cursor: pointer;
        }
    }
}

.business-status-container {
  width: 300px; /* 可根据页面调整宽度 */
  padding: 10px;
}

/* 单选组样式：取消默认换行，改为块级排列 */
.status-radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px; /* 两个选项之间的间距 */
}

/* 单个单选项样式 */
.status-radio-item {
  display: block;
  width: 100%;
  height: 100px !important;
  padding: 10px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  /* 取消Element默认的radio样式占位 */
  --el-radio-size: 16px;
  margin: 0px;
}

/* 营业中选中样式 */
.open-item {
  border: 1px solid #f5a623; /* 黄色边框 */
  background-color: #fffbf0; /* 浅黄背景 */
}
/* 打烊中未选中样式 */
.closed-item {
  border: 1px solid #e5e6eb; /* 灰色边框 */
  background-color: #f7f8fa; /* 浅灰背景 */
}

/* 选中状态的圆点颜色 */
.status-radio-item :deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #f5a623;
  border-color: #f5a623;
}
/* 鼠标悬浮时的圆点颜色 */
.status-radio-item :deep(.el-radio__input:hover .el-radio__inner) {
  border-color: #f5a623;
}

/* 文本样式 */
.radio-content {
  margin-left: 8px; /* 文本与单选圆点的间距 */
}
.radio-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
.radio-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  // 换行   
  white-space: normal;
}
</style>