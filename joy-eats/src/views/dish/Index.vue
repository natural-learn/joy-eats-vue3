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
                    ref="dishFormRef"
                    :model="dishForm"
                    :rules="dishRules"
                    label-width="100px"
                    class="dish-form"
                >
                    <!-- 菜品名称 -->
                    <el-form-item label="菜品名称" prop="name">
                        <el-input
                            v-model="dishForm.name"
                            placeholder="请填写菜品名称"
                            maxlength="20"
                            show-word-limit
                        />
                    </el-form-item>

                    <!-- 菜品分类 -->
                    <el-form-item label="菜品分类" prop="category">
                        <el-select
                            v-model="dishForm.category"
                            placeholder="请选择菜品分类"
                            style="width: 100%"
                        >
                        <!-- 这里可以替换为接口请求的分类数据 -->
                        <el-option 
                            v-for="category in categoryList" 
                            :key="category.id" 
                            :label="category.name" 
                            :value="category.id" />
                        </el-select>
                    </el-form-item>

                    <!-- 菜品价格 -->
                    <el-form-item label="菜品价格" prop="price">
                        <el-input
                            class="price-input"
                            v-model="dishForm.price"
                            placeholder="请设置菜品价格"
                            type="number"
                            min="0"
                            step="0.01"
                            prefix="¥"
                        />
                    </el-form-item>

                    <!-- 口味做法配置 -->
                    <el-form-item label="口味做法配置">
                        <!-- 口味名提示 -->
                        <div class="flavor-tip">口味名（3个字内）</div>
                        <!-- 动态口味列表 -->
                        <div v-for="(flavor, index) in dishForm.flavors" :key="index" class="flavor-item">
                        <!-- 口味下拉选择框 -->
                        <el-select
                            v-model="flavor.type"
                            placeholder="请选择口味"
                            style="width: 150px; margin-right: 10px"
                            @change="loadFlavorTags(index)"
                        >
                            <el-option
                                v-for="(tags, typeKey) in flavorTagMap"
                                :key="typeKey"
                                :label="getFlavorLabel(typeKey)"
                                :value="typeKey"
                                v-if="!selectedFlavorTypes.includes(typeKey) || flavor.type === typeKey"/>
                        </el-select>
                        
                        <!-- 口味标签区域（核心新增） -->
                        <div class="flavor-tags-box" style="flex: 1; margin-right: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
                            <!-- 渲染对应口味的可关闭标签 -->
                            <div 
                            v-for="(tag, tagIndex) in flavor.tags" 
                            :key="tagIndex" 
                            class="flavor-tag"
                            >
                            {{ tag }}
                            <span class="tag-close" @click.stop="removeFlavorTag(index, tagIndex)">X</span>
                            </div>
                        </div>
                        
                        <!-- 删除按钮 -->
                        <el-button
                            type="text"
                            text
                            @click="removeFlavor(index)"
                            class="flavor-delete"
                        >
                            删除
                        </el-button>
                        </div>
                        <!-- 添加口味按钮（最多4行） -->
                        <el-button
                            type="warning"
                            @click="addFlavor"
                            :disabled="dishForm.flavors.length >= 4"
                            style="margin-top: 10px"
                        >
                        +添加口味
                        </el-button>
                    </el-form-item>
                    <!-- 菜品图片 -->
                    <el-form-item label="菜品图片" prop="image">
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
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                            <div class="el-upload__text">上传图片</div>
                        </div>
                        </el-upload>
                        <!-- 图片上传提示 -->
                        <div class="upload-tips">
                        图片大小不超过2M<br>
                        仅能上传PNG、JPEG、JPG类型图片<br>
                        建议上传200*200或300*300尺寸的图片
                        </div>
                    </el-form-item>

                    <!-- 菜品描述 -->
                    <el-form-item label="菜品描述">
                        <el-input
                            v-model="dishForm.desc"
                            placeholder="菜品描述，最长200字"
                            type="textarea"
                            rows="4"
                            maxlength="200"
                            show-word-limit
                        />
                    </el-form-item>

                    <!-- 按钮区域 -->
                    <el-form-item label="">
                        <el-button @click="resetForm">取消</el-button>
                        <el-button type="primary" @click="submit('save')">保存</el-button>
                        <el-button
                        type="warning"
                        @click="submitForm('saveAndContinue')"
                        style="margin-left: 10px"
                        >
                        保存并继续添加
                        </el-button>
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
                        <el-button type="primary" size="small" @click="updateDish(scope.row)">
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
import { GetDishPageList, AddDish, UpdateDish, StartOrStop } from '@/api/dish';
import { GetList } from '@/api/category';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive ,computed ,onMounted } from 'vue';

