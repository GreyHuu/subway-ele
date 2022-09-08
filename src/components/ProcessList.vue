<template>
  <a-layout style="height: 100%">
    <a-layout style="height: 100%">
      <a-layout-sider
          width="150"
          style="background: #fff;height: 100vh"
      >
        <a-menu
            :selectedKeys="['1']"
            mode="inline"
            :style="{ height: '100%',paddingTop:'10px' }"
        >
          <a-menu-item key="1">
            <align-left-outlined/>
            基本信息
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding:5px">
        <a-layout-content
            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
          <div class="example" v-if="!processData">
            <a-spin size="large"/>
          </div>
          <template v-else>
            <a-table :rowKey="record=>record.index" :row-selection="rowSelection" :columns="columns"
                     :data-source="processData"
                     :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                  <span>
                    <a-tag
                        :color="record.status ? 'green':'red'"
                    >
                      {{ !record.status ? "未启动" : "已启动" }}
                    </a-tag>
                  </span>
                </template>
                <template v-else-if="column.key === 'action'">
                  <a-button size="small" type="dashed" :disabled="!record.status"
                            @click="handleOpenProcessDetail(record.processId,record.index)">显示信息
                  </a-button>
                </template>
              </template>
            </a-table>
            <a-row type="flex" style="margin-top: 10px">
              <a-col flex="auto"></a-col>
              <a-col flex="120px">
                <a-button size="small" type="primary" style="margin-right: 10px;margin-bottom: 10px"
                          @click="handleRunShell('start')">启动
                </a-button>
                <a-button size="small" danger @click="handleRunShell('stop')">停止</a-button>
              </a-col>
            </a-row>
          </template>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
  <a-modal width="600px" v-model:visible="visible" @ok="handleOk" :centered="true" :closable="false"
           :maskClosable="false">
    <template #footer>
      <a-button @click="handleOk">确定</a-button>
    </template>
    <a-descriptions style="height: 350px;" title="进程信息" bordered>
      <a-descriptions-item label="版本信息">0.0.1</a-descriptions-item>
      <a-descriptions-item label="运行时间">{{ d }}天 {{ h }}小时 {{ m }}分钟 {{ s }}秒</a-descriptions-item>
    </a-descriptions>
  </a-modal>
  <a-modal v-model:visible="loadVisible" title="提示" @ok="handleOk" :centered="true" :closable="false"
           :mask-closable="false">
    <template #footer>
      <a-button @click="handleOk">确定</a-button>
    </template>
    <div v-if="runStatus===0" class="example">
      <a-spin size="large"/>
    </div>
    <a-result
        v-else-if="runStatus===1"
        status="success"
        title="执行成功"
    >
      <template #subTitle>
        <p>脚本已成功执行,服务正在启动中.... </p>
        <p>请稍后手动刷新列表查看信息</p>
      </template>
    </a-result>
    <a-result v-else status="warning" title="执行失败">
      <template #subTitle>
        <p>脚本执行失败 </p>
        <p>请检查系统状态是否正常</p>
        <p>请检查服务对应的目录中是否有相应脚本</p>
      </template>
    </a-result>
  </a-modal>
</template>

<script>
import {AlignLeftOutlined} from '@ant-design/icons-vue';
import {store} from '@/store'
import {Modal} from 'ant-design-vue';
import moment from "moment"

moment.locale('zh-cn');
// import {ipcRenderer} from "electron";

const API = window.electronAPI
// import {toRaw} from 'vue'
// const targetProcess = ["persondtc","truckdtc","retrodtc", "falldtc"]
const targetProcess = ["/snap/postman/183/usr/share/postman/postman", "msedge.exe", "retrodtc", "falldtc"];

const targetProcessDetail = [
  {
    index: "1",
    processName: "persondtc",
    processId: "暂无",
    des: "行人检测",
    status: false,
  },
  {
    index: "2",
    processName: "truckdtc",
    processId: "暂无",
    des: "杂物检测",
    status: false,
  },
  {
    index: "3",
    processName: "retrodtc",
    processId: "暂无",
    des: "行人逆行检测",
    status: false,
  },
  {
    index: "4",
    processName: "falldtc",
    processId: "暂无",
    des: "行人摔倒检测检测",
    status: false,
  }
]


const columns = [
  {
    title: "进程名称",
    dataIndex: 'processName',
    key: 'processName',
  }, {
    title: '进程Id',
    dataIndex: 'processId',
    key: 'processId',
  }, {
    title: '描述',
    dataIndex: 'des',
    key: 'des',
  }, {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
  }, {
    title: '窗口',
    key: 'action',
  }];


