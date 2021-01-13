<template>
  <div class="login-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules2"
      status-icon
      label-position="left"
      label-width="0px"
      class="demo-ruleForm login-page"
    >
      <h3 class="title">系统登录</h3>
      <el-form-item prop="username">
        <el-input
          v-model.trim="ruleForm.username"
          type="text"
          auto-complete="off"
          placeholder="用户名/手机号/邮箱"
          @keyup.enter.native="handleSubmit"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model.trim="ruleForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleSubmit"
        />
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          style="width: 100%"
          :loading="logining"
          @click="handleSubmit"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getToken } from '@/api/user'

export default {
  data() {
    return {
      logining: false,
      ruleForm: {
        username: '',
        password: ''
      },
      rules2: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.logining = true
          getToken({
            username: this.ruleForm.username,
            password: this.ruleForm.password
          })
            .then((res) => {
              this.logining = false
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '登录成功！'
                })
                this.$store.dispatch('user/setToken', res.data.token)
                // this.$store.dispatch('user/getUserInfo')
                // this.$axios
                //     .post(`${process.env.VUE_APP_BASE_API}/api/user/getLoginUserInfo`, {}, {
                //         headers: {
                //             'Content-Type': 'x-www-form-urlencoded',
                //             Authorization: res.data.token,
                //         },
                //     })
                //     .then((res) => {

                //     })
                this.$router.push({ path: '/' })
              } else {
                this.logining = false
                this.$alert(res.message, '提示', {
                  confirmButtonText: '好的'
                })
              }
            })
            .catch(() => {
              this.logining = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.title {
  margin-bottom: 20px;
}
.login-container {
  width: 100%;
  height: 100%;
  background: #4373a5;

  /* 登录框上下对齐 */
  display: flex;
  align-items: center;
}
.login-page {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 0px auto;
  width: 350px;
  padding: 20px 35px 35px 15px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
label.el-checkbox.rememberme {
  margin: 0px 0px 15px;
  text-align: left;
}
</style>
