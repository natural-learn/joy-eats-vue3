<template>
    <div class="employee-root">
        <div class="container">
            <div class="header">
                <div class="left">
                    <span style="white-space: nowrap;">员工姓名：</span>
                    <el-input 
                        v-model="pageParams.name" 
                        placeholder="请输入员工姓名" 
                        @input="fintPageInput"
                    />
                    <el-button type="primary" @click="fetchData">查询</el-button>
                </div>
                <div class="right">
                    <el-button type="primary" @click="dialogVisible = true">+ 添加员工</el-button>
                </div>
            </div>
            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
                <el-form 
                    :model="employee"
                    ref="formRef"
                    :rules="rules"
                    label-width="100px">
                    <el-form-item label="账号：" prop="username">
                        <el-input v-model="employee.username" style="width: 240px;" placeholder="请输入账号" />
                    </el-form-item>
                    <el-form-item label="员工姓名：" prop="name">
                        <el-input v-model="employee.name" style="width: 240px;" placeholder="请输入员工姓名" />
                    </el-form-item>
                    <el-form-item label="手机号：" prop="phone">
                        <el-input v-model="employee.phone" style="width: 240px;" placeholder="请输入手机号" />
                    </el-form-item>
                    <el-form-item label="性别：">
                        <el-radio-group v-model="selectedRadioValue">
                            <el-radio value="0" size="default">男</el-radio>
                            <el-radio value="1" size="large">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="身份证号：" prop="idNumber">
                        <el-input v-model="employee.idNumber" style="width: 240px;" placeholder="请输入身份证号" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit">提交</el-button>
                        <el-button @click="dialogVisible = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <div class="main">
                <el-table v-if="employeeList.length > 0"
                    :data="employeeList"
                    style="width: 100%;"
                    >
                    <el-table-column prop="name" label="员工姓名" width="150" />
                    <el-table-column prop="username" label="账号" width="150" />
                    <el-table-column prop="phone" label="手机号" width="150" />
                    <el-table-column prop="status" label="账号状态" width="150">
                        <template #default="scope">
                            <div class="status-dot">
                                <span class="dot" :class="scope.row.status === 1 ? 'active' : 'inactive'"></span>
                                {{ scope.row.status === 1 ? "启用": "禁用" }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="最后操作时间" width="200" />
                    <el-table-column label="操作" align="center" width="280" #default="scope">
                        <el-button type="primary" size="small" @click="editEmployee(scope.row)">
                            修改
                        </el-button>
                        <el-button type="danger" size="small" @click="deleteById(scope.row)">
                            删除
                        </el-button>
                        <el-button type="warning" size="small" @click="startOrStop(scope.row)">
                            {{ scope.row.status == 1 ? "禁用" : "启用" }}
                        </el-button>
                    </el-table-column>
                </el-table>
                <div v-else class="empty-state">
                    <el-empty :image="emptyImage" :image-size="200" description="暂无数据"/>
                </div>
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
import { GetEmployeePageList, AddEmployee, UpdateEmployee, DeleteEmployeeById, StartOrStop } from '@/api/employee'
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { debounce } from 'lodash-es'
import { ElMessage, ElMessageBox } from 'element-plus';

const employeeList = ref([]);
const emptyImage = '/src/assets/images/empty.png';

const selectedRadioValue = ref('0');
const dialogVisible = ref(false);
const dialogTitle = ref('添加员工');

const defaultForm = {
    name: '',
    username: '',
    password: '',
    phone: '',
    idNumber: '',
    sex: ''
}
const employee = ref(defaultForm);
const formRef = ref();
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 16, message: '用户名长度在3到16个字符之间', trigger: 'change' }
    ],
    name: [
        { required: true, message: '请输入员工姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '员工姓名在2到10个字符之间', trigger: 'change' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 10, message: '密码长度在6到10个字符之间', trigger: 'change' }
    ],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '手机号长度需要11位', trigger: 'change' }
    ],
    idNumber: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
        { min: 18, max: 18, message: '身份证号是18位', trigger: 'change' }
    ],
})

// 分页参数
const pageParams = ref({
    page: 1,
    pageSize: 5,
    name: ''
})
// 总条目数
const total = ref(0);

const handleCurrentChange = (newPage) => {
    pageParams.value.page = newPage;
    fetchData();
}

const handleSizeChange = (newSize) => {
    pageParams.value.pageSize = newSize;
    fetchData();
}

/**
 * 提交
 */
const submit = async () => {
    defaultForm.sex = selectedRadioValue.value;
    if (!employee.value.id) {
        dialogTitle.value = "添加员工";
        const { code, message, data } = await AddEmployee(employee.value);
        if (code === 1) {
            ElMessage.success("添加成功");
        } else {
            ElMessage.error(message);
        }
    } else {
        const { code, message, data } = await UpdateEmployee(employee.value);
        if (code === 1) {
            ElMessage.success("修改成功");
        } else {
            ElMessage.error(message);
        }
    }
    dialogVisible.value = false;
    fetchData();
}

/**
 * 编辑员工信息
 * @param row 
 */
const editEmployee = (row) => {
    dialogVisible.value = true;
    dialogTitle.value = "修改员工";
    employee.value = {...row}
}

/**
 * 删除员工信息
 * @param row 
 */
const deleteById = (row) => {
    ElMessageBox.confirm('此操作将永久删除该员工信息，是否继续？', 'Warning', {
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

/**
 * 查询员工信息
 */
const findEmployeesDebounce = debounce(() => {
    fetchData();
}, 300);

const fintPageInput = () => {
    if (pageParams.value.name === '') {
        findEmployeesDebounce();
    }
}

// 启用禁用员工账号
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
    const { code, message, data } = await GetEmployeePageList(pageParams.value);
    employeeList.value = data.records;
    total.value = data.total;
    console.log(employeeList.value)
}

onMounted(() => {
    fetchData();
})

onUnmounted(() => {
    findEmployeesDebounce.cancel();
})
</script>

<style scoped lang="scss">
.employee-root {
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
                .el-button {
                    width: 100px;
                    height: 40px;
                    border: 0;
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