export default {
  name: "ProcessList",
  async mounted() {
    const data = await API.getProcessList()
    this.handleProcessData(data)
    this.rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRows, selectedRowKeys);
        this.selectedRow = selectedRows
      },
    };
  },
  components: {
    AlignLeftOutlined,
    // PoweroffOutlined
  },
  methods: {
    // 处理进程列表
    handleProcessData(data) {
      // console.log(data);
      data.forEach((value) => {
        let index = targetProcess.indexOf(value.processName)
        if (index !== -1) {
          targetProcessDetail[index].index = index
          targetProcessDetail[index].status = true
          targetProcessDetail[index].processId = value.processId
        }
      })
      this.processData = targetProcessDetail
      console.log(this.processData);
    },
    // 打开详细的窗口
    async handleOpenProcessDetail(id, index) {
      console.log(id, index);
      const data = await API.getTimeById(id)
      const startDate = moment(data)
      this.handleRefreshTime(startDate)
      let interval = setInterval(() => {
        this.handleRefreshTime(startDate)
      }, 1000)
      this.intervalList.push(interval)
      this.visible = true
    },
    // 刷新时间
    handleRefreshTime(startDate) {
      let diffSeconds = moment().diff(startDate, "seconds")
      let [d, h, m, s] = this.handleSeconds2Time(diffSeconds)
      this.d = d
      this.h = h
      this.m = m
      this.s = s
    },
    // 秒换成时间段
    handleSeconds2Time(time) {
      let d = parseInt(time / 60 / 60 / 24)
      d = d < 10 ? '0' + d : d
      let h = parseInt(time / 60 / 60 % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt(time / 60 % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(time % 60)
      s = s < 10 ? '0' + s : s
      // 作为返回值返回
      return [d, h, m, s]
    },
    async handleOk() {
      this.intervalList.forEach((item) => {
        clearInterval(item);
      })
      this.intervalList = [];
      this.visible = false
      this.loadVisible = false
      this.processData = null
      const data = await API.getProcessList()
      this.handleProcessData(data)
    },
    /**
     * 运行某个shell脚本
     * @param type
     * @returns {Promise<void>}
     */
    async handleRunShell(type = "start") {
      let content = ""
      if (!this.selectedRow.length) {
        this.handleModal("error", "请选择要执行的进程")
        return
      }
      const rows = this.selectedRow
      if (type === "start") {
        content = "请选择未运行的进程"
      } else {
        content = "请选择已运行的进程"
      }
      let res = this.handleCheckChoose(rows, type)
      // console.log(res);
      if (res) {
        this.loadVisible = true
        this.runStatus = 0
        let names = []
        rows.forEach(item => {
          names.push(item.processName)
        })
        const resData = await API.processStart(names)
        console.log(resData);
        let flag = true
        resData.forEach(item => {
          if (!item) flag = false
        })
        setTimeout(async () => {
          flag ? this.runStatus = 1 : this.runStatus = 2
        }, 1000)
      } else {
        this.handleModal("error", content)
      }
    },
    // // 开启进程
    // async handleStartProcess() {
    //     const rows = this.selectedRow
    //     let res = this.handleCheckChoose(rows, "start")
    //     // console.log(res);
    //     if (res) {
    //         let names = []
    //         rows.forEach(item => {
    //             names.push(item.processName)
    //         })
    //         const res=await API.processStart(names)
    //         console.log(res);
    //     } else {
    //         this.handleModal("error", "请选择已运行的进程")
    //     }
    // },
    // // 停止进程
    // async handleStopProcess() {
    //     const rows = this.selectedRow
    //     let res = this.handleCheckChoose(rows, "stop")
    //     // console.log(res);
    //     if (res) {
    //         let names = []
    //         rows.forEach(item => {
    //             names.push(item.processName)
    //         })
    //         const res=await API.processStart(names)
    //         console.log(res);
    //     } else {
    //         this.handleModal("error", "请选择已运行的进程")
    //     }
    // },
    // 检查 启动运行是否合规
    handleCheckChoose(rows, type) {
      let flag = true
      if (type === "start") {
        rows.forEach(item => {
          if (item.status) flag = false
        })
      } else {
        rows.forEach(item => {
          if (!item.status) flag = false
        })
      }
      return flag
    },
    /**
     * 简单的消息提示
     * @param role
     * @param content
     */
    handleModal(role, content) {
      switch (role) {
        case "error":
          Modal.error({
            title: '警告',
            content: content,
          });
          break;
        case "success":
          Modal.success({
            title: '成功',
            content: content,
          });
          break;
      }
    }
  },
  data() {
    return {
      store,
      columns,
      rowSelection: "",
      processData: null,
      d: "",
      h: "",
      m: "",
      s: "",
      visible: false,
      loadVisible: false,
      runStatus: 0,   //0 执行中  1 执行成功  2执行失败
      intervalList: [],
      selectedRow: []
    };
  }
}
</script>

<style scoped>
.example {
  text-align: center;
  /*background: rgba(0, 0, 0, 0.05);*/
  border-radius: 4px;
  padding: 30px 50px;
  margin: 20px 0;
}
</style>
