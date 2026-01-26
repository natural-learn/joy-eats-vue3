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
                    <el-form>
                        <div class="input-group">
                            <label for="username" style="font-weight: bold;">用户名</label><br/>
                            <el-input type="text" id="username" placeholder="请输入用户名"/>
                        </div>
                        <div class="input-group">
                            <label for="password" style="font-weight: bold; margin-top: 5px;">密码</label><br/>
                            <el-input type="password" id="password" placeholder="请输入密码"/>
                        </div>
                        <el-button type="primary">登录</el-button>
                    </el-form>
                    <el-link type="primary">注册账号</el-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
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