<template>
  <div class="handle">
    <div class="first">
      <el-card class="cpu">
        <div slot="header">
          <h3>CPU</h3>
        </div>
        <el-table :data="cpuTableData" style="width: 100%">
          <el-table-column prop="name" label="属性" width="280" />
          <el-table-column prop="value" label="值" />
        </el-table>
      </el-card>
      <el-card class="mem">
        <div slot="header">
          <h3>内存</h3>
        </div>
        <el-table :data="memTableData" style="width: 100%">
          <el-table-column prop="name" label="属性" width="180" />
          <el-table-column prop="sysMem" label="内存" width="180" />
          <el-table-column prop="jvmMem" label="JVM" />
        </el-table>
      </el-card>
    </div>
    <div class="second">
      <el-card class="sys">
        <div slot="header">
          <h3>服务器信息</h3>
        </div>
        <el-table :data="sysTableData" style="width: 100%">
          <el-table-column prop="name" label="服务器名称" width="180" />
          <el-table-column prop="ip" label="服务器IP" width="180" />
          <el-table-column prop="opSys" label="操作系统" />
          <el-table-column prop="cons" label="处理器架构" />
        </el-table>
      </el-card>
    </div>
    <div class="third">
      <el-card class="jvm">
        <div slot="header" class="jvm">
          <h3>Java虚拟机信息</h3>
        </div>
        <el-table :data="jvmTableData" style="width: 100%">
          <el-table-column prop="name" label="Java名称" width="280" />
          <el-table-column prop="startTime" label="启动时间" width="180" />
          <el-table-column prop="home" label="安装路径" />
          <el-table-column prop="userDir" label="	项目路径" />
          <el-table-column prop="version" label="		Java版本" />
          <el-table-column prop="runTime" label="		运行时长" />
        </el-table>
      </el-card>
    </div>
    <div class="fourth">
      <el-card class="fileos">
        <div slot="header">
          <h3>磁盘状态</h3>
        </div>
        <el-table :data="sysFiles" style="width: 100%">
          <el-table-column prop="dirName" label="盘符路径" width="180" />
          <el-table-column prop="sysTypeName" label="文件系统" width="180" />
          <el-table-column prop="typeName" label="盘符类型" />
          <el-table-column prop="total" label="	总大小" />
          <el-table-column prop="free" label="	可用大小" />
          <el-table-column prop="used" label="	已用大小" />
          <el-table-column prop="usage" label="	已用百分比" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { querySysInfo } from '@/api/monitor'
export default {
  name: 'Monitoring',
  data() {
    return {
      jvmData: {
        total: 916,
        max: null,
        free: null,
        version: '',
        home: 'C:\\Program Files\\Java\\jdk1.8.0_111\\jre',
        name: 'Java HotSpot(TM) 64-Bit Server VM',
        startTime: '2021-01-06 14:21:50',
        used: 222.88,
        usage: 24.33,
        runTime: '2分27秒427毫秒'
      },
      sysFiles: [],
      memTableData: [],
      cpuTableData: [],
      sysTableData: [],
      jvmTableData: []
    }
  },

  mounted() {
    this.getSysInfo()
  },
  methods: {
    getSysInfo() {
      querySysInfo().then((res) => {
        this.sysFiles = res.data.sysFiles
        this.getMemTableData(res.data)
        this.getCpuTableData(res.data)
        this.getSysTableData(res.data)
        this.getJvmTableData(res.data)
      })
    },
    getMemTableData(data) {
      this.memTableData = [
        {
          name: '总内存',
          sysMem: data.mem.total + 'GB',
          jvmMem: data.jvm.total + 'MB'
        },
        {
          name: '已用内存',
          sysMem: data.mem.used + 'GB',
          jvmMem: data.jvm.used + 'MB'
        },
        {
          name: '剩余内存',
          sysMem: data.mem.free + 'GB',
          jvmMem: data.jvm.free + 'MB'
        },
        {
          name: '使用率',
          sysMem: data.mem.usage + '%',
          jvmMem: data.jvm.usage + '%'
        }
      ]
    },
    getCpuTableData(data) {
      this.cpuTableData = [
        {
          name: '核心数',
          value: data.cpu.cpuNum + '核'
        },
        {
          name: '用户使用率',
          value: data.cpu.used + '%'
        },
        {
          name: '系统使用率',
          value: data.cpu.sys + '%'
        },
        {
          name: '当前空闲率',
          value: data.cpu.free + '%'
        }
      ]
    },
    getSysTableData(data) {
      this.sysTableData = [
        {
          name: data.sys.computerName,
          ip: data.sys.computerIp,
          opSys: data.sys.osName,
          cons: data.sys.osArch
        }
      ]
    },
    getJvmTableData(data) {
      this.jvmTableData = [
        {
          name: data.jvm.name,
          startTime: data.jvm.startTime,
          home: data.jvm.home,
          userDir: data.sys.userDir,
          version: data.jvm.version,
          runTime: data.jvm.runTime
        }
      ]
    }
  }
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
  overflow: scroll;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
  .first {
    flex: 2;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 20px;
    .cpu {
      flex: 1;
      margin-right: 20px;
    }
    .mem {
      flex: 1;
    }
  }
  .second,
  .third {
    margin-bottom: 20px;
    flex: 1;
  }
  .fourth {
    flex: 2;
  }
}
</style>
