<template>
    <div class="handle">
        <div class="handle-header">
            <div class="searcht">查询条件</div>
            <div class="clearfix">
                <div class="item">
                    <span>通知标题</span>
                    <el-input
                        v-model.trim="param.notifyTitle"
                        placeholder="请输入通知标题"
                        size="mini"
                        style="width: 180px" />
                </div>
                <div class="item">
                    <span>发布状态</span>
                    <el-select
                        v-model.trim="param.notifyState"
                        clearable
                        placeholder="请选择"
                        size="mini"
                        style="width: 120px">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
                <div class="item">
                    <span>创建时间</span>
                    <el-date-picker
                        v-model="param.createStartDateTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="开始时间"
                        size="mini"
                        style="width: 180px" />
                </div>
                <div class="item">
                    <span>-</span>
                    <el-date-picker
                        v-model="param.createEndDateTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="终止时间"
                        size="mini"
                        style="width: 180px" />
                </div>
                <div class="item">
                    <span>发布时间</span>
                    <el-date-picker
                        v-model="param.publishStartDateTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="开始时间"
                        size="mini"
                        style="width: 180px" />
                </div>
                <div class="item">
                    <span>-</span>
                    <el-date-picker
                        v-model="param.publishEndDateTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="终止时间"
                        size="mini"
                        style="width: 180px" />
                </div>
                <div class="item">
                    <el-button type="primary" size="mini"
                               class="query" @click="query">
                        查询
                    </el-button>
                    <el-button type="primary" plain
                               size="mini" @click="resetForm">
                        重置
                    </el-button>
                </div>
            </div>
        </div>
        <div class="table">
            <div class="button-box">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    @click="addNotify">
                    新增
                </el-button>
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="batchDelete">
                    批量删除
                </el-button>
                <el-button type="primary" plain icon="el-icon-download" size="mini">
                    导出
                </el-button>
            </div>
            <el-table
                ref="multipleTable"
                border
                :data="tableData"
                tooltip-effect="dark"
                height="100%"
                @selection-change="changeSelection">
                <el-table-column align="center" type="selection" width="55" />
                <el-table-column
                    prop="title"
                    label="通知标题"
                    align="center"
                    width="300"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="notifyType" label="通知类型" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.notifyType === "1" ? "公告" : "通知" }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="notifyState" label="发布状态" align="center">
                    <template slot-scope="scope">
                        <span>{{
                            scope.row.notifyState === "1" ? "已发布" : "未发布"
                        }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="发布时间" align="center" />
                <el-table-column prop="createBy" label="发布人" align="center" />
                <el-table-column prop="createTime" label="创建时间" align="center" />
                <el-table-column prop="updateBy" label="修改人" align="center" />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="dictEdit(scope.row)">
                            <i class="el-icon-edit" />
                            修改
                        </el-button>
                        <el-button size="mini" type="text" @click="dictDelete(scope.row)">
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
                    @current-change="handleCurrentChange" />
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="addNotifyDal"
            width="80%"
            :modal="false">
            <el-form
                ref="addNotifyForm"
                :model="addNotifyForm"
                status-icon
                :rules="rules"
                label-width="100px">
                <el-form-item label="通知标题：" prop="title">
                    <el-input v-model="addNotifyForm.title" autocomplete="off" />
                </el-form-item>
                <el-form-item label="通知类型：" prop="type">
                    <el-select v-model="addNotifyForm.notifyType" placeholder="请选择">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="接收人" prop="receiveUser">
                    <el-input v-model="addNotifyForm.receiveUser" />
                </el-form-item>
                <el-form-item label="通知内容" prop="notifyContent">
                    <!-- <el-input v-model="addNotifyForm.notifyContent"></el-input> -->
                    <div id="editor" class="editor" />
                </el-form-item>
                <el-switch
                    v-model="addNotifyForm.isPublish"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="立即发布"
                    inactive-text="延时发布" />
            </el-form>
            <span slot="footer">
                <el-button @click="addNotifyDal = false">取 消</el-button>
                <el-button type="primary" @click="pubNotify">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    queryNotifyByPage,
    addNotify,
    updateNotify,
    delNotify,
    batchDelNotify,
} from '@/api/notify'
import E from 'wangeditor'

