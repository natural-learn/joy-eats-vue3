<template>
    <div class="setmeal-root">
        <div class="container">
            <!-- 顶部筛选栏 -->
            <div class="header">
                <div class="left">
                    <span>套餐名称：</span>
                    <el-input v-model="pageParams.name" placeholder="请输入套餐名称" />
                    <span>套餐分类：</span>
                    <el-select v-model="pageParams.categoryId" placeholder="请选择套餐分类" style="width: 150px">
                        <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <div class="sell-status">
                        <span>售卖状态：</span>
                        <el-select v-model="pageParams.status" placeholder="请选择售卖状态" style="width: 150px">
                            <el-option v-for="item in sellStatus" :key="item.id" :label="item.status" :value="item.id" />
                        </el-select>
                    </div>
                    <el-button type="primary" @click="find">查询</el-button>
                </div>
                <div class="right">
                    <span>批量删除套餐</span>
                    <el-button class="setmeal-btn" type="primary" @click="addSetmeal">+ 新增套餐</el-button>
                </div>
            </div>

            <!-- 新增/编辑套餐弹窗 -->
            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
                <el-form ref="dishFormRef" :model="setmealForm" :rules="setmealRules" label-width="100px" class="setmeal-form">
                    <el-form-item label="套餐名称" prop="name">
                        <el-input v-model="setmealForm.name" placeholder="请填写套餐名称" maxlength="20" show-word-limit />
                    </el-form-item>
                    <el-form-item label="套餐分类" prop="category">
                        <el-select v-model="setmealForm.category" placeholder="请选择套餐分类" style="width: 100%">
                            <el-option v-for="category in categoryList" :key="category.id" :label="category.name" :value="category.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="套餐价格" prop="price">
                        <el-input class="price-input" v-model="setmealForm.price" placeholder="请设置菜品价格" type="number" min="0" step="0.01" prefix="¥" />
                    </el-form-item>
                    <el-form-item label="套餐菜品">
                        <el-button type="primary" @click="addDish">+ 添加菜品</el-button>
                    </el-form-item>
                    <el-form-item label="套餐图片" prop="image">
                        <el-upload
                            class="avatar-uploader"
                            action="#"
                            :auto-upload="false"
                            :on-change="handleImageChange"
                            :before-upload="beforeUpload"
                            :file-list="imageFileList"
                            list-type="picture-card"
                            :limit="1"
                        >
                            <div v-if="imageFileList.length === 0">
                                <i class="el-icon-plus setmeal-image"></i>
                                <div class="el-upload__text">上传图片</div>
                            </div>
                        </el-upload>
                        <div class="upload-tips">
                            图片大小不超过2M<br>
                            仅能上传PNG、JPEG、JPG类型图片<br>
                            建议上传200*200或300*300尺寸的图片
                        </div>
                    </el-form-item>
                    <el-form-item label="菜品描述">
                        <el-input v-model="setmealForm.desc" placeholder="菜品描述，最长200字" type="textarea" rows="4" maxlength="200" show-word-limit />
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="resetForm">取消</el-button>
                        <el-button type="primary" @click="submit('save')">保存</el-button>
                        <el-button type="warning" @click="submitForm('saveAndContinue')" style="margin-left: 10px">保存并继续添加</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <!-- 添加菜品弹窗 -->
            <el-dialog
                v-model="addSetmealVisible"
                title="添加菜品"
                width="90%"
                :close-on-click-modal="false"
                @close="resetForm"
                class="setmeal-dish-dialog"
            >
                <div class="setmeal-dish-add-container">
                    <div class="header">
                        <h3>添加菜品</h3>
                        <el-input
                            v-model="searchKeyword"
                            placeholder="请输入菜品名称进行搜索"
                            style="width: 300px"
                            clearable
                            @input="handleSearch"
                        >
                            <template #prefix>
                                <el-icon><Search /></el-icon>
                            </template>
                        </el-input>
                    </div>
                    <div class="main-content">
                        <div class="scrollable-category-sidebar">
                            <el-menu
                                :default-active="dishCategoryList[0]?.id"
                                mode="vertical"
                                class="category-menu"
                                @select="handleCategoryChange"
                            >
                                <el-menu-item
                                    v-for="item in dishCategoryList"
                                    :key="item.id"
                                    :index="item.id"
                                    class="category-item"
                                >
                                    {{ item.name }}
                                </el-menu-item>
                            </el-menu>
                        </div>
                        <div class="dish-list">
                            <el-scrollbar height="100%">
                                <el-checkbox-group v-model="checkedDishIds">
                                    <div v-for="dish in filteredDishList" :key="dish.id" class="dish-item">
                                        <el-checkbox :label="dish.id" class="dish-checkbox">
                                            <div class="dish-info">
                                                <span class="dish-name">{{ dish.name }}</span>
                                                <span class="dish-status">在售</span>
                                                <span class="dish-price">¥{{ dish.price }}</span>
                                            </div>
                                        </el-checkbox>
                                    </div>
                                </el-checkbox-group>
                            </el-scrollbar>
                        </div>
                        <div class="selected-dish-list">
                            <div class="selected-header">已选菜品({{ selectedDishList.length }})</div>
                            <el-scrollbar height="100%">
                                <div v-for="dish in selectedDishList" :key="dish.id" class="selected-dish-item">
                                    <span>{{ dish.name }}</span>
                                    <span class="selected-price">¥{{ dish.price }}</span>
                                    <el-button type="text" icon="CircleClose" @click="handleRemoveDish(dish.id)" />
                                </div>
                            </el-scrollbar>
                        </div>
                    </div>
                    <div class="footer-buttons">
                        <el-button @click="handleCancel">取消</el-button>
                        <el-button type="primary" @click="handleConfirm" style="border: none">添加</el-button>
                    </div>
                </div>
            </el-dialog>

            <!-- 套餐列表 -->
            <div class="main">
                <el-table :data="setmealList" style="width: 100%;">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="name" label="套餐名称" width="120" />
                    <el-table-column prop="image" label="套餐图片" width="150">
                        <template #default="scope">
                            <el-image style="width: 40px;height: 40px;" :src="scope.row.image" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="categoryName" label="套餐分类" width="150" />
                    <el-table-column prop="price" label="售价" width="100" />
                    <el-table-column label="售卖状态" width="150">
                        <template #default="scope">
                            <div class="status-dot">
                                <span class="dot" :class="scope.row.status === 1 ? 'active' : 'inactive'"></span>
                                {{ scope.row.status === 1 ? "启用" : "禁用" }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后操作时间" width="180" />
                    <el-table-column label="操作" align="center" width="280">
                        <template #default="scope">
                            <el-button type="primary" size="small" @click="updateSetmeal(scope.row)">修改</el-button>
                            <el-button type="danger" size="small" @click="deleteById(scope.row)">删除</el-button>
                            <el-button type="warning" size="small">
                                {{ scope.row.status === 1 ? "停售" : "启售" }}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 分页 -->
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
import { GetSetmealPageList, AddSetmeal, UpdateSetmeal, DeleteSetmealById } from '@/api/setmeal';
import { GetList } from '@/api/category';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, computed, onMounted } from 'vue';

