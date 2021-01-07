<template>
    <div class="handle">
        <div class="handle-header">
            <div class="searcht">查询条件</div>
            <div class="clearfix">
                <div class="item">
                    <span>字典名称</span>
                    <el-input v-model.trim="param.dictName" placeholder="请输入字典名称" />
                </div>
                <div class="item">
                    <span>字典编码</span>
                    <el-input v-model.trim="param.dictCode" placeholder="请输入字典编码" />
                </div>
                <div class="item">
                    <span>字典状态</span>
                    <el-select v-model.trim="param.status" clearable placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
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
                <el-button
                    type="primary" plain
                    icon="el-icon-download"
                    size="mini">
                    导出
                </el-button>
            </div>
            <el-table ref="multipleTable" border
                      :data="tableData" tooltip-effect="dark"
                      style="width: 100%"
                      height="100%" @selection-change="changeSelection">
                <el-table-column
                    align="center"
                    type="selection"
                    width="55" />
                <el-table-column type="index" label="序号" align="center" width="50" />
                <el-table-column prop="dictName" label="字典名称"
                                 align="center" width="200"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.dictName }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="dictCode" label="字典编码" align="center" />
                <el-table-column prop="dictType" label="字典类型" align="center" />
                <el-table-column prop="displayOrder" label="排序" align="center" />
                <el-table-column prop="status" label="状态" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.status==='0'?'正常':'停用' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
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
                        <el-button
                            size="mini"
                            type="text"
                            @click="handleDict(scope.row)">
                            <i class="el-icon-menu" />
                            字典项
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination v-if="total > 0" background
                               :page-sizes="[10, 20, 30, 40]"
                               :page-size="param.limit"
                               layout="total, sizes, prev, pager, next, jumper" :total="total"
                               :current-page="param.page" @size-change="handleSizeChange"
                               @current-change="handleCurrentChange" />
            </div>
        </div>
        <el-dialog
            :title="title"
            :visible.sync="dialogVisible"
            width="500px">
            <el-form ref="ValidateForm" :model="ValidateForm" label-width="80px">
                <el-form-item :rules="rules.dictName" prop="dictName" label="字典名称">
                    <el-input v-model.trim="ValidateForm.dictName" />
                </el-form-item>
                <el-form-item :rules="rules.dictType" label="字典类型" prop="dictType">
                    <el-input v-model.trim="ValidateForm.dictType" />
                </el-form-item>
                <el-form-item :rules="rules.dictCode" label="字典编码" prop="dictCode">
                    <el-input v-model.trim="ValidateForm.dictCode" />
                </el-form-item>
                <el-form-item :rules="rules.displayOrder" label="排序" prop="displayOrder">
                    <el-input v-model.number="ValidateForm.displayOrder" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="ValidateForm.status">
                        <el-radio :label="'0'">启用</el-radio>
                        <el-radio :label="'1'">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="备注" prop="description">
                    <el-input v-model.trim="ValidateForm.description" type="textarea" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('ValidateForm')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="字典项管理"
            width="60%"
            class="dictDialog"
            :visible.sync="dictVisible">
            <div class="dict-box">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    @click="adddictBtn">
                    新增
                </el-button>
            </div>
            <el-table ref="dictTable" border
                      :data="dictData" tooltip-effect="dark"
                      style="width: 100%"
                      height="100%">
                <el-table-column type="index" label="序号" align="center" width="50" />
                <el-table-column prop="label" label="标签" align="center" />
                <el-table-column prop="sort" label="排序" align="center" />
                <el-table-column prop="value" label="值" align="center" />
                <el-table-column prop="description" label="描述" align="center" />
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            @click="dictEdit(scope.row)">
                            <i class="el-icon-edit" />
                            修改
                        </el-button>
                        <el-button
                            size="mini"
                            type="text"
                            @click="dictDelete(scope.row)">
                            <i class="el-icon-delete" />
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page">
                <el-pagination v-if="totals > 0" background
                               :page-sizes="[10, 20, 30, 40]"
                               :page-size="params.limit"
                               layout="total, sizes, prev, pager, next, jumper" :total="totals"
                               :current-page="params.page" @size-change="dictSizeChange"
                               @current-change="dictCurrentChange" />
            </div>
            <el-dialog
                :title="pictTitle"
                :visible.sync="dialogDict"
                append-to-body
                width="500px">
                <el-form ref="dictdateForm" :model="dictdateForm" label-width="80px">
                    <el-form-item :rules="pictRules.label" label="标签" prop="label">
                        <el-input v-model.trim="dictdateForm.label" />
                    </el-form-item>
                    <el-form-item :rules="pictRules.value" label="值" prop="value">
                        <el-input v-model.trim="dictdateForm.value" />
                    </el-form-item>
                    <el-form-item :rules="pictRules.description" label="描述" prop="description">
                        <el-input v-model.trim="dictdateForm.description" />
                    </el-form-item>
                    <el-form-item :rules="pictRules.sort" label="排序" prop="sort">
                        <el-input v-model.number="dictdateForm.sort" />
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogDict = false">取 消</el-button>
                    <el-button type="primary" @click="dicttForm('dictdateForm')">确 定</el-button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
import {
    deleteById, flushCache, queryDictByPage, queryDictList, saveDict, saveUpdate, deleteDictItem, addDictItem, pageDictItemByDictId, batchDelete, updateDictItem,
} from '@/api/dict'