export default {
    name: 'Notice',
    data() {
        return {
            addNotifyDal: false,
            boxSelection: [],
            param: {
                page: 1,
                limit: 10,
                notifyTitle: '',
                notifyState: '',
                createStartDateTime: '',
                createEndDateTime: '',
                publishStartDateTime: '',
                publishEndDateTime: '',
            },
            options: [
                {
                    value: '1',
                    label: '已发布',
                },
                {
                    value: '-1',
                    label: '未发布',
                },
            ],
            typeOptions: [
                {
                    value: '0',
                    label: '公告',
                },
                {
                    value: '1',
                    label: '通知',
                },
            ],
            tableData: [],
            total: 0,
            addNotifyForm: {
                title: '',
                notifyType: '0',
                receiveUser: '',
                notifyContent: '',
                isPublish: true,
                remark: '',
            },
            rules: {
                title: [
                    { required: true, message: '通知标题不能为空', trigger: 'blur' },
                ],
            },
        }
    },
    async mounted() {
        await this.fetchData()
    },
    methods: {
        pubNotify() {
            this.$confirm('确认增加该通知?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.addNotifyDal = false
                    addNotify(this.addNotifyForm).then((res) => {
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '新增成功!',
                            })
                            this.fetchData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message,
                            })
                        }
                    })
                })
                .catch((res) => {
                    if (res === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: '已取消新增',
                        })
                    }
                })
        },
        addNotify() {
            this.addNotifyDal = true
            const editor = new E('#editor')
            editor.create()
        },
        dictDelete(rows) {
            console.log(rows, '=====')
            this.$confirm('此操作将删除该通知, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    delNotify({ id: rows.notifyId }).then((res) => {
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                            })
                            this.fetchData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message,
                            })
                        }
                    })
                })
                .catch((res) => {
                    if (res === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                        })
                    }
                })
        },
        batchDelete() {
            if (this.boxSelection.length === 0) {
                this.$message({
                    type: 'error',
                    message: '请至少勾选一项',
                })
                return
            }
            this.$confirm('此操作将删除勾选的通知, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    batchDelete([...this.boxSelection]).then((res) => {
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                            })
                            this.dialogVisible = false
                            this.fetchData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message,
                            })
                        }
                    })
                })
                .catch((res) => {
                    if (res === 'cancel') {
                        this.$message({
                            type: 'info',
                            message: '已取消删除',
                        })
                    }
                })
        },
        dictEdit(rows) {},
        async fetchData() {
            const res = await queryNotifyByPage({
                page: this.param.page,
                limit: this.param.limit,
            })
            this.tableData = res.data.records
            this.total = res.data.total
        },
        async query() {
            const res = await queryNotifyByPage({ ...this.param })
            this.tableData = res.data.records
            this.total = res.data.total
        },
        changeSelection(val) {
            this.boxSelection = []
            for (let i = 0; i < val.length; i++) {
                this.boxSelection.push(val[i].dictId)
            }
        },
        handleSizeChange(val) {
            this.param.limit = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.param.page = val
            this.fetchData()
        },
        resetForm() {
            this.param = {
                page: 1,
                limit: 10,
                logType: '',
                startDateTime: '',
                endDateTime: '',
            }
        },
    },
}
</script>

<style scoped lang="scss">
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
  .clearfix::after {
    content: "";
    display: block;
    clear: both;
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
    .button-box {
      margin-bottom: 10px;
    }
  }
  .btnList {
    text-align: center;
    height: 50px;
  }
  .page {
    padding-top: 10px;
  }
}
</style>
