<template>
<div class="category-root">
        <div class="container">
            <div class="header">
                <div class="left">
                    <span style="white-space: nowrap;">分类名称：</span>
                    <el-input 
                        v-model="pageParams.name"
                        placeholder="请输入分类名称" 
                    />
                    <span style="white-space: nowrap;">分类类型：</span>
                    <el-select v-model="pageParams.type" placeholder="请选择分类" style="width: 150px">
                        <el-option
                            v-for="item in categoryTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            />
                    </el-select>
                    <el-button type="primary" @click="find">查询</el-button>
                </div>
                <div class="right">
                    <el-button class="dish-btn" type="primary" @click="addDishCategory">+ 新增菜品分类</el-button>
                    <el-button class="setmeal-btn" type="primary" @click="addSetmealCategory">+ 新增套餐分类</el-button>
                </div>
            </div>
            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
                <el-form 
                    :model="category"
                    :rules="rules"
                    ref="formRef"
                    label-width="100px">
                    <el-form-item label="分类名称：" prop="name">
                        <el-input v-model="category.name" style="width: 240px;" placeholder="请输入分类名称" />
                    </el-form-item>
                    <el-form-item label="排序：" prop="sort">
                        <el-input v-model="category.sort" type="number" style="width: 240px;" placeholder="请输入排序" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit">提交</el-button>
                        <el-button @click="dialogVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <div class="main">
                <el-table 
                    :data="categoryList"
                    style="width: 100%;"
                    >
                    <el-table-column prop="name" label="分类名称" width="150" />
                    <el-table-column prop="type" label="分类类型" width="150" :formatter="formatType"/>
                    <el-table-column prop="sort" label="排序" width="150" />
                    <el-table-column label="状态" width="150">
                        <template #default="scope">
                            <div class="status-dot">
                                <span class="dot" :class="scope.row.status === 1 ? 'active' : 'inactive'"></span>
                                {{ scope.row.status === 1 ? "启用": "禁用" }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="操作时间" width="200" />
                    <el-table-column label="操作" align="center" width="280" #default="scope">
                        <el-button type="primary" size="small" @click="editCategory(scope.row)">
                            修改
                        </el-button>
                        <el-button type="danger" size="small" @click="deleteById(scope.row)">
                            删除
                        </el-button>
                        <el-button type="warning" size="small" @click="startOrStop(scope.row)">
                            {{ scope.row.status === 1 ? "禁用" : "启用" }}
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
import { GetCategoryPageList, AddCategory, UpdateCategory, StartOrStop, DeleteById } from '@/api/category';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive, onMounted } from 'vue';

const category = ref({
    name: '',
    sort: '',
    type: 1
})
const categoryList = ref([]);
const categoryTypeList = ref([
    { label: '菜品分类', value: 1 },
    { label: '套餐分类', value: 2 }
])

const formatType = (row, column, cellValue) => {
    const typeMap = {
        1: '菜品分类',
        2: '套餐分类'
    }
    return typeMap[cellValue] || '未知类型';
}

const rules = reactive({
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 2, max: 8, message: '分类名称在2到8个字符之间', trigger: 'blur' }
    ],
    sort: [
        { required: true, message: '请输入整数', trigger: 'blur' },
        { pattern: /^[0-9]*$/, message: '只能输入整数', trigger: 'blur' }
    ]
})

const formRef = ref();
const dialogVisible = ref(false);
const dialogTitle = ref('新增菜品分类');

const total = ref(0);
const pageParams = ref({
    page: 1,
    pageSize: 5,
    // 1：菜品分类  2：套餐分类
    type: 1,
    // 分类名称
    name: '',
    // 排序
    sort: 1
})

//最后一次查询的时间戳
const lastQueryTime = ref(0);
//冷却时长
const COOLDOWN_DURATION = 5000;

const handleCurrentChange = (newPage) => {
    pageParams.value.page = newPage;
    fetchData();
}

const handleSizeChange = (newSize) => {
    pageParams.value.pageSize = newSize;
    fetchData();
}

const find = async () => {
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

const addDishCategory = () => {
    dialogVisible.value = true;
    dialogTitle.value = '新增菜品分类';
    category.value.type = 1;
}

const addSetmealCategory = () => {
    dialogVisible.value = true;
    dialogTitle.value = '新增套餐分类';
    category.value.type = 2;
}

const editCategory = (row) => {
    dialogVisible.value = true;
    if (row.type === 1) {
        dialogTitle.value = '修改菜品分类';
    } else if (row.type === 2) {
        dialogTitle.value = '修改套餐分类';
    }
    category.value = {...row};
}

const deleteById = (row) => {
    ElMessageBox.confirm('此操作将永久删除该类型，是否继续？', 'warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async() => {
        console.log(row)    
        const { code } = await DeleteById(row.id);
        if (code === 1) {
            ElMessage.success('删除成功');
            fetchData();
        }
    })
}

const categoryStatus = ref(1);
/**
 * 启用禁用分类
 * @param row 
 */
const startOrStop = async (row) => {
    if (row.status == 1) {
        //启用状态，接下来要禁用
        const { code } = await StartOrStop(0, row.id);
        if (code === 1) {
            ElMessage.success(`禁用${row.name}分类成功！`);
            row.status = 0;
        } else {
            ElMessage.error(`禁用${row.name}分类失败！`);
        }
    } else if(row.status == 0){
        //禁用状态，接下来要启用
        const { code } = await StartOrStop(1, row.id);
        if (code === 1) {
            ElMessage.success(`启用${row.name}分类成功！`);
            row.status = 1;
        } else {
            ElMessage.error(`启用${row.name}分类失败！`);
        }
    }
    fetchData();
}

/**
 * 提交
 */
const submit = async () => {
    if (!category.value.id) {
        const { code, message, data } = await AddCategory(category.value);
        if (code === 1) {
            ElMessage.success('添加成功');
        } else {
            ElMessage.error(message);
        }
    } else {
        const { code, message, data } = await UpdateCategory(category.value);
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
    const { code, message, data } = await GetCategoryPageList(pageParams.value);
    categoryList.value = data.records;
    total.value = data.total;   
}

onMounted(() => {
    fetchData();
})
</script>

<style lang="scss" scoped>
.category-root {
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
                gap: 10px;
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
                .dish-btn, .setmeal-btn {
                    width: 120px;
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
                .setmeal-btn {
                    background-color: #1DE9B6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 10px 20px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    box-shadow: 0 2px 4px rgba(29, 233, 182, 0.1);
                    position: relative; /* 为可能的伪元素效果做准备 */
                }
                .setmeal-btn:hover {
                    background-color: #1AD4A3;
                    box-shadow: 
                        0 4px 12px rgba(29, 233, 182, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.8) inset; /* 内边框高光 */
                    transform: translateY(-1px);
                }
                .setmeal-btn::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 6px;
                    background: linear-gradient(
                        to bottom,
                        rgba(255, 255, 255, 0.1) 0%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    pointer-events: none;
                }
                .setmeal-btn:active {
                    background-color: #17BF90; /* 再加深约10% */
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(29, 233, 182, 0.2);
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