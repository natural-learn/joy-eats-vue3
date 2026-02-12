<template>
    <div class="dish-root">
        <div class="container">
            <div class="header">
                <div class="left">
                    <span style="white-space: nowrap;">菜品名称：</span>
                    <el-input 
                        v-model="pageParams.name"
                        placeholder="请输入菜品名称" 
                    />
                    <span>菜品分类：</span>
                    <el-select v-model="pageParams.categoryId" placeholder="请选择菜品分类" style="width: 150px">
                        <el-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            />
                    </el-select>
                    <div class="sell-status">
                        <span>售卖状态：</span>
                        <el-select v-model="pageParams.status" placeholder="请选择售卖状态" style="width: 150px">
                            <el-option
                                v-for="item in sellStatus"
                                :key="item.id"
                                :label="item.status"
                                :value="item.id"
                                />
                        </el-select>
                    </div>
                    <el-button type="primary" @click="find">查询</el-button>
                </div>
                <div class="right">
                    <span>批量删除菜品</span>
                    <el-button class="dish-btn" type="primary" @click="addDish">+ 新增菜品</el-button>
                </div>
            </div>
            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
                <el-form 
                    :model="dish"
                    ref="formRef"
                    label-width="100px">
                    <el-form-item label="分类名称：" prop="name">
                        <el-input v-model="dish.name" style="width: 240px;" placeholder="请输入菜品名称" />
                    </el-form-item>
                    <el-form-item label="菜品价格：" prop="name">
                        <el-input v-model="dish.price" style="width: 240px;" placeholder="请输入菜品名称" />
                    </el-form-item>
                    <el-form-item label="菜品分类：">
                        <el-select v-model="pageParams.categoryId" placeholder="请选择菜品分类" style="width: 150px">
                        <el-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="口味配置：">
                        <div class="flavor-row" v-for="(row, rowIndex) in flavorRows" :key="rowIndex">
                        <div class="flavor-name-col">
                            <!-- 口味名改为下拉选择框 -->
                            <el-select
                                v-model="row.flavorName"
                                placeholder="请选择口味"
                                size="small"
                                style="width: 80px;"
                                @change="handleFlavorNameChange(rowIndex)"
                            >
                            <el-option
                                v-for="option in flavorNameOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            />
                            </el-select>
                        </div>
                        <div class="flavor-items-col">
                            <!-- 具体口味项标签（仅展示+删除，无输入） -->
                            <el-tag
                                v-for="(item, itemIndex) in row.flavorItems"
                                :key="itemIndex"
                                closable
                                @close="removeFlavorItem(rowIndex, itemIndex)"
                                size="small"
                                type="warning"
                            >
                            {{ item }}
                            </el-tag>
                        </div>
                        <div class="flavor-opt-col">
                            <!-- 行删除按钮 -->
                            <el-button
                                size="small"
                                type="text"
                                text-color="#f56c6c"
                                @click="removeFlavorRow(rowIndex)"
                            >
                            删除
                            </el-button>
                        </div>
                        </div>

                        <!-- 添加口味行按钮（最多4行） -->
                        <el-button
                            type="warning"
                            @click="addFlavorRow"
                            :disabled="flavorRows.length >= 4"
                            style="margin-top: 10px;"
                        >
                        添加口味
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit">提交</el-button>
                        <el-button @click="dialogVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <div class="main">
                <el-table 
                    :data="dishList"
                    style="width: 100%;"
                    >
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="name" label="菜品名称" width="120" />
                    <el-table-column prop="image" label="菜品图片" width="150" #default="scope">
                        <el-image style="width: 40px;height: 40px;" :src="scope.row.image"/>
                    </el-table-column>
                    <el-table-column prop="categoryName" label="菜品分类" width="150"/>
                    <el-table-column prop="price" label="售价" width="100" />
                    <el-table-column label="售卖状态" width="150">
                        <template #default="scope">
                            <div class="status-dot">
                                <span class="dot" :class="scope.row.status === 1 ? 'active' : 'inactive'"></span>
                                {{ scope.row.status === 1 ? "启用": "禁用" }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后操作时间" width="180" />
                    <el-table-column label="操作" align="center" width="280" #default="scope">
                        <el-button type="primary" size="small">
                            修改
                        </el-button>
                        <el-button type="danger" size="small">
                            删除
                        </el-button>
                        <el-button type="warning" size="small">
                            {{ scope.row.status === 1 ? "停售" : "启售" }}
                        </el-button>
                    </el-table-column>
                </el-table>
            </div>

            <div class="footer">
                    <el-pagination
                        v-model:current-page="pageParams.page"
                        v-model:page-size="pageParams.pageSize"
                        :page-sizes="[5, 10, 20, 50, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
            </div>
        </div>
    </div>    
</template>

<script setup>
import { GetDishPageList } from '@/api/dish';
import { GetList } from '@/api/category';
import { ElMessage } from 'element-plus';
import { ref, computed ,onMounted } from 'vue';

const dialogVisible = ref(false);
const dialogTitle = ref('新增菜品');
const dish = ref({
    name: '',
    price: 0.0,

})
const dishList = ref([]);
const categoryList = ref([])
const sellStatus = ref([
    { id: 0, status: '停售' },
    { id: 1, status: '启售' }
])
const pageParams = ref({
    page: 1,
    pageSize: 5,
    name: '',
})
const total = ref(0);

const handleCurrentChange = (newPage) => {
    pageParams.value.page = newPage;
    fetchData();
}

const handleSizeChange = (newSize) => {
    pageParams.value.pageSize = newSize;
    fetchData();
}

//最后一次查询的时间戳
const lastQueryTime = ref(0);
//冷却时长
const COOLDOWN_DURATION = 5000;
const find = () => {
    // 获取当前时间戳
    const now = Date.now();
    // 计算距离上次查询的时间差
    const timeDiff = now - lastQueryTime.value;
    // 判断是否在冷却期内
    if (timeDiff < COOLDOWN_DURATION) {
        // 计算剩余冷却时间
        const remainingTime = ((COOLDOWN_DURATION - timeDiff) / 1000).toFixed(1);
        console.log('开始查询')
        ElMessage({
            type: 'warning',
            message: `请等待${remainingTime}秒后再查询`,
            duration: COOLDOWN_DURATION - timeDiff
        })
        return;
    }
    // 不在冷却期，执行正常查询逻辑
    try {
        // 更新最后查询时间戳（关键：标记本次查询时间）
        lastQueryTime.value = now
        fetchData();
    } catch(error) {
        // 异常处理
        ElMessage.error('查询失败，请稍后重试')
        // 异常时重置冷却时间（可选，避免因接口失败导致用户无法重试）
        lastQueryTime.value = 0
    }
}

const addDish = () => {
    dialogVisible.value = true;
}

const submit = () => {
    const submitData = collectFlavorData();
    console.log(submitData)
}

const fetchData = async () => {
    const { code, message, data } = await GetDishPageList(pageParams.value);
    if (code === 1) {
        dishList.value = data.records;
        console.log(dishList.value);
        total.value = data.total;
    } else {
        ElMessage.error('数据获取异常，请重试');
    }
    const category_res = await GetList(1);
    categoryList.value = category_res.data;
}

onMounted(() => {
    fetchData();
})

const flavorNameOptions = ref([
  { label: '甜味', value: '甜味' },
  { label: '温度', value: '温度' },
  { label: '忌口', value: '忌口' },
  { label: '辣度', value: '辣度' }
])

// 预设：口味名对应的具体项（可根据业务调整）
const flavorItemMap = {
  '甜味': ['无糖', '少糖', '半糖', '多糖', '全糖'],
  '温度': ['热饮', '常温', '去冰', '少冰', '多冰'],
  '忌口': ['不要葱', '不要蒜', '不要香菜', '不要辣'],
  '辣度': ['不辣', '微辣', '中辣', '重辣']
}

// 核心数据：口味行列表
const flavorRows = ref([])

/**
 * 添加口味行（最多4行）
 */
const addFlavorRow = () => {
  if (flavorRows.value.length < 4) {
    flavorRows.value.push({
      flavorName: '', // 选中的口味名
      flavorItems: [] // 该口味对应的具体项
    })
  }
}

/**
 * 删除整行口味配置
 * @param {Number} rowIndex 行索引
 */
const removeFlavorRow = (rowIndex) => {
  flavorRows.value.splice(rowIndex, 1)
}

/**
 * 选择口味名后，自动填充对应的具体项
 * @param {Number} rowIndex 行索引
 */
const handleFlavorNameChange = (rowIndex) => {
  const currentRow = flavorRows.value[rowIndex]
  // 根据选中的口味名，从预设映射中获取具体项
  currentRow.flavorItems = flavorItemMap[currentRow.flavorName] || []
}

/**
 * 删除指定行的某个具体口味项
 * @param {Number} rowIndex 行索引
 * @param {Number} itemIndex 项索引
 */
const removeFlavorItem = (rowIndex, itemIndex) => {
  flavorRows.value[rowIndex].flavorItems.splice(itemIndex, 1)
}

const collectFlavorData = () => {
    const validData = flavorRows.value
        .filter(row => row.flavorName.trim() && row.flavorItems.length > 0) // 过滤空行/无具体项的行
        .map(row => ({
        flavorName: row.flavorName,
        selectedItems: [...row.flavorItems] // 深拷贝，避免后续修改影响
        }))
    return validData
}
</script>

<style scoped lang="scss">
.dish-root {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-family: inherit;
    font-size: 14px;
    .container {
        width: 100%;
        height: 100%;
        background-color: white;
        box-sizing: border-box;
        padding: 30px;
        display: flex;
        flex-direction: column;

        .header {
            display: flex;
            height: 50px;
            justify-content: space-between;
            margin-bottom: 20px;
            .left {
                display: flex;
                gap: 16px;
                align-items: center;
                .el-input {
                    width: 185px;
                    height: 40px;
                    border: 1px solid #E5FFFF;
                }
                .el-button {
                    width: 70px;
                    height: 40px;
                    border: 0;
                }
            }
            .right {
                display: flex;
                align-items: center;
                span {
                    color: #f56c6c;
                    margin-right: 30px;
                    cursor: pointer;
                }
                .dish-btn {
                    width: 100px;
                    height: 40px;
                    border: 0;
                }
                .dish-btn {
                    background-color: #00BCD4;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 10px 20px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    box-shadow: 0 2px 4px rgba(0, 188, 212, 0.1); /* 基础阴影 */
                }
                .dish-btn:hover {
                    background-color: #00A8C1;
                    box-shadow: 
                        0 4px 12px rgba(0, 188, 212, 0.25),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2); /* 外阴影增强 + 内发光 */
                    transform: translateY(-1px); /* 轻微上浮效果 */
                }
                .dish-btn:active {
                    background-color: #0095A8; /* 再加深约10% */
                    transform: translateY(0); /* 按下时回到原位 */
                    box-shadow: 0 2px 4px rgba(0, 188, 212, 0.2); /* 阴影减弱 */
                }
            }
        }
        .main {
            flex: 1;
        }
    }
}

.status-dot {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot.active {
  background-color: #67c23a; /* 绿色 */
  box-shadow: 0 0 6px rgba(103, 194, 58, 0.3);
}

.dot.inactive {
  background-color: #c0c4cc; /* 灰色 */
}

.flavor-config-container {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  max-width: 800px;
}

.flavor-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed #e6e6e6;
}

.flavor-name-col {
  width: 120px;
}

.flavor-items-col {
  flex: 1;
}

.flavor-opt-col {
  width: 80px;
  text-align: center;
}

/* 适配ElementPlus标签样式，和示例图一致 */
:deep(.el-tag) {
  margin-right: 8px;
}
</style>