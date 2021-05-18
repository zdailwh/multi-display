<template>
  <div class="formWrap">
    <el-form ref="formdata" :model="formdata" :rules="ruleValidate" label-width="120px">
      <el-form-item label="画框">
        <div id="gridWrapPassSet" :style="tempClass">
          <div v-for="(item,k) in gridForPassSet.gridTotal" :key="k" class="gridItem" :class="{ outline: item.serial === currGrid.serial }" :style="{ gridArea: item.gridArea, display: item.serial > gridForPassSet.gridShowNums ? 'none': 'block' }" @click="checkGrid(item)">{{ item.serial }}</div>
        </div>
      </el-form-item>
      <el-form-item label="频道" prop="channel">
        <el-select v-model="formdata.channel" placeholder="请选择频道" style="width: 100%;">
          <el-option v-for="(item, k) in allchannels" :key="k" :value="k" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="解码参数" prop="decoder">
        <el-select v-model="formdata.decoder" placeholder="请选择解码参数" style="width: 100%;">
          <el-option value="cpu" label="cpu" />
          <el-option value="GPU_264" label="GPU_264" />
          <el-option value="GPU_265" label="GPU_265" />
        </el-select>
      </el-form-item>
      <el-form-item label="录制存放路径" prop="recoder_path">
        <el-input v-model="formdata.recoder_path" placeholder="请输入录制存放路径" />
      </el-form-item>
      <el-form-item label="录制编码" prop="recoder_encoding">
        <el-select v-model="formdata.recoder_encoding" placeholder="请选择录制编码" style="width: 100%;">
          <el-option value="cpu" label="cpu" />
          <el-option value="GPU_264" label="GPU_264" />
          <el-option value="GPU_265" label="GPU_265" />
        </el-select>
      </el-form-item>
      <el-form-item label="录制分辨率">
        <el-col :span="11">
          <el-form-item prop="recoder_width">
            <el-input v-model="formdata.recoder_width" placeholder="录制分辨率宽" />
          </el-form-item>
        </el-col>
        <el-col :span="2" style="text-align: center;">x</el-col>
        <el-col :span="11">
          <el-form-item prop="recoder_height">
            <el-input v-model="formdata.recoder_height" placeholder="录制分辨率高" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="录制码率" prop="recoder_bitrate">
        <el-input v-model="formdata.recoder_bitrate" placeholder="请输入录制码率" />
      </el-form-item>
      <el-form-item label="录制文件格式" prop="recoder_file">
        <el-input v-model="formdata.recoder_file" placeholder="请输入录制文件格式" />
      </el-form-item>
      <el-form-item label="静帧报警阈值" prop="frozen_duration">
        <el-input v-model="formdata.frozen_duration" type="number" placeholder="请输入静帧报警阈值">
          <template slot="append">s</template>
        </el-input>
      </el-form-item>
      <el-form-item label="静音报警阈值" prop="silence_duration">
        <el-input v-model="formdata.silence_duration" type="number" placeholder="请输入静音报警阈值">
          <template slot="append">s</template>
        </el-input>
      </el-form-item>
      <el-form-item label="爆音报警阈值" prop="burst_duration">
        <el-input v-model="formdata.burst_duration" type="number" placeholder="请输入爆音报警阈值">
          <template slot="append">s</template>
        </el-input>
      </el-form-item>
      <el-form-item label="组播接收IP地址" prop="receive_ip">
        <el-input v-model="formdata.receive_ip" placeholder="请输入组播接收IP地址" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="commit('formdata')">确 定</el-button>
        <el-button @click="reset('formdata')">取 消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    allchannels: {
      type: Array,
      default: function() {
        return []
      }
    },
    gridForPassSet: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      tempClass: {},
      currGrid: {},
      formdata: {
        channel: '',
        decoder: 'cpu',
        recoder_path: '',
        recoder_encoding: 'cpu',
        recoder_width: '',
        recoder_height: '',
        recoder_bitrate: '1M',
        recoder_file: 'ts',
        frozen_duration: 3,
        silence_duration: 3,
        burst_duration: 3,
        receive_ip: ''
      },
      ruleValidate: {
        channel: [
          { required: true, message: '请选择频道', trigger: 'change' }
        ],
        decoder: [
          { required: true, message: '请选择解码参数', trigger: 'change' }
        ],
        recoder_encoding: [
          { required: true, message: '请选择录制编码', trigger: 'change' }
        ],
        recoder_bitrate: [
          { required: true, message: '录制码率不能为空', trigger: 'blur' }
        ],
        recoder_file: [
          { required: true, message: '录制文件格式不能为空', trigger: 'blur' }
        ],
        frozen_duration: [
          { required: true, message: '静帧报警阈值不能为空', trigger: 'blur' }
        ],
        silence_duration: [
          { required: true, message: '静音报警阈值不能为空', trigger: 'blur' }
        ],
        burst_duration: [
          { required: true, message: '爆音报警阈值不能为空', trigger: 'blur' }
        ],
        receive_ip: [
          { required: true, message: '组播接收IP地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'formdata.channel': function(val) {
      this.formdata.channel_id = this.allchannels[val].id
      this.formdata.channel_name = this.allchannels[val].name
      this.formdata.channel_url = this.allchannels[val].epgurl
    },
    gridForPassSet() {
      var gridWrap = document.querySelector('#gridWrapPassSet')
      if (gridWrap) {
        // 修改网格容器样式
        var gridW = 480
        var gridH = 480 * 9 / 16
        var gridItemW = gridW / this.gridForPassSet.temp
        var gridItemH = gridH / this.gridForPassSet.temp
        this.tempClass = {
          'grid-template-columns': `repeat(${this.gridForPassSet.temp}, ${gridItemW}px)`,
          'grid-template-rows': `repeat(${this.gridForPassSet.temp}, ${gridItemH}px)`
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    checkGrid(item) {
      this.currGrid = item
    },
    commit(formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          console.log('验证通过')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reset(formname) {
      this.$refs[formname].resetFields()
    },
    handleClose(done) {
      this.$emit('changeAddVisible', false)
      // done()
    }
  }
}
</script>
<style>
#gridWrapPassSet {
  width: 480px;
  height: calc(480px * 9 / 16);
  background-color: #eee;
  display: grid;
  /*grid-row-gap: 5px;
  grid-column-gap: 5px;*/
}
.outline {
  box-shadow: 0 0 0 2px #f00 inset;
}
</style>
