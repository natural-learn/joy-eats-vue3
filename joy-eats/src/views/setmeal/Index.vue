<template>
    <div class="setmeal-root">
        <div class="container">
            <div class="header">
                <div class="left">
                    <span style="white-space: nowrap;">套餐名称：</span>
                    <el-input 
                        v-model="pageParams.name"
                        placeholder="请输入套餐名称" 
                    />
                    <span>套餐分类：</span>
                    <el-select v-model="pageParams.categoryId" placeholder="请选择套餐分类" style="width: 150px">
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
                    <span>批量删除套餐</span>
                    <el-button class="setmeal-btn" type="primary" @click="addSetmeal">+ 新增套餐</el-button>
                </div>
            </div>
            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
                <el-form 
                    :model="setmeal"
                    ref="formRef"
                    label-width="100px">
                    <el-form-item label="分类名称：" prop="name">
                        <el-input v-model="setmeal.name" style="width: 240px;" placeholder="请输入套餐名称" />
                    </el-form-item>
                    <el-form-item label="套餐价格：" prop="name">
                        <el-input v-model="setmeal.price" style="width: 240px;" placeholder="请输入套餐名称" />
                    </el-form-item>
                    <el-form-item label="套餐分类：">
                        <el-select v-model="pageParams.categoryId" placeholder="请选择套餐分类" style="width: 150px">
                        <el-option
                            v-for="item in categoryList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit">提交</el-button>
                        <el-button @click="dialogVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <div class="main">
                <el-table 
                    :data="setmealList"
                    style="width: 100%;"
                    >
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="name" label="套餐名称" width="120" />
                    <el-table-column prop="image" label="套餐图片" width="150" #default="scope">
                        <el-image style="width: 40px;height: 40px;" :src="scope.row.image"/>
                    </el-table-column>
                    <el-table-column prop="categoryName" label="套餐分类" width="150"/>
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
                        <el-button type="primary" size="small" @click="updateSetmeal(scope.row)">
                            修改
                        </el-button>
                        <el-button type="danger" size="small" @click="deleteById(row)">
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
import { GetSetmealPageList, AddSetmeal, UpdateSetmeal, DeleteById } from '@/api/setmeal';
import { DeleteById, GetList } from '@/api/category';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, computed ,onMounted } from 'vue';

const dialogVisible = ref(false);
const dialogTitle = ref('新增菜品');
const setmeal = ref({
    name: '',
    price: 0.0,

})
const setmealList = ref([]);
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

const addSetmeal = () => {
    dialogVisible.value = true;
}

const updateSetmeal = (row) => {
    dialogVisible.value = true;
    dialogTitle.value = '修改套餐';
    setmeal.value = {...row}
}

const deleteById = (row) => {
    ElMessageBox.confirm('此操作将永久删除该套餐信息，是否继续？', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async() => {
        const { code } = await DeleteById(row.id);
        if (code === 1) {
            ElMessage.success('删除成功');
            fetchData();
        }
    })
}

const submit = async () => {
    if (!setmeal.value.id) {
        dialogTitle.value = "添加套餐";
        const { code, message, data } = await AddSetmeal(dish.value);
        if (code === 1) {
            ElMessage.success("添加成功");
        } else {
            ElMessage.error(message);
        }
    } else {
        const { code, message, data } = await UpdateSetmeal(dish.value);
        if (code === 1) {
            ElMessage.success("修改成功");
        } else {
            ElMessage.error(message);
        }
    }
    dialogVisible.value = false;
    fetchData();
}

const fetchData = async () => {
    const { code, message, data } = await GetSetmealPageList(pageParams.value);
    if (code === 1) {
        setmealList.value = data.records;
        total.value = data.total;
    } else {
        ElMessage.error('数据获取异常，请重试');
    }
    const category_res = await GetList(2);
    categoryList.value = category_res.data;
}

onMounted(() => {
    fetchData();
})

</script>

<style scoped lang="scss">
.setmeal-root {
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
                .setmeal-btn {
                    width: 100px;
                    height: 40px;
                    border: 0;
                }
                .setmeal-btn {
                    background-color: #1DE9B6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 10px 20px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    box-shadow: 0 2px 4px rgba(0, 188, 212, 0.1); /* 基础阴影 */
                }
                .setmeal-btn:hover {
                    background-color: #1AD4A3;
                    box-shadow: 
                        0 4px 12px rgba(0, 188, 212, 0.25),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2); /* 外阴影增强 + 内发光 */
                    transform: translateY(-1px); /* 轻微上浮效果 */
                }
                .setmeal-btn:active {
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
</style>