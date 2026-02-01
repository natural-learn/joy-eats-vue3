<template>
    <div class="employee-root">
        <div class="container">
            <div class="header">
                <div class="left">
                    <span style="white-space: nowrap;">员工姓名：</span>
                    <el-input placeholder="请输入员工姓名" />
                    <el-button type="primary">查询</el-button>
                </div>
                <div class="right">
                    <el-button type="primary" @click="dialogVisible = true">+ 添加员工</el-button>
                </div>
            </div>
            <el-dialog v-model="dialogVisible" title="添加员工" width="40%">
                <el-form label-width="100px">
                    <el-form-item label="账号：">
                        <el-input v-model="employee.username" style="width: 240px;" placeholder="请输入账号" />
                    </el-form-item>
                    <el-form-item label="员工姓名：">
                        <el-input v-model="employee.name" style="width: 240px;" placeholder="请输入员工姓名" />
                    </el-form-item>
                    <el-form-item label="手机号：">
                        <el-input v-model="employee.phone" style="width: 240px;" placeholder="请输入手机号" />
                    </el-form-item>
                    <el-form-item label="性别：">
                        <el-radio-group v-model="selectedRadioValue">
                            <el-radio value="0" size="default">男</el-radio>
                            <el-radio value="1" size="large">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="身份证号：">
                        <el-input v-model="employee.idNumber" style="width: 240px;" placeholder="请输入身份证号" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addEmployee">添加</el-button>
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
                        <el-button type="primary" size="small" @click="editSysUser(scope.row)">
                            修改
                        </el-button>
                        <el-button type="danger" size="small" @click="deleteById(scope.row)">
                            删除
                        </el-button>
                    </el-table-column>
                </el-table>
                <div v-else class="empty-state">
                    <el-empty :image="emptyImage" :image-size="200" description="暂无数据"/>
                </div>
            </div>

            <div class="footer">
                    <el-pagination
                        v-model:current-page="pageParams.pageNum"
                        v-model:page-size="pageParams.pageSize"
                        :page-sizes="[5, 10, 20, 50, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                    />
            </div>
        </div>
    </div>
</template>

<script setup>
import { GetEmployeePageList } from '@/api/employee'
import { ref, onMounted } from 'vue';

const employeeList = ref([]);
const emptyImage = '/src/assets/images/empty.png';

const selectedRadioValue = ref('0');
const dialogVisible = ref(false);

const defaultForm = {
    name: '',
    username: '',
    password: '',
    phone: '',
    idNumber: '',
    gender: ''
}
const employee = ref(defaultForm);
const pageParams = ref({
    pageNum: 1,
    pageSize: 5
})
const total = ref(0);

const addEmployee = () => {
    defaultForm.gender = selectedRadioValue.value;
    console.log(employee.value);
}

const fetchData = async () => {
    const { code, message, data } = await GetEmployeePageList(pageParams.value.pageNum, pageParams.value.pageSize);
    employeeList.value = data.records;
    total.value = data.totalCount;
}

onMounted(() => {
    fetchData();
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