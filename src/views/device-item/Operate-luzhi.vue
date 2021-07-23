<template>
  <div class="formWrap">
    <el-form ref="formdata" :model="formdata" :rules="ruleValidate" label-width="120px">
      <el-form-item label="频道重启" prop="channelRestart">
        <el-select v-model="formdata.channelRestart" value-key="frameno" placeholder="请选择要重启的频道" style="width: 100%;">
          <el-option v-for="(item, i) in device.frames" :key="i" :value="item.frameno" :label="item.frameno + ' -- ' + (item.channel && item.channel.name)" :disabled="!item.channel" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" :disabled="isVisitor || isPause" @click="versionew">频 道 重 启</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import { versionew } from '@/api/device'
export default {
  props: {
    device: {
      type: Object,
      default: function() {
        return {}
      }
    },
    deviceid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isVisitor: (Cookies.get('MultiDisplay-isVisitor') && JSON.parse(Cookies.get('MultiDisplay-isVisitor'))) || false,
      formdata: {
        channelRestart: 0
      },
      ruleValidate: {
      },
      isPause: false
    }
  },
  mounted() {
  },
  methods: {
    versionew() {
      if (!this.formdata.channelRestart) {
        this.$message({
          message: '请选择要重启的频道！',
          type: 'warning'
        })
        return
      }
      this.toPause()
      versionew({ id: this.deviceid, frameno: this.formdata.channelRestart }).then(response => {
        this.$message({
          message: '频道重启执行成功！',
          type: 'success'
        })
      })
    },
    toPause() {
      var that = this
      this.isPause = true
      window.setTimeout(function() {
        that.isPause = false
      }, 5000)
    }
  }
}
</script>
