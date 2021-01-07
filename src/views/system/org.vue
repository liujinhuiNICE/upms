<template>
    <div class="handle">
        <div class="handle-header">
            <div class="searcht">查询条件</div>
            <div class="clearfix">
                <div class="item">
                    <span>组织代码</span>
                    <el-input v-model.trim="param.orgCode" placeholder="请输入组织代码" />
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
                    @click="addBtn">
                    新增
                </el-button>
                <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini" @click="deleteBtn">
                    批量删除
                </el-button>
            </div>
            <el-table ref="multipleTable" border
                      row-key="id"
                      :data="tableData" tooltip-effect="dark"
                      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                      style="width: 100%"
                      height="100%">
                <el-table-column type="0" align="center" width="50">
                    <template slot="header">
                        <el-checkbox :model="checkedAll"
                                     @change="handleCheckedAll" />
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.checked"
                                     @change="handleCheckedOne(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="orgName" label="组织名称"
                                 align="center" width="300"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.orgName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center" />
                <el-table-column prop="orgCode" label="组织代码" align="center" />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            @click="handleAdd(scope.row)">
                            <i class="el-icon-plus" />
                            新增
                        </el-button>
                        <el-button
                            size="mini"
                            type="text"
                            @click="handleEdit(scope.row)">
                            <i class="el-icon-edit" />
                            修改
                        </el-button>
                        <el-button
                            size="mini"
                            type="text"
                            @click="handleDelete(scope.row)">
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
            width="500px">
            <el-form ref="ValidateForm" :model="ValidateForm" label-width="80px">
                <el-form-item :rules="rules.orgName" prop="orgName" label="组织名称">
                    <el-input v-model.trim="ValidateForm.orgName" />
                </el-form-item>
                <el-form-item :rules="rules.orgCode" label="组织代码" prop="orgCode">
                    <el-input v-model.number="ValidateForm.orgCode" />
                </el-form-item>
                <el-form-item :rules="rules.sort" label="排序" prop="sort">
                    <el-input v-model.number="ValidateForm.sort" />
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
    addOrg, deleteOrg, detailsOrg, editOrg, treeOrg, userTree, orgPage, batchDelete,
} from '@/api/org'

export default {
    name: 'Org',
    data() {
        return {
            checkedAll: false,
            dialogVisible: false,
            title: '',
            rules: {
                orgName: [
                    { required: true, message: '组织名称不能为空' },
                ],
                orgCode: [
                    { required: true, message: '组织代码不能为空' },
                ],
                sort: [
                    { required: true, message: '排序不能为空' },
                    { type: 'number', message: '排序必须为数字值' },
                ],
            },
            ValidateForm: {
                orgName: '',
                orgId: '',
                orgCode: '',
                parentId: '',
                sort: 0,
            },
            options: [
                {
                    value: '0',
                    label: '正常',
                },
                {
                    value: '9',
                    label: '停用',
                },
            ],
            tableData: [],
            param: {
                orgCode: '',
            },
            boxSelection: [],
        }
    },
    async mounted() {
        await this.fetchData()
    },
    methods: {
        async fetchData() {
            const res = await treeOrg()
            this.tableData = res.data
        },
        async query() {
            const res = await treeOrg({ ...this.param })
            this.tableData = res.data
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
        addBtn() {
            this.title = '新增组织'
            this.ValidateForm = {
                orgName: '',
                orgCode: '',
                parentId: '',
                sort: 0,
            }
            this.dialogVisible = true
        },
        handleAdd(rows) {
            this.title = '新增组织'
            this.ValidateForm = {
                orgName: '',
                orgCode: '',
                parentId: rows.orgId,
                sort: 0,
            }
            this.dialogVisible = true
        },
        checkedData(obj) {
            obj.forEach((item) => {
                if (item.checked) {
                    this.boxSelection.push(item.orgId)
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
                    message: '请至少勾选一项',
                })
                return
            }
            this.$confirm('此操作将删除勾选的组织, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
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
            }).catch((res) => {
                if (res === 'cancel') {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    })
                }
            })
        },
        handleDelete(rows) {
            this.$confirm('此操作将删除该组织, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteOrg({ id: rows.orgId }).then((res) => {
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
            }).catch((res) => {
                if (res === 'cancel') {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                    })
                }
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    if (this.title === '新增组织') {
                        const res = await addOrg({ ...this.ValidateForm })
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '新增成功!',
                            })
                            this.dialogVisible = false
                            this.fetchData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message,
                            })
                        }
                    } else {
                        const res = await editOrg({ ...this.ValidateForm })
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '修改成功!',
                            })
                            this.dialogVisible = false
                            this.fetchData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message,
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
            this.title = '修改组织'
            this.ValidateForm = {
                orgName: rows.orgName,
                orgCode: rows.orgCode,
                orgId: rows.orgId,
                parentId: rows.parentId,
                sort: rows.sort,
            }
            this.dialogVisible = true
        },
        resetForm() {
            this.param = {
                orgCode: '',
            }
        },
    },
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
