<template>
    <div class="handle">
        <div class="handle-header">
            <div class="searcht">查询条件</div>
            <div class="clearfix">
                <div class="item">
                    <span>日志类型</span>
                    <el-select v-model.trim="param.logType" clearable placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <div class="item">
                    <span>查询起始时间</span>
                    <el-date-picker
                        v-model="param.startDateTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间" />
                </div>
                <div class="item">
                    <span>查询终止时间</span>
                    <el-date-picker
                        v-model="param.endDateTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        placeholder="选择日期时间" />
                </div>
                <div class="item">
                    <el-button type="primary" size="mini" class="query" @click="query">查询</el-button>
                    <el-button type="primary" plain size="mini" @click="resetForm">重置</el-button>
                </div>
            </div>
        </div>
        <div class="table">
            <el-table ref="multipleTable" border
                      :data="tableData" tooltip-effect="dark"
                      style="width: 100%"
                      height="100%">
                <el-table-column
                    align="center"
                    type="selection"
                    width="55" />
                <el-table-column prop="title" label="	日志标题"
                                 align="center" width="300"
                                 show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="创建人" align="center" />
                <el-table-column prop="logId" label="日志编号" align="center" />
                <el-table-column prop="logType" label="日志类型" align="center" />
                <el-table-column prop="remoteAddr" label="操作ip地址" align="center" />
                <el-table-column prop="requestParams" label="数据" align="center" />
                <el-table-column prop="requestUri" label="请求uri" align="center" />
                <el-table-column prop="exception" label="异常信息" align="center" />
                <el-table-column prop="createTime" label="创建时间" align="center" />
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
    </div>
</template>

<script>
import { logPage } from '@/api/user'

export default {
    name: 'ErrorLog',
    data() {
        return {
            options: [
                {
                    value: '0',
                    label: '操作日志',
                },
                {
                    value: '1',
                    label: '登录日志',
                },
                {
                    value: '9',
                    label: '错误日志',
                },
            ],
            tableData: [],
            total: 0,
            param: {
                page: 1,
                limit: 10,
                logType: '',
                startDateTime: '',
                endDateTime: '',
            },
        }
    },
    async mounted() {
        await this.fetchData()
    },
    methods: {
        async fetchData() {
            const res = await logPage({ page: this.param.page, limit: this.param.limit, logType: '9' })
            this.tableData = res.data.records
            this.total = res.data.total
        },
        async query() {
            const res = await logPage({ ...this.param })
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
