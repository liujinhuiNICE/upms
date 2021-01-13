<template>
  <div class="handle">
    <div class="handle-header">
      <div class="searcht">查询条件</div>
      <div class="clearfix">
        <div class="item">
          <span>岗位名称</span>
          <el-input v-model.trim="param.postName" placeholder="请输入岗位名称" />
        </div>
        <div class="item">
          <span>岗位编码</span>
          <el-input v-model.trim="param.postCode" placeholder="请输入岗位编码" />
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
          prop="postName"
          label="岗位名称"
          align="center"
          width="300"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.postName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="postCode" label="岗位编码" align="center" />
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
        <el-form-item :rules="rules.postName" prop="postName" label="岗位名称">
          <el-input v-model.trim="ValidateForm.postName" />
        </el-form-item>
        <el-form-item :rules="rules.postCode" label="岗位编码" prop="postCode">
          <el-input v-model.trim="ValidateForm.postCode" />
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
  delPost, savePost, upPost, pagePost, batchDel
} from '@/api/post'

export default {
  name: 'Post',
  data() {
    return {
      title: '',
      dialogVisible: false,
      rules: {
        postName: [
          { required: true, message: '岗位名称不能为空' }
        ],
        postCode: [
          { required: true, message: '岗位编码不能为空' }
        ]
      },
      ValidateForm: {
        postCode: '',
        postName: '',
        postId: ''
      },
      tableData: [],
      total: 0,
      param: {
        page: 1,
        limit: 10,
        postName: '',
        postCode: ''
      },
      boxSelection: []
    }
  },
  async mounted() {
    await this.fetchData()
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
      const res = await pagePost({ page: this.param.page, limit: this.param.limit })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    async query() {
      const res = await pagePost({ ...this.param })
      this.tableData = res.data.records
      this.total = res.data.total
    },
    changeSelection(val) {
      this.boxSelection = []
      for (let i = 0; i < val.length; i++) {
        this.boxSelection.push(val[i].postId)
      }
    },
    addBtn() {
      this.title = '新增岗位'
      this.ValidateForm = {
        orgId: '',
        postCode: '',
        postName: '',
        postId: ''
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
      this.$confirm('此操作将删除勾选的岗位, 是否继续?', '提示', {
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
      this.$confirm('此操作将删除该岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delPost({ id: rows.postId })
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
          if (this.title === '新增岗位') {
            const res = await savePost({
              postCode: this.ValidateForm.postCode,
              postName: this.ValidateForm.postName
            })
            if (res.success) {
              this.dialogVisible = false
              this.fetchData()
              this.$message({
                type: 'success',
                message: '新增岗位成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          } else {
            const res = await upPost({ ...this.ValidateForm })
            if (res.success) {
              this.dialogVisible = false
              this.fetchData()
              this.$message({
                type: 'success',
                message: '修改岗位成功!'
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
      this.title = '修改岗位'
      this.ValidateForm = {
        postCode: rows.postCode,
        postName: rows.postName,
        postId: rows.postId
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
</style>