const dialogVisible = ref(false);
const dialogTitle = ref('新增菜品');
const dish = ref({
    name: '',
    price: 0.0,
    image: ''
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

const submit = async () => {
    console.log(dishForm);
}

const updateDish = (row) => {
    dialogVisible.value = true;
    dish.value = {...row};
    dialogTitle.value = '修改菜品'
}

const deleteById = (row) => {
    ElMessageBox.confirm('此操作将永久删除该菜品信息，是否继续？', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async() => {
        const { code } = await DeleteEmployeeById(row.id);
        if (code === 1) {
            ElMessage.success('删除成功');
            fetchData();
        }
    })
}

const startOrStop = async (row) => {
    if (row.status == 1) {
        //启用状态，接下来要禁用
        const { code, message } = await StartOrStop(0, row.id);
        if (code === 1) {
            ElMessage.success(`禁用${row.name}的账号成功！`);
        } else {
            ElMessage.error(`禁用${row.name}的账号失败！`);
        }
    } else {
        //禁用状态，接下来要启用
        const { code, message } = await StartOrStop(1, row.id);
        if (code === 1) {
            ElMessage.success(`启用${row.name}的账号成功！`);
        } else {
            ElMessage.error(`启用${row.name}的账号失败！`);
        }
    }
    fetchData();
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

const dishFormRef = ref(null)

// 定义口味类型对应的预设标签（核心新增）
const flavorTagMap = {
  sweet: ['无糖', '少糖', '半糖', '多糖', '全糖'], // 甜味对应的标签
  spicy: ['不辣', '微辣', '中辣', '特辣'],         // 辣度对应的标签
  temper: ['热饮', '常温', '去冰', '少冰', '多冰'], // 咸度对应的标签
  diet: ['不要葱', '不要蒜', '不要青菜', '不要辣'] // 做法对应的标签
}

// 表单数据（调整flavors结构：增加tags字段存储标签）
const dishForm = reactive({
  name: '', // 菜品名称
  category: '', // 菜品分类
  price: 0, // 菜品价格
  flavors: [], // 口味列表：[{type: '', tags: []}]
  image: null, // 菜品图片文件
  desc: '' // 菜品描述
})

// 图片上传文件列表
const imageFileList = ref([])

// 表单验证规则（不变）
const dishRules = reactive({
  name: [
    { required: true, message: '请填写菜品名称', trigger: 'blur' },
    { max: 20, message: '菜品名称不能超过20个字', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择菜品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请设置菜品价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  image: [
    { required: true, message: '请上传菜品图片', trigger: 'change' }
  ]
})

const selectedFlavorTypes = computed(() => {
    return dishForm.flavors.map(item => item.type).filter(type => type)
})

const getFlavorLabel = (typeKey) => {
  const labelMap = {
    sweet: '甜味',
    spicy: '辣度',
    temper: '温度',
    diet: '忌口'
  }
  return labelMap[typeKey] || typeKey
}

// 添加口味（最多4行，调整tags初始值）
const addFlavor = () => {
  const maxFlavorCount = 4
  if (dishForm.flavors.length >= maxFlavorCount) {
    ElMessage.warning(`最多只能添加${maxFlavorCount}个口味！`)
    return
  }
  // 新增一行空的口味数据，tags初始为空数组
  dishForm.flavors.push({ type: '', tags: [] })
}

// 加载对应口味的预设标签（核心新增）
const loadFlavorTags = (index) => {
  const flavorType = dishForm.flavors[index].type
  // 根据选择的口味类型，加载对应的预设标签
  dishForm.flavors[index].tags = flavorTagMap[flavorType] || []
}

// 删除单个口味标签（核心新增）
const removeFlavorTag = (flavorIndex, tagIndex) => {
  dishForm.flavors[flavorIndex].tags.splice(tagIndex, 1)
}

// 删除整行口味
const removeFlavor = (index) => {
  dishForm.flavors.splice(index, 1)
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

.flavor-tip {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

/* 口味项布局 - 唯一保留 */
.flavor-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  width: 100%;
}

.flavor-delete {
  color: #f56c6c; /* 红色删除文字 */
}

/* 口味标签样式（核心新增） */
.flavor-tag {
  background: #fff;
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tag-close {
  color: #ffc107;
  cursor: pointer;
  font-weight: bold;
  margin-left: 4px;
}

.tag-close:hover {
  color: #f56c6c;
}

/* 图片上传样式 - 唯一保留 */
.avatar-uploader {
  width: 180px;
  height: 180px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.upload-tips {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}

/* 适配ElementPlus标签样式，和示例图一致 */
:deep(.el-tag) {
  margin-right: 8px;
}

.dish-upload-container {
  display: flex;
  align-items: center;
  gap: 8px; /* 文字和图片框间距，可微调 */
}

/* 菜品图片文字标签 */
.dish-label {
  white-space: nowrap;
  font-size: 14px;
  color: #333;
}

/* 上传外层容器：保证点击区域和定位基准 */
.dish-upload-wrapper {
  cursor: pointer;
}

/* 上传组件容器：消除默认样式 */
.dish-uploader {
  display: block; /* 避免flex影响 */
}

/* 图片/图标容器：固定尺寸+边框+居中布局 */
.dish-image-wrapper {
  width: 150px; /* 图片框宽度，可调整 */
  height: 150px; /* 图片框高度，可调整 */
  border: 1px solid #dcdfe6; /* 浅灰色边框，匹配设计 */
  background-color: #f8f9fa; /* 浅灰白背景，和截图一致 */
  display: flex;
  align-items: center;
  justify-content: center; /* 核心：让内部元素（图片/加号）居中 */
  overflow: hidden; /* 防止图片溢出 */
}

/* 菜品图片样式：填充容器 */
.dish-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 图片不变形 */
}

/* 加号图标样式：大小+颜色+居中 */
.dish-uploader-icon {
  font-size: 24px; /* 加号大小，视觉更明显 */
  color: #c0c4cc; /* 浅灰色，符合设计风格 */
}

.dish-form {
  padding: 10px;
  .el-form-item .el-input, .el-select {
    width: 200px !important;
  }
}
</style>