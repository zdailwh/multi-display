<template>
  <div class="formWrap">
    <el-form ref="formdata" :model="formdata" :rules="ruleValidate" label-width="120px">
      <el-form-item label="声音监听" prop="voice">
        <el-select v-model="formdata.voice" value-key="frameno" placeholder="请选择要进行声音监听的频道" style="width: 100%;" :disabled="device.screenmode !== 0 || device.voicemode !== 0">
          <el-option :value="0" label="静音" />
          <el-option v-for="(item, i) in device.frames" :key="i" :value="item.frameno" :label="item.frameno + ' -- ' + (item.channel && item.channel.name)" :disabled="!item.channel" />
        </el-select>
      </el-form-item>
      <el-form-item label="全屏监看" prop="screen">
        <el-select v-model="formdata.screen" value-key="frameno" placeholder="请选择要进行全屏监看的频道" style="width: 100%;" :disabled="device.screenmode !== 0 || device.voicemode !== 0">
          <el-option :value="0" label="多画面" />
          <el-option v-for="(item, i) in device.frames" :key="i" :value="item.frameno" :label="item.frameno + ' -- ' + (item.channel && item.channel.name)" :disabled="!item.channel || (item.channel && item.channel.type === 1)" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="isVisitor || isPause" @click="commit('formdata')">确 定</el-button>
        <el-button :disabled="isVisitor || isPause" @click="reset('formdata')">复 位</el-button>
        <el-button type="warning" :disabled="isVisitor || isPause" @click="confignew">软 件 重 启</el-button>
      </el-form-item>
      <el-form-item label="频道重启" prop="screen">
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
import { screenDevice, unmuteDevice, confignew, versionew } from '@/api/device'
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
        voice: 0,
        screen: 0,
        channelRestart: 0
      },
      ruleValidate: {
      },
      isPause: false
    }
  },
  watch: {
    device(val) {
      if (val.voicemode) {
        this.formdata.voice = val.voicemode
      } else {
        this.formdata.voice = 0
      }
      if (val.screenmode) {
        this.formdata.screen = val.screenmode
      } else {
        this.formdata.screen = 0
      }
    },
    'formdata.voice': function(val) {
      if (val) {
        this.formdata.screen = 0
      }
    },
    'formdata.screen': function(val) {
      if (val) {
        this.formdata.voice = 0
      }
    }
  },
  mounted() {
  },
  methods: {
    commit(formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          if (this.formdata.voice !== 0) {
            this.unmuteDevice()
          }
          if (this.formdata.screen !== 0) {
            this.screenDevice()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reset(formname) {
      this.$refs[formname].resetFields()
      if (this.formdata.voice !== this.device.voicemode) {
        this.unmuteDevice()
      }
      if (this.formdata.screen !== this.device.screenmode) {
        this.screenDevice()
      }
    },
    unmuteDevice() {
      this.toPause()
      unmuteDevice({ id: this.deviceid, frameno: this.formdata.voice }).then(response => {
        this.$message({
          message: '设置静音执行成功！',
          type: 'success'
        })
        this.$emit('getdevice')
      })
    },
    screenDevice() {
      this.toPause()
      screenDevice({ id: this.deviceid, frameno: this.formdata.screen }).then(response => {
        this.$message({
          message: '设置全屏执行成功！',
          type: 'success'
        })
        this.$emit('getdevice')
      })
    },
    confignew() {
      this.toPause()
      confignew({ id: this.deviceid }).then(response => {
        this.$message({
          message: '软件重启执行成功！',
          type: 'success'
        })
      })
    },
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
