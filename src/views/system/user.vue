<template>
  <div class="handle">
    <div class="handle-header">
      <div class="searcht">查询条件</div>
      <div class="clearfix">
        <div class="item">
          <span>用户名称</span>
          <el-input v-model.trim="param.username" placeholder="请输入用户名称" />
        </div>
        <div class="item">
          <span>手机号</span>
          <el-input v-model.trim="param.phone" placeholder="请输入手机号" />
        </div>
        <div class="item">
          <span>用户状态</span>
          <el-select v-model.trim="param.lockFlag" clearable placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="item">
          <el-button type="primary" size="mini" class="query" @click="query">查询</el-button>
          <el-button type="primary" plain size="mini" @click="resetForm">重置</el-button>
        </div>
      </div>
    </div>
    <div class="table_box">
      <div class="department">
        <div class="searcht">查询组织</div>
        <el-input
          v-model.trim="filterText"
          placeholder="请输入组织名称"
        />

        <el-tree
          ref="tree"
          class="filter-tree"
          :expand-on-click-node="false"
          :data="data"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @node-click="treeClick"
        />
      </div>
      <div class="table">
        <div class="button-box">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addBtn"
          >
            新增
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteBtn"
          >
            批量删除
          </el-button>
        </div>
        <el-table
          ref="multipleTable"
          border
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          height="100%"
          @selection-change="changeSelection"
        >
          <el-table-column
            align="center"
            type="selection"
            width="55"
          />
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column
            prop="username"
            label="用户名称"
            align="center"
            width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column
            prop="lockFlag"
            label="用户状态"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.lockFlag"
                active-value="0"
                inactive-value="9"
                @change="switchChange($event,scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.row)"
              >
                <i class="el-icon-edit" />
                修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)"
              >
                <i class="el-icon-delete" />
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            v-if="total > 0"
            background
            :page-sizes="[10, 20, 30, 40]"
            :page-size="param.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :current-page="param.page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="ValidateForm" :model="ValidateForm" label-width="80px">
        <el-form-item :rules="rules.username" prop="username" label="用户名称">
          <el-input v-model.trim="ValidateForm.username" />
        </el-form-item>
        <el-form-item :rules="rules.phone" label="手机号码" prop="phone">
          <el-input v-model.number="ValidateForm.phone" />
        </el-form-item>
        <el-form-item v-if="title==='新增用户'" :rules="rules.password" label="用户密码" prop="password">
          <el-input v-model.trim="ValidateForm.password" type="password" />
        </el-form-item>
        <el-form-item :rules="rules.orgId" label="用户组织" prop="orgId">
          <el-tree
            ref="trees"
            :data="data"
            show-checkbox
            node-key="id"
            check-strictly
            :props="defaultProps"
            @check-change="handleNodeClick"
          />
        </el-form-item>
        <el-form-item :rules="rules.roles" label="角色" prop="roles">
          <el-select v-model.trim="ValidateForm.roles" multiple placeholder="请选择">
            <el-option v-for="item in userRole" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态">
          <el-radio-group v-model="ValidateForm.lockFlag">
            <el-radio :label="'0'">正常</el-radio>
            <el-radio :label="'9'">锁定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ValidateForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  switchStatus, userDelete, userList, userSave, userUpdate, batchDelete
} from '@/api/user'
import { userTree } from '@/api/org'
import { roleList } from '@/api/role'

export default {
  name: 'User',
  data() {
    const checkPhone = (rule, value, callback) => {
      const myPhone = /^1[3|4|5|7|8][0-9]{9}$/
      if (!myPhone.test(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      title: '',
      userRole: [],
      rules: {
        username: [
          { required: true, message: '用户名称不能为空' }
        ],
        roles: [
          { required: true, message: '角色不能为空' }
        ],
        phone: [
          { required: true, message: '手机号码不能为空' },
          { type: 'number', message: '手机号码必须为数字值' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '用户组织不能为空' }
        ],
        password: [
          { required: true, message: '用户密码不能为空' }
        ]
      },
      dialogVisible: false,
      ValidateForm: {
        avatar: '',
        orgId: '',
        password: '',
        phone: '',
        postId: '',
        roles: [],
        userId: '',
        username: '',
        lockFlag: '0'
      },
      options: [
        {
          value: '0',
          label: '正常'
        },
        {
          value: '9',
          label: '锁定'
        }
      ],
      tableData: [],
      total: 0,
      param: {
        page: 1,
        limit: 10,
        username: '',
        orgId: '',
        phone: '',
        lockFlag: ''
      },
      filterText: '',
      data: [{
        id: 1,
        label: '国土事业部_江西分部',
        children: [{
          id: 2,
          label: '研发部'
        }, {
          id: 3,
          label: '运维部'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'orgName'
      },
      boxSelection: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  async mounted() {
    await this.fetchData()
    const res = await userTree()
    this.data = res.data
    const rolelist = await roleList()
    this.userRole = rolelist.data
  },
  methods: {
    async query() {
      const res = await userList({ ...this.param })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    async treeClick(data) {
      const res = await userList({ ...this.param, orgId: data.id })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.param.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.param.page = val
      this.fetchData()
    },
    async fetchData() {
      const res = await userList({ page: this.param.page, limit: this.param.limit })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    handleNodeClick(data, checked, node) {
      if (checked === true) {
        this.ValidateForm.orgId = data.orgId
        this.$refs.trees.setCheckedKeys([data.orgId])
      } else if (this.ValidateForm.orgId === data.orgId) {
        this.$refs.trees.setCheckedKeys([data.orgId])
      }
    },
    switchChange(val, num) {
      this.$confirm('此操作将更改用户状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await switchStatus({
          statusCode: val,
          userId: num.userId
        })
        if (res.success) {
          num.lockFlag = val
          this.$message({
            type: 'success',
            message: '更改成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消更改'
        })
      })
    },
    changeSelection(val) {
      this.boxSelection = []
      for (let i = 0; i < val.length; i++) {
        this.boxSelection.push(val[i].userId)
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title === '新增用户') {
            userSave({ ...this.ValidateForm }).then((res) => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                })
                this.dialogVisible = false
                this.fetchData()
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }
            })
          } else {
            userUpdate({
              avatar: this.ValidateForm.avatar,
              orgId: this.ValidateForm.orgId,
              phone: this.ValidateForm.phone,
              postId: this.ValidateForm.postId,
              roles: this.ValidateForm.roles,
              userId: this.ValidateForm.userId,
              username: this.ValidateForm.username,
              lockFlag: this.ValidateForm.lockFlag
            }).then((res) => {
              if (res.success) {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.dialogVisible = false
                this.fetchData()
              } else {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },
    handleEdit(data) {
      this.title = '修改用户'
      this.ValidateForm = { ...data, phone: Number(data.phone) }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.trees.setCheckedKeys([data.orgId])
      })
    },
    addBtn() {
      this.title = '新增用户'
      this.ValidateForm = {
        avatar: '',
        orgId: '',
        password: '',
        phone: '',
        postId: '',
        roles: [],
        userId: '',
        username: '',
        lockFlag: '0'
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.trees.setCheckedKeys([])
      })
    },
    deleteBtn() {
      if (this.boxSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少勾选一项'
        })
        return
      }
      this.$confirm('此操作将删除勾选的用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDelete([...this.boxSelection]).then((res) => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.dialogVisible = false
            this.fetchData()
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      }).catch((res) => {
        if (res === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },
    handleDelete(rows) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userDelete({ id: rows.userId }).then((res) => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.dialogVisible = false
            this.param.page = 1
            this.param.limit = 10
            this.fetchData()
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
        })
      }).catch((res) => {
        if (res === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },
    resetForm() {
      this.param = {
        page: 1,
        limit: 10,
        username: '',
        phone: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.handle {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
    .handle-header {
        background-color: #fff;
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
        margin-bottom: 15px;
        flex-shrink: 0;
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
        .searcht {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .item {
            float: left;
            margin: 5px;
            .query {
                margin-left: 20px;
            }
            span {
                font-size: 14px;
                margin-right: 10px;
            }
        }
    }
    .btnList {
        text-align: center;
        height: 50px;
    }
    .page {
        padding-top: 10px;
    }
    .table_box{
        display: flex;
        background-color: #fff;
        min-height: 300px;
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
        .filter-tree{
            margin-top: 5px;
        }
        .searcht {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .department{
            width: 20%;
            box-sizing: border-box;
            padding: 15px;
            overflow: auto;
        }
        .table {
        width: 80%;
        padding: 16px;
        box-sizing: border-box;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .table_title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .button-box{
            margin-bottom: 10px;
        }
    }
    }
    .look {
        color: #29a7e1;
        cursor: pointer;
    }
    .clearfix::after{
        content: '';
        display: block;
        clear: both;
    }
}
</style>
<style>
.page .el-input__inner {
    height: 25px !important;
    width: 100px !important;
}
.page .el-input {
    height: 25px !important;
    width: 100px !important;
}
.el-pagination__editor .el-input__inner{
    width: auto !important;
}
.handle .el-table th > .cell {
    font-weight: 500 !important;
    color: #333 !important;
}
.handle .el-input__icon {
    line-height: 0 !important;
}
.clearfix .el-input {
    width: auto;
}

.clearfix .el-input__inner{
    height: 30px;
    line-height: 30px;
}
</style>
