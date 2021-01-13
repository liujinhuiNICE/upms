<template>
  <div
    style="
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: #3a3f51;
    "
  >
    <div class="header_left">
      <a href="javascript:;" class="logoLink">
        <!-- <img src="./logo.png" alt="logo"> -->
        {{ systemName }}
      </a>
    </div>
    <div class="header_right">
      <div class="menu_l">
        <side-collapse class="sidecoll" />
        <bread-crumb class="bread" />
      </div>
      <div class="menu_r">
        <el-menu
          default-active=""
          background-color="#3a3f51"
          class="el-menu-demo"
          mode="horizontal"
          text-color="#ffffff"
        >
          <el-menu-item>
            <el-dropdown trigger="click">
              <el-badge :value="total" type="warning">
                <i class="el-icon-message-solid" />
              </el-badge>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <span style="display: block">我的通知</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
          <el-menu-item @click="toggleFull">
            <i class="el-icon-full-screen" />
          </el-menu-item>
          <el-menu-item>
            <el-dropdown trigger="click">
              <div style="height: 100%">
                <i class="el-icon-user" />
                <span style="color: #fff">{{ username }}</span>
                <i class="el-icon-caret-bottom" />
              </div>
              <el-dropdown-menu>
                <el-dropdown-item @click.native="resetPass">
                  <span style="display: block">修改密码</span>
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout">
                  <span style="display: block">退出系统</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
        </el-menu>
      </div>
      <!-- 修改密码界面 -->
      <el-dialog
        title="修改密码"
        width="40%"
        :visible.sync="cgpwdVisible"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
      >
        <el-form
          ref="dataForm"
          :model="dataForm"
          label-width="80px"
          :rules="dataFormRules"
          :size="size"
          label-position="right"
        >
          <el-form-item label="旧密码" prop="oldpassword">
            <el-input
              v-model.trim="dataForm.oldpassword"
              type="password"
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newpassword">
            <el-input
              v-model.trim="dataForm.newpassword"
              type="password"
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="newRepeatPassword">
            <el-input
              v-model.trim="dataForm.newRepeatPassword"
              type="password"
              auto-complete="off"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: 5px">
          <el-button
            :size="size"
            @click.native="cgpwdVisible = false"
          >取消</el-button>
          <el-button
            :size="size"
            type="primary"
            :loading="editLoading"
            @click="cgpwd"
          >确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import SideCollapse from '@/components/SideCollapse'
import BreadCrumb from '@/components/BreadCrumb'
import { mapGetters } from 'vuex'
import { changePsw, logout } from '@/api/user'
import { getMyNotify } from '@/api/notify'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
export default {
  name: 'TopMenu',
  components: {
    SideCollapse,
    BreadCrumb
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6) {
        callback(new Error('新密码不少于6位数'))
      } else {
        if (this.dataForm.newpassword !== '') {
          this.$refs.dataForm.validateField('newRepeatPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.dataForm.newpassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      total: '',
      rows: '',
      size: 'small',
      cgpwdVisible: false, // 修改界面是否显示
      editLoading: false, // 载入图标
      systemName: '通用用户权限系统',
      dataForm: {
        oldpassword: '',
        newpassword: '',
        newRepeatPassword: ''
      },
      // 设置属性
      dataFormRules: {
        oldpassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        newRepeatPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['username', 'userId'])
  },
  mounted: function() {
    this.notify()
  },
  methods: {
    /**
     * 查看通知记录
     */
    viewNotifyRecord(id) {
      var index = layer.open({
        type: 2,
        title: '通知公告查看',
        maxmin: true,
        shadeClose: false,
        area: ['800px', '520px'],
        content: prefix + '/view/' + id, // iframe的url
        success: function(layero, index) {
          // 已发布后
          var iframeWin = layero.find('iframe')[0]
          formView(iframeWin.contentWindow.document)
        },
        btn: ['取 消'],
        cancel: function(index) {
          return true
        }
      })
      layer.full(index)
    },

    notify() {
      getMyNotify().then((res) => {
        console.log(res, '==============')
        this.total = res.data.records.length
      })
    },
    setCgpwdVisible(cgpwdVisible) {
      this.cgpwdVisible = cgpwdVisible
    },
    toggleFull() {
      if (!screenfull.isEnabled) {
        this.$message({
          type: 'warning',
          message: 'you browser can not work'
        })
        return false
      }
      screenfull.toggle()
    },
    cgpwd() {
      this.$refs.dataForm.validate(async(valid) => {
        if (valid) {
          const res = await changePsw({
            newPassword: this.dataForm.newpassword,
            rawPassword: this.dataForm.oldpassword,
            userId: this.userId
          })
          if (res.success) {
            this.$alert('修改密码成功！请重新登录', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.$router.push({ path: '/login' })
                this.cgpwdVisible = false
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetPass() {
      this.cgpwdVisible = true
    },
    async logout() {
      const res = await logout()
      if (res.code === 200) {
        this.$store.dispatch('user/delToken', 'token')
        this.$router.push({ path: '/login' })
      }
    },
    connect() {
      const socket = new SockJS('http://localhost:8890/queue')
      this.stompClient = Stomp.over(socket)
      this.stompClient.connect({ userId: this.userId }, this.onConnected)
    },
    onConnected(frame) {
      this.stompClient.subscribe('/user/notifications', this.callback)
    },
    callback(msg) {
      const body = JSON.parse(msg.body)
      console.log(body, '===================')
      this.message = body.message
      this.title = body.title
    }
  }
}
</script>

<style lang="scss" scoped>
.header_left {
  height: 60px;
  font-size: 18px;
  font-weight: bolder;
  color: #fff;
  line-height: 60px;
  width: 200px;
  text-align: center;
  box-sizing: border-box;
  border-bottom: 1px solid #454b61;
}
.header_right {
  width: calc(100% - 200px);
}
.menu_r {
  float: right;
}
.logoLink {
  display: block;
  width: 100%;
  height: 60px;
  img {
    width: 24px;
    vertical-align: middle;
  }
  color: #fff;
  text-decoration: none;
}
.menu_l {
  float: left;
  height: 100%;
  margin-left: 10px;
  .sidecoll {
    float: left;
    margin-top: 21px;
  }
  .bread {
    float: left;
    margin: 23px 0 0 10px;
  }
}
::v-deep .el-badge__content.is-fixed {
  right: 15px;
  position: absolute;
  top: 15px;
}
</style>