// 弹窗控制
const dialogVisible = ref(false);
const addSetmealVisible = ref(false);
const dialogTitle = ref('新增套餐');

// 表单数据
const setmealForm = ref({
    name: '',
    category: null,
    price: 0.0,
    image: null,
    desc: ''
});
const imageFileList = ref([]);

// 列表与分页
const setmealList = ref([]);
const categoryList = ref([]);
const sellStatus = ref([
    { id: 0, status: '停售' },
    { id: 1, status: '启售' }
]);
const pageParams = ref({
    page: 1,
    pageSize: 5,
    name: '',
    categoryId: null,
    status: null
});
const total = ref(0);

// 查询与分页
const handleCurrentChange = (newPage) => {
    pageParams.value.page = newPage;
    fetchData();
};
const handleSizeChange = (newSize) => {
    pageParams.value.pageSize = newSize;
    fetchData();
};

// 查询防抖
const lastQueryTime = ref(0);
const COOLDOWN_DURATION = 5000;
const find = () => {
    const now = Date.now();
    const timeDiff = now - lastQueryTime.value;
    if (timeDiff < COOLDOWN_DURATION) {
        const remainingTime = ((COOLDOWN_DURATION - timeDiff) / 1000).toFixed(1);
        ElMessage({
            type: 'warning',
            message: `请等待${remainingTime}秒后再查询`,
            duration: COOLDOWN_DURATION - timeDiff
        });
        return;
    }
    try {
        lastQueryTime.value = now;
        fetchData();
    } catch (error) {
        ElMessage.error('查询失败，请稍后重试');
        lastQueryTime.value = 0;
    }
};

// 新增/编辑套餐
const addSetmeal = () => {
    dialogVisible.value = true;
    dialogTitle.value = '新增套餐';
};
const updateSetmeal = (row) => {
    dialogVisible.value = true;
    dialogTitle.value = '修改套餐';
    setmealForm.value = { ...row };
};
const deleteById = (row) => {
    ElMessageBox.confirm('此操作将永久删除该套餐信息，是否继续？', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        const { code } = await DeleteSetmealById(row.id);
        if (code === 1) {
            ElMessage.success('删除成功');
            fetchData();
        }
    });
};
const submit = async () => {
    // 这里应根据实际业务调整
    dialogVisible.value = false;
    fetchData();
};

// 数据获取
const fetchData = async () => {
    const { code, data } = await GetSetmealPageList(pageParams.value);
    if (code === 1) {
        setmealList.value = data.records;
        total.value = data.total;
    } else {
        ElMessage.error('数据获取异常，请重试');
    }
    const category_res = await GetList(2);
    categoryList.value = category_res.data;
};
onMounted(() => {
    fetchData();
});

