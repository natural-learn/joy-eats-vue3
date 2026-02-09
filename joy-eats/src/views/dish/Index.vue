<template>
    <div class="dish-root">
        <div class="container">
            <div class="header">
                <div class="left">
                    <span style="white-space: nowrap;">菜品名称：</span>
                    <el-input 
                        v-model="pageParams.name"
                        placeholder="请输入分类名称" 
                    />
                    <span>菜品分类：</span>
                    <el-select v-model="pageParams.type" placeholder="请选择分类" style="width: 150px">
                        <el-option
                            v-for="item in categoryTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            />
                    </el-select>
                    <div class="sell-status">
                        <span>售卖状态：</span>
                        <el-select v-model="pageParams.type" placeholder="请选择分类" style="width: 150px">
                            <el-option
                                v-for="item in categoryTypeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                />
                        </el-select>
                    </div>
                    <el-button type="primary" @click="find">查询</el-button>
                </div>
                <div class="right">
                    <span>批量删除菜品</span>
                    <el-button class="dish-btn" type="primary" @click="addDishCategory">+ 新增菜品</el-button>
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
                    :data="dishList"
                    style="width: 100%;"
                    >
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="name" label="菜品名称" width="120" />
                    <el-table-column prop="image" label="菜品图片" width="150" #default="scope">
                        <el-image style="width: 40px;height: 40px;" :src="scope.row.image"/>
                    </el-table-column>
                    <el-table-column prop="categoryName" label="菜品分类" width="150" :formatter="formatType"/>
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
                        <el-button type="primary" size="small" @click="editCategory(scope.row)">
                            修改
                        </el-button>
                        <el-button type="danger" size="small" @click="deleteById(scope.row)">
                            删除
                        </el-button>
                        <el-button type="warning" size="small" @click="startOrStop(scope.row)">
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
import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';

const dialogVisible = ref(false);

const dishList = ref([]);

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


const fetchData = async () => {
    const { code, message, data } = await GetDishPageList(pageParams.value);
    if (code === 1) {
        dishList.value = data.records;
        total.value = data.total;
        console.log('获取菜品数据：', dishList.value);
    } else {
        ElMessage.error('数据获取异常，请重试');
    }
}

onMounted(() => {
    fetchData();
})

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
</style>