<template>
    <div class="login-root">
        <div class="login-container">
            <div class="left">
                <img src="../assets/images/login_food.png" alt="">
            </div>
            <div class="right">
                <div class="login-box">
                    <div class="top">
                        <img src="/favicon.ico" alt="">
                        <h2>悦享外卖</h2>
                    </div>
                    <el-form 
                        :model="form"
                        :rules="rules"
                        ref="formRef"
                        label-position="top">
                        <el-form-item label="用户名" prop="username">
                            <el-input type="text" placeholder="请输入用户名" v-model="form.username"/>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
                        </el-form-item>
                        <el-button type="primary" @click="login">登录</el-button>
                    </el-form>
                    <el-link type="primary">注册账号</el-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Login } from '@/api/employee'
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApp } from '@/stores/app';

const route = useRoute();
const router = useRouter();

const form = reactive({
    username: 'admin',
    password: '123456'
})

const formRef = ref();

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 8, message: '用户名长度在3到8个字符之间', trigger: 'change' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 10, message: '密码长度在6到10个字符之间', trigger: 'change' }
    ]
})

const login = async () => {
    const { code, data, message} = await Login(form);
    if (code === 1) {
        ElMessage.success('登录成功');
        console.log(`route = ${route.query.redirect}`);
        const targetPath = decodeURIComponent(route.query.redirect);
        if (targetPath.startsWith('http')) {
            // 如果是完整的URL，直接跳转
            window.location.href = targetPath;
        } else if (targetPath.startsWith('/')) {
            // 如果是内部路由地址
            router.push(targetPath);
        } else {
            console.log('跳转到首页');
            router.push('/home'); // 默认跳转到首页
        }
        useApp().initToken(data.token);
    } else {
        console.log(`异常信息：${message}`);
        ElMessage.error(`登录失败：${message}`);
    }
};
</script>

<style scoped lang="scss">
.login-root {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f5f5f5;
    .login-container {
        display: flex;
        background-color: white;
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        .left {
            img {
                border-radius: 20px;
            }
        }
        .right {
            display: flex;
            justify-content: center;
            margin-left: 60px;
            margin-right: 60px;
            .login-box {
                margin-top: 20px;
                .top {
                    display: flex;
                    justify-content: center;
                    img {
                        width: 40px;
                        height: 40px;
                        margin-right: 10px;
                    }
                }
                .el-form {
                    margin-top: 30px;
                    .input-group {
                        margin-bottom: 10px;
                    }
                    .el-button {
                        width: 200px;
                        border-radius: 15px;
                    }
                }
            }
        }
    }
}
</style>