// 套餐菜品弹窗相关
const addDish = () => {
    addSetmealVisible.value = true;
};
const resetForm = () => {
    dialogVisible.value = false;
    addSetmealVisible.value = false;
};

// 菜品选择相关
const searchKeyword = ref('');
const dishList = ref([]);
const currentCategoryIndex = ref(0);
const checkedDishIds = ref([]);
const dishCategoryList = ref([]);

// 分类与菜品获取
const getCategoryList = async () => {
    const dishCategory_res = await GetList(1);
    dishCategoryList.value = dishCategory_res.data;
};
const getDishList = async () => {
    dishList.value = [
        { id: 1, name: '草鱼2斤', price: 68, status: 1, categoryId: 2 },
        { id: 2, name: '江团鱼2斤', price: 119, status: 1, categoryId: 2 },
        { id: 3, name: '鲍鱼2斤', price: 72, status: 1, categoryId: 2 }
    ];
};
onMounted(async () => {
    await getCategoryList();
    await getDishList();
});

// 菜品筛选
const filteredDishList = computed(() => {
    const currentCategory = dishCategoryList.value[currentCategoryIndex.value];
    let result = dishList.value.filter(dish => dish.categoryId === currentCategory?.id && dish.status === 1);
    if (searchKeyword.value) {
        result = result.filter(dish => dish.name.includes(searchKeyword.value));
    }
    return result;
});
const selectedDishList = computed(() => {
    return dishList.value.filter(dish => checkedDishIds.value.includes(dish.id));
});
const handleCategoryChange = (index) => {
    currentCategoryIndex.value = dishCategoryList.value.findIndex(item => item.id == index);
};
const handleSearch = () => {};
const handleRemoveDish = (dishId) => {
    checkedDishIds.value = checkedDishIds.value.filter(id => id !== dishId);
};
const handleCancel = () => {
    checkedDishIds.value = [];
    addSetmealVisible.value = false;
};
const handleConfirm = async () => {
    if (selectedDishList.value.length === 0) {
        ElMessage.warning('请选择至少一个菜品');
        return;
    }
    ElMessage.success('菜品添加成功');
    handleCancel();
};
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
                    border: 1px solid #e5ffff;
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
                    background-color: #1de9b6;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    padding: 10px 20px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    box-shadow: 0 2px 4px rgba(0, 188, 212, 0.1);

                    &:hover {
                        background-color: #1ad4a3;
                        box-shadow: 0 4px 12px rgba(0, 188, 212, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2);
                        transform: translateY(-1px);
                    }
                    &:active {
                        background-color: #0095a8;
                        transform: translateY(0);
                        box-shadow: 0 2px 4px rgba(0, 188, 212, 0.2);
                    }
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

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;

        &.active {
            background-color: #67c23a;
            box-shadow: 0 0 6px rgba(103, 194, 58, 0.3);
        }
        &.inactive {
            background-color: #c0c4cc;
        }
    }
}

.setmeal-form {
    .el-form-item {
        .el-input,
        .el-select {
            width: 200px !important;
        }
    }
}

.setmeal-image {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.upload-tips {
    margin-left: 15px;
    margin-top: 10px;
    font-size: 12px;
    color: #999;
    line-height: 1.5;
}

.setmeal-dish-add-container {
    width: 900px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
    box-sizing: border-box;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    .main-content {
        display: flex;
        flex: 1;
        gap: 16px;

        .scrollable-category-sidebar {
            width: 120px;
            height: 300px;
            overflow-y: auto;
            padding: 10px 0;
            scrollbar-width: none;

            &::-webkit-scrollbar {
                display: none;
            }
        }

        .category-menu {
            width: 120px;
            border-right: none !important;
            background: transparent !important;
            height: 100%;

            .category-item {
                padding: 8px 0 !important;
                font-size: 14px;
                text-align: left;
                --el-menu-item-hover-bg-color: transparent;
                --el-menu-item-active-bg-color: transparent;
            }

            :deep(.el-menu-item.is-active) {
                color: #ffc107 !important;
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    height: 80%;
                    width: 2px;
                    background-color: #ffc107;
                }
            }
        }

        .dish-list {
            flex: 2;
            border-right: 1px solid #e6e6e6;
            padding: 0 16px;

            .dish-item {
                padding: 8px 0;
                border-bottom: 1px solid #f5f5f5;

                .dish-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;

                    .dish-status {
                        color: #666;
                        font-size: 12px;
                    }
                    .dish-price {
                        color: #ff9000;
                        font-weight: bold;
                    }
                }
            }
        }

        .selected-dish-list {
            flex: 1;
            display: flex;
            flex-direction: column;

            .selected-header {
                font-weight: bold;
                margin-bottom: 8px;
            }

            .selected-dish-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #f5f5f5;

                .selected-price {
                    color: #ff9000;
                }
            }
        }
    }

    .footer-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        margin-top: 16px;
    }
}
</style>
