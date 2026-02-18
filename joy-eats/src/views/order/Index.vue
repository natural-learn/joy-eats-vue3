<template>
    <div class="order-root">
        <div class="order-btn-group">
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
    
        <el-card style="height: 480px">
            <div class="top">
                <div class="order-number">
                    <span>订单号：</span>
                    <el-input placeholder="请填写订单号"/>
                </div>
                <div class="phone-number">
                    <span>手机号：</span>
                    <el-input placeholder="请填写手机号"/>
                </div>
                <div class="order-time">
                    <span>下单时间：</span>
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="YYYY年MM月DD日"
                        value-format="YYYY-MM-DD"
                        class="date-picker"
                        clearable="false"
                        />
                </div>
                <el-button class="find-btn" @click="find">查询</el-button>
            </div>
            <div class="main">
                <el-table v-if="orderList.length === 0" :data="tableData" style="width: 100%">
                    <el-table-column prop="date" label="Date" width="180" />
                    <el-table-column prop="name" label="Name" width="180" />
                    <el-table-column prop="address" label="Address" />
                </el-table>
                <div v-else class="empty-state">
                    <el-empty :image="emptyImage" :image-size="200" description="暂无数据"/>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const orderList = ref([]);
const emptyImage = '/src/assets/images/empty.png';

const dateRange = ref([]);

const activeBtn = ref('all'); // 默认选中“全部订单”

// 订单状态按钮配置列表
const orderBtnList = [
  { key: 'all', name: '全部订单' },
  { key: 'waitAccept', name: '待接单' },
  { key: 'waitDispatch', name: '待派送' },
  { key: 'dispatching', name: '派送中' },
  { key: 'completed', name: '已完成' },
  { key: 'cancelled', name: '已取消' }
];

const handleBtnClick = (key) => {
    activeBtn.value = key;

}

const find = () => {
    if (dateRange.value.length === 2) {
        const [startDate, endDate] = dateRange.value;
        
    }
}

</script>

<style scoped lang="scss">
.order-root {
    .order-btn-group {
        margin: 16px 0;
        display: flex;
        gap: 8px; /* 按钮之间的间距 */
        .active-btn:active {
            background-color: #409eff !important; /* 选中后的背景色，可自定义 */
            color: #ffffff !important; /* 选中后的文字色 */
            border-color: #409eff !important; /* 选中后的边框色 */
        }
        .el-button {
            margin: 0;
            border-radius: 0;
        }
    }
    .el-card {
        .top {
            display: flex;
            margin-bottom: 20px;
            .order-number,.phone-number,.order-time {
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    white-space: nowrap;
                }
            }
            .phone-number,.order-time {
                margin-left: 20px;
            }
            .find-btn {
                width: 60px;
                margin-left: 20px;
                background-color: #3F83FD;
                color: white;
            }
        }
    }
}
</style>