export default {
    name: 'Dict',
    data() {
        return {
            title: '',
            pictTitle: '',
            dialogDict: false,
            dictVisible: false,
            dialogVisible: false,
            pictRules: {
                label: [
                    { required: true, message: '字典项标签不能为空' },
                ],
                value: [
                    { required: true, message: '字典项值不能为空' },
                ],
                description: [
                    { required: true, message: '字典项描述不能为空' },
                ],
                sort: [
                    { required: true, message: '字典项排序不能为空' },
                    { type: 'number', message: '字典项排序必须为数字值' },
                ],
            },
            rules: {
                dictName: [
                    { required: true, message: '字典名称不能为空' },
                ],
                dictType: [
                    { required: true, message: '字典类型不能为空' },
                ],
                dictCode: [
                    { required: true, message: '字典编码不能为空' },
                ],
                displayOrder: [
                    { required: true, message: '排序不能为空' },
                    { type: 'number', message: '排序必须为数字值' },
                ],
            },
            dictdateForm: {
                description: '',
                id: '',
                label: '',
                sort: 0,
                value: '',
            },
            ValidateForm: {
                alias: '',
                description: '',
                dictCode: '',
                dictName: '',
                dictType: '',
                displayOrder: '',
                status: '0',
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
            dictData: [],
            total: 0,
            param: {
                page: 1,
                limit: 10,
                dictCode: '',
                dictName: '',
                status: '',
            },
            totals: 0,
            params: {
                page: 1,
                limit: 10,
                dictId: '',
            },
            boxSelection: [],
            dictSelection: [],
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
            const res = await queryDictByPage({ page: this.param.page, limit: this.param.limit })
            this.tableData = res.data.records
            this.total = res.data.total
        },
        dictSizeChange(val) {
            this.params.limit = val
            this.fetchDictData()
        },
        dictCurrentChange(val) {
            this.params.page = val
            this.fetchDictData()
        },
        async fetchDictData() {
            const res = await pageDictItemByDictId({ ...this.params })
            this.dictData = res.data.records
            this.totals = res.data.total
        },
        async query() {
            const res = await queryDictByPage({ ...this.param })
            this.tableData = res.data.records
            this.total = res.data.total
        },
        changeSelection(val) {
            this.boxSelection = []
            for (let i = 0; i < val.length; i++) {
                this.boxSelection.push(val[i].dictId)
            }
        },
        dicttForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    if (this.pictTitle === '新增字典项信息') {
                        const res = await addDictItem({ ...this.dictdateForm })
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '新增字典项成功!',
                            })
                            this.dialogDict = false
                            this.fetchDictData()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message,
                            })
                        }
                    } else {
                        const res = await updateDictItem({ ...this.dictdateForm })
                        if (res.success) {
                            this.$message({
                                type: 'success',
                                message: '修改字典项成功!',
                            })
                            this.dialogDict = false
                            this.fetchDictData()
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
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    if (this.title === '新增字典') {
                        const res = await saveDict({ ...this.ValidateForm })
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
                        const res = await saveUpdate({ ...this.ValidateForm })
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
            this.title = '修改字典'
            this.ValidateForm = {
                alias: rows.alias,
                description: rows.description,
                dictCode: rows.dictCode,
                dictName: rows.dictName,
                dictType: rows.dictType,
                displayOrder: rows.displayOrder,
                id: rows.dictId,
                status: '0',
            }
            this.dialogVisible = true
        },
        dictEdit(rows) {
            this.pictTitle = '修改字典项信息'
            this.dictdateForm = {
                description: rows.description,
                id: rows.itemId,
                dictId: this.params.dictId,
                label: rows.label,
                sort: rows.sort,
                value: rows.value,
            }
            this.dialogDict = true
        },
        adddictBtn() {
            this.pictTitle = '新增字典项信息'
            this.dictdateForm = {
                description: '',
                dictId: this.params.dictId,
                label: '',
                sort: 0,
                value: '',
            }
            this.dialogDict = true
        },
        addBtn() {
            this.title = '新增字典'
            this.ValidateForm = {
                alias: '',
                description: '',
                dictCode: '',
                dictName: '',
                dictType: '',
                displayOrder: 0,
                status: '0',
            }
            this.dialogVisible = true
        },
        handleDict(rows) {
            this.params.dictId = rows.dictId
            this.fetchDictData()
            this.dictVisible = true
        },
        deleteBtn() {
            if (this.boxSelection.length === 0) {
                this.$message({
                    type: 'error',
                    message: '请至少勾选一项',
                })
                return
            }
            this.$confirm('此操作将删除勾选的字典, 是否继续?', '提示', {
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
            this.$confirm('此操作将删除该字典, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteById({ id: rows.dictId }).then((res) => {
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
        dictDelete(rows) {
            this.$confirm('此操作将删除该字典项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                deleteDictItem({ id: rows.itemId }).then((res) => {
                    if (res.success) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                        })
                        this.dialogDict = false
                        this.fetchDictData()
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
        resetForm() {
            this.param = {
                page: 1,
                limit: 10,
                xmmc: '',
                ywlx: '',
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.dict-box{
    margin-bottom: 10px;
}
.dictDialog{
    ::v-deep .el-dialog__body{
        max-height: 500px;
    }
    ::v-deep .el-table__body-wrapper{
        height: 220px!important;
    }
}
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
