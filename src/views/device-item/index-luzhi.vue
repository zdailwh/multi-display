<template>
  <div v-if="id" class="app-container">
    <el-tabs v-model="currTab" type="border-card">
      <el-tab-pane label="操控" name="operate">
        <OperateLuzhi :deviceid="id" :device="currDevice" @getdevice="getDevice" />
      </el-tab-pane>
      <el-tab-pane label="通道配置" name="passset">
        <PassSetLuzhi ref="passset" :allchannels="allChannels" :devips-arr="devipsArr" :framecnt="currDevice.framecnt" :editframes="currDevice.frames" @submitAll="submitAll" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import PassSetLuzhi from './PassSet-luzhi'
import OperateLuzhi from './Operate-luzhi'
import { getAllChannels } from '@/api/channel'
import { getDevice, postDevice } from '@/api/device'
export default {
  components: { PassSetLuzhi, OperateLuzhi },
  data() {
    return {
      isVisitor: (Cookies.get('MultiDisplay-isVisitor') && JSON.parse(Cookies.get('MultiDisplay-isVisitor'))) || false,
      currTab: 'operate',
      allChannels: [],
      id: null,
      currDevice: {},
      devipsArr: []
    }
  },
  created() {
    this.id = parseInt(this.$route.params.id)
    if (this.id) {
      this.getDevice()
    }
  },
  mounted() {
    this.getAllChannels()
  },
  methods: {
    getDevice() {
      getDevice({ id: this.id }).then(response => {
        this.currDevice = response
        this.devipsArr = this.currDevice.devips.split('|')
      })
    },
    getAllChannels() {
      getAllChannels().then(data => {
        this.allChannels = data.items
      })
    },
    submitAll() {
      var frames = this.$refs.passset.frames
      var formconcat = {}
      formconcat.framecnt = frames.length
      formconcat.frames = frames
      formconcat.id = this.id
      console.log(formconcat)
      this.updateDevice(formconcat)
    },
    updateDevice(editform) {
      postDevice(editform).then(response => {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        })
        this.getDevice()
      })
    }
  }
}
</script>
<style scoped>
.formWrap {
  width: 600px;
  margin: 30px auto;
}
#gridWrap {
  width: 480px;
  height: calc(480px * 9 / 16);
  background-color: #eee;
  display: grid;
  /*grid-row-gap: 5px;
  grid-column-gap: 5px;*/
}
</style>
