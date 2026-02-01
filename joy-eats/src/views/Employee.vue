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
                    <el-button type="primary">+ 添加员工</el-button>
                </div>
            </div>
            <div class="main">
                <el-table v-if="employeeList.length > 0"
                    :data="employeeList"
                    style="width: 100%;"
                    >
                </el-table>
                <div v-else class="empty-state">
                    <el-empty :image="emptyImage" :image-size="200" description="暂无数据"/>
                </div>
            </div>
            <div class="footer">
                    <el-pagination
                        :page-sizes="[10, 20, 50, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="100"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
const employeeList = ref([]);
const emptyImage = '/src/assets/images/empty.png';
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
</style>