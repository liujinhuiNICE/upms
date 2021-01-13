<template>
  <div class="handle">
    <div class="handle-header">
      <div class="searcht">查询条件</div>
      <div class="clearfix">
        <div class="item">
          <span>角色名称</span>
          <el-input v-model.trim="param.roleName" placeholder="请输入角色名称" />
        </div>
        <div class="item">
          <span>角色编号</span>
          <el-input v-model.trim="param.roleCode" placeholder="请输角色编号" />
        </div>
        <div class="item">
          <el-button type="primary" size="mini" class="query" @click="query">查询</el-button>
          <el-button type="primary" plain size="mini" @click="resetForm">重置</el-button>
        </div>
      </div>
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
        <el-button
          type="primary"
          plain
          icon="el-icon-download"
          size="mini"
        >
          导出
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
          prop="roleName"
          label="角色名称"
          align="center"
          width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建人" align="center" />
        <el-table-column prop="roleCode" label="角色编号" align="center" />
        <el-table-column prop="roleDesc" label="角色描述" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
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
            <el-button
              size="mini"
              type="text"
              @click="handleAuthority(scope.row)"
            >
              <i class="el-icon-share" />
              权限分配
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
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="ValidateForm" :model="ValidateForm" label-width="80px">
        <el-form-item :rules="rules.roleName" prop="roleName" label="角色名称">
          <el-input v-model.trim="ValidateForm.roleName" />
        </el-form-item>
        <el-form-item :rules="rules.roleCode" prop="roleCode" label="角色编号">
          <el-input v-model.trim="ValidateForm.roleCode" />
        </el-form-item>
        <el-form-item :rules="rules.roleDesc" prop="roleDesc" label="角色描述">
          <el-input v-model.trim="ValidateForm.roleDesc" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ValidateForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="角色权限分配"
      :visible.sync="dialogAuthority"
      width="500px"
    >
      <el-tree
        ref="tree"
        :data="data"
        show-checkbox
        node-key="id"
        highlight-current
        :props="defaultProps"
        @check="treeChange"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthority = false">取 消</el-button>
        <el-button type="primary" @click="authoritySave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRole, roleDelete, roleMenu, rolePage, roleUpdate, batchDelete
} from '@/api/role'
import { treeAll } from '@/api/authority'

export default {
  name: 'Role',
  data() {
    return {
      data: [{
        id: 1,
        label: '系统管理',
        children: [{
          id: 2,
          label: '用户管理'
        }, {
          id: 3,
          label: '角色管理'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dialogAuthority: false,
      dialogVisible: false,
      title: '',
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空' }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空' }
        ],
        roleCode: [
          { required: true, message: '角色编号不能为空' }
        ]
      },
      ValidateForm: {
        roleCode: '',
        roleDesc: '',
        roleName: '',
        roleId: ''
      },
      tableData: [],
      total: 0,
      param: {
        page: 1,
        limit: 10,
        roleName: '',
        roleCode: ''
      },
      boxSelection: []
    }
  },
  async mounted() {
    await this.fetchData()
    const treeData = await treeAll()
    this.data = treeData.data
  },
  methods: {
    handleSizeChange(val) {
      this.param.limit = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.param.page = val
      this.fetchData()
    },
    async fetchData() {
      const res = await rolePage({ page: this.param.page, limit: this.param.limit })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    handleAuthority(rows) {
      this.dialogAuthority = true
      this.ValidateForm.roleId = rows.roleId
      const checkList = rows.menuIds.split(',')
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(checkList)
      })
    },
    async authoritySave() {
      const trees = this.$refs.tree.getCheckedKeys().join(',')
      const res = await roleMenu({ menuIds: trees, roleId: this.ValidateForm.roleId })
      if (res.success) {
        this.$message({
          type: 'success',
          message: '权限分配成功!'
        })
        this.fetchData()
        this.dialogAuthority = false
      }
    },
    async query() {
      const res = await rolePage({ ...this.param })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    treeChange(data, node, val) {
      console.log(this.$refs.tree.getCheckedNodes(true))
    },
    changeSelection(val) {
      this.boxSelection = []
      for (let i = 0; i < val.length; i++) {
        this.boxSelection.push(val[i].roleId)
      }
    },
    addBtn() {
      this.title = '新增角色'
      this.ValidateForm = {
        roleCode: '',
        roleDesc: '',
        roleName: '',
        roleId: ''
      }
      this.dialogVisible = true
    },
    deleteBtn() {
      if (this.boxSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少勾选一项'
        })
        return
      }
      this.$confirm('此操作将删除勾选的角色, 是否继续?', '提示', {
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
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await roleDelete({ id: rows.roleId })
        this.param.page = 1
        this.param.limit = 10
        this.fetchData()
        if (res.success) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      }).catch((res) => {
        if (res === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (this.title === '新增角色') {
            const res = await addRole({
              roleCode: this.ValidateForm.roleCode,
              roleDesc: this.ValidateForm.roleDesc,
              roleName: this.ValidateForm.roleName
            })
            if (res.success) {
              this.dialogVisible = false
              this.fetchData()
              this.$message({
                type: 'success',
                message: '新增角色成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          } else {
            const res = await roleUpdate({ ...this.ValidateForm })
            if (res.success) {
              this.dialogVisible = false
              this.fetchData()
              this.$message({
                type: 'success',
                message: '修改角色成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleEdit(rows) {
      this.title = '修改角色'
      this.ValidateForm = {
        roleCode: rows.roleCode,
        roleDesc: rows.roleDesc,
        roleName: rows.roleName,
        roleId: rows.roleId
      }
      this.dialogVisible = true
    },
    resetForm() {
      this.param = {
        page: 1,
        limit: 10,
        xmmc: '',
        ywlx: ''
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
    .table {
        width: 100%;
        padding: 16px;
        box-sizing: border-box;
        background-color: #fff;
        flex: 1;
        display: flex;
        flex-direction: column;
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
        .table_title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .button-box{
            margin-bottom: 10px;
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
.handle .el-input {
    height: 30px !important;
    width: 200px !important;
    line-height: 30px !important;
}
.handle .el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
    width: 200px !important;
}
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
/* .handle .el-table--border td,
th {
  border-bottom: 1px solid #a3c1ea;
}
.handle .el-table td {
  border-right: 1px solid #a3c1ea;
}
.handle .el-table {
  border: 1px solid #a3c1ea;
}
.handle .el-table--border th {
  border-right: 1px solid #a3c1ea;
}
.handle .el-table th.is-leaf {
  border-bottom: 1px solid #a3c1ea;
} */
</style>
