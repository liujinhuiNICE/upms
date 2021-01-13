<template>
  <div class="handle">
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
        row-key="menuId"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        height="100%"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="0" align="center" width="50">
          <template slot="header">
            <el-checkbox
              :model="checkedAll"
              @change="handleCheckedAll"
            />
          </template>
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checked"
              @change="handleCheckedOne(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="menuName"
          label="菜单名称"
          align="center"
          width="300"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.menuName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center" width="60" />
        <el-table-column label="图标" align="center" width="50">
          <template slot-scope="scope">
            <i :class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="menuType" label="菜单类型" align="center" />
        <el-table-column prop="path" label="菜单路径" align="center" />
        <el-table-column prop="permission" label="权限标识" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleAdd(scope.row)"
            >
              <i class="el-icon-plus" />
              新增
            </el-button>
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
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="ValidateForm" :model="ValidateForm" label-width="80px">
        <el-form-item :rules="rules.menuName" prop="menuName" label="菜单名称">
          <el-input v-model.trim="ValidateForm.menuName" />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="ValidateForm.menuType">
            <el-radio :label="'0'">菜单</el-radio>
            <el-radio :label="'1'">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ValidateForm.menuType === '0'" :rules="rules.path" prop="path" label="菜单路径">
          <el-input v-model.trim="ValidateForm.path" />
        </el-form-item>
        <el-form-item v-if="ValidateForm.menuType === '1'" :rules="rules.permission" prop="permission" label="权限标识">
          <el-input v-model.trim="ValidateForm.permission" />
        </el-form-item>
        <el-form-item :rules="rules.sort" prop="sort" label="排序">
          <el-input v-model.number="ValidateForm.sort" />
        </el-form-item>
        <el-form-item v-if="ValidateForm.menuType === '0'" label="图标">
          <MenuIcon v-model.trim="ValidateForm.icon" :value="ValidateForm.icon" @selected="icons" />
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
  addMenu, delMenu, treeAll, menuUp, batchDel
} from '@/api/authority'
import MenuIcon from '@/components/iconSelector'

export default {
  name: 'Authority',
  components: {
    MenuIcon
  },
  data() {
    return {
      checkedAll: false,
      title: '',
      dialogVisible: false,
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空' }
        ],
        sort: [
          { required: true, message: '排序不能为空' },
          { type: 'number', message: '排序必须为数字值' }
        ],
        path: [
          { required: true, message: '菜单路径不能为空' }
        ],
        permission: [
          { required: true, message: '权限标识不能为空' }
        ]
      },
      ValidateForm: {
        icon: '',
        menuId: '',
        menuName: '',
        parentId: '',
        path: '',
        permission: '',
        sort: 0,
        menuType: '0'
      },
      tableData: [],
      boxSelection: []
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    icons(val) {
      this.ValidateForm.icon = val
    },
    // boolValue接收一个布尔值
    checkOne(obj, boolValue) {
      obj.checked = boolValue
      // 判断存不存在children,存在就递归赋值
      if (obj.children) {
        obj.children.forEach((item) => this.checkOne(item, boolValue))
      }
    },

    // 绑定每一行checkbox的change事件
    handleCheckedOne(row) {
      if (row.checked) {
        this.checkOne(row, true)
      } else {
        this.checkOne(row, false)
      }
    },
    checkAll(arr, boolValue) {
      arr.forEach((item) => {
        item.checked = boolValue
        // children同样是数组
        if (item.children) {
          this.checkAll(item.children, boolValue)
        }
      })
    },

    handleCheckedAll(scope) {
      // 实际上scope并没有什么用处，仅为了解决上面提到的表头checkbox不显示的bug
      // console.log(scope.column)
      this.checkedAll = scope
      if (this.checkedAll) {
        this.checkAll(this.tableData, true)
      } else {
        this.checkAll(this.tableData, false)
      }
    },
    async fetchData() {
      const limit = await treeAll()
      this.tableData = limit.data
      this.checkedAdd(this.tableData)
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (this.title === '新增菜单') {
            const res = await addMenu({ ...this.ValidateForm })
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
          } else {
            const res = await menuUp({ ...this.ValidateForm })
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
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addBtn() {
      this.title = '新增菜单'
      this.dialogVisible = true
      this.ValidateForm = {
        icon: '',
        menuName: '',
        parentId: '',
        path: '',
        permission: '',
        sort: 0,
        menuType: '0'
      }
    },
    handleAdd(rows) {
      this.title = '新增菜单'
      this.dialogVisible = true
      this.ValidateForm = {
        icon: '',
        menuName: '',
        parentId: rows.menuId,
        path: '',
        permission: '',
        sort: 0,
        menuType: '0'
      }
    },
    handleEdit(rows) {
      this.title = '修改菜单'
      this.ValidateForm = {
        icon: rows.icon,
        menuId: rows.menuId,
        menuName: rows.menuName,
        parentId: rows.parentId,
        path: rows.path,
        permission: rows.permission,
        sort: rows.sort,
        menuType: rows.menuType
      }
      this.dialogVisible = true
    },
    checkedAdd(obj) {
      obj.forEach((item) => {
        // eslint-disable-next-line no-unused-vars
        for (const key in item) {
          this.$set(item, 'checked', false)
        }
        if (item.children) {
          this.checkedAdd(item.children)
        }
      })
    },
    checkedData(obj) {
      obj.forEach((item) => {
        if (item.checked) {
          this.boxSelection.push(item.menuId)
        } else if (item.children) {
          this.checkedData(item.children)
        }
      })
    },
    deleteBtn() {
      this.boxSelection = []
      this.checkedData(this.tableData)
      console.log(this.boxSelection)
      if (this.boxSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少勾选一项'
        })
        return
      }
      this.$confirm('此操作将删除勾选的菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDel([...this.boxSelection]).then((res) => {
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
      this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMenu({ id: rows.menuId }).then((res) => {
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
.el-scrollbar{
    max-width: 300px;
    max-height: 150px;
    overflow-y: auto;
    overflow-x: hidden;
}
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
