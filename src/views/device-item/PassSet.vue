<template>
  <div>
    <div id="gridWrapPassSet" :style="tempClass">
      <div v-for="(item,k) in gridForPassSet.gridTotal" :key="k" class="gridItem" :class="{ outline: item.serial === currGrid.serial }" :style="{ gridArea: item.gridarea }" @click="checkGrid(item)">{{ k + 1 }}</div>
    </div>
    <el-row :gutter="3">
      <el-col :span="1"><div class="tableHead">序号</div></el-col>
      <el-col :span="2"><div class="tableHead">频道</div></el-col>
      <el-col :span="2"><div class="tableHead">解码参数</div></el-col>
      <el-col :span="2"><div class="tableHead">录制存放路径</div></el-col>
      <el-col :span="2"><div class="tableHead">录制编码</div></el-col>
      <el-col :span="2"><div class="tableHead">录制画面宽高</div></el-col>
      <el-col :span="2"><div class="tableHead">录制码率(M)</div></el-col>

      <el-col :span="1"><div class="tableHead">文件格式</div></el-col>
      <el-col :span="2"><div class="tableHead">静帧报警阈值</div></el-col>
      <el-col :span="2"><div class="tableHead">黑场报警阈值</div></el-col>
      <el-col :span="2"><div class="tableHead">静音报警阈值</div></el-col>
      <el-col :span="2"><div class="tableHead">爆音报警阈值</div></el-col>
      <el-col :span="2"><div class="tableHead">接收网卡IP地址</div></el-col>
      <!-- <el-col :span="2"><div class="tableHead">操作</div></el-col> -->
    </el-row>

    <div v-for="(item,k) in gridForPassSet.gridTotal" :key="k">
      <el-form :ref="frames[k]" :model="frames[k]" :rules="ruleValidate" size="mini">
        <el-row :gutter="3">
          <el-col :span="1">
            <div class="tableTd">
              <el-form-item prop="frameno">
                {{ k + 1 }}
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item prop="channel" class="my-form-item">
                <el-select v-model="frames[k].channel" value-key="id" placeholder="请选择频道" style="width: 100%;" @change="setChannel(k)">
                  <el-option :value="null" label="空" />
                  <el-option v-for="(it, i) in allchannels" :key="i" :value="it" :label="it.name" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item prop="decoder" class="my-form-item">
                <el-select v-model="frames[k].decoder" placeholder="请选择解码参数" style="width: 100%;">
                  <el-option value="cpu" label="cpu" />
                  <el-option value="GPU_264" label="GPU_264" />
                  <el-option value="GPU_265" label="GPU_265" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item prop="recordpath" class="my-form-item">
                <el-input v-model="frames[k].recordpath" placeholder="请输入录制存放路径" disabled />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item prop="encoder" class="my-form-item">
                <el-select v-model="frames[k].encoder" placeholder="请选择录制编码" style="width: 100%;">
                  <el-option value="cpu" label="cpu" />
                  <el-option value="GPU_264" label="GPU_264" />
                  <el-option value="GPU_265" label="GPU_265" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item>
                <el-col :span="11">
                  <el-form-item prop="width" class="my-form-item">
                    <el-input v-model="frames[k].width" placeholder="宽" />
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="text-align: center;">x</el-col>
                <el-col :span="11">
                  <el-form-item prop="height" class="my-form-item">
                    <el-input v-model="frames[k].height" placeholder="高" />
                  </el-form-item>
                </el-col>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item prop="bitrate" class="my-form-item">
                <el-input v-model="frames[k].bitrate" placeholder="请输入录制码率" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="1">
            <div class="tableTd">
              <el-form-item prop="recordfile" class="my-form-item">
                <el-input v-model="frames[k].recordfile" placeholder="请输入录制文件格式" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item prop="frozenduration" class="my-form-item">
                <el-input v-model="frames[k].frozenduration" type="number" placeholder="静帧报警阈值">
                  <template slot="append">s</template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item prop="blackduration" class="my-form-item">
                <el-input v-model="frames[k].blackduration" type="number" placeholder="黑场报警阈值">
                  <template slot="append">s</template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item prop="silenceduration" class="my-form-item">
                <el-input v-model="frames[k].silenceduration" type="number" placeholder="静音报警阈值">
                  <template slot="append">s</template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item prop="burstduration" class="my-form-item">
                <el-input v-model="frames[k].burstduration" type="number" placeholder="爆音报警阈值">
                  <template slot="append">s</template>
                </el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="2">
            <div class="tableTd">
              <el-form-item prop="receiveip" class="my-form-item">
                <el-select v-model="frames[k].receiveip" placeholder="请选择接收网卡IP地址" style="width: 100%;">
                  <el-option value="" label="空" />
                  <el-option v-for="it in devipsArr" :key="it" :value="it" :label="it" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <!-- <el-col :span="2">
            <div class="tableTd">
              <el-form-item>
                <el-button type="primary" round @click="savePassSet(k)">保存</el-button>
              </el-form-item>
            </div>
          </el-col> -->
        </el-row>
      </el-form>
    </div>
    <div style="text-align: center;">
      <el-button type="primary" round @click="savePassSet">保 存 配 置</el-button>
    </div>
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
    devipsArr: {
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
    },
    editframes: {
      type: Array,
      default: function() {
        return []
      }
    },
    mediapath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempClass: {},
      currGrid: {},
      formdataTemp: {
        frameno: '',
        channel: null,
        decoder: 'cpu',
        recordpath: '',
        encoder: 'cpu',
        width: '',
        height: '',
        bitrate: '',
        recordfile: 'ts',
        frozenduration: 3,
        blackduration: 3,
        silenceduration: 3,
        burstduration: 3,
        receiveip: ''
      },
      formdata: [],
      frames: [],
      ruleValidate: {
        channel: [
          { required: true, message: '请选择频道', trigger: 'change' }
        ],
        decoder: [
          { required: true, message: '请选择解码参数', trigger: 'change' }
        ],
        encoder: [
          { required: true, message: '请选择录制编码', trigger: 'change' }
        ],
        bitrate: [
          { required: true, message: '录制码率不能为空', trigger: 'blur' }
        ],
        recordfile: [
          { required: true, message: '录制文件格式不能为空', trigger: 'blur' }
        ],
        frozenduration: [
          { required: true, message: '静帧报警阈值不能为空', trigger: 'blur' }
        ],
        blackduration: [
          { required: true, message: '黑场报警阈值不能为空', trigger: 'blur' }
        ],
        silenceduration: [
          { required: true, message: '静音报警阈值不能为空', trigger: 'blur' }
        ],
        burstduration: [
          { required: true, message: '爆音报警阈值不能为空', trigger: 'blur' }
        ],
        receiveip: [
          { required: true, message: '接收网卡IP地址不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    gridForPassSet(val) {
      var gridWrap = document.querySelector('#gridWrapPassSet')
      if (gridWrap) {
        // 修改网格容器样式
        var gridW = 400
        var gridH = 400 * 9 / 16
        var gridItemW = gridW / this.gridForPassSet.framegrid
        var gridItemH = gridH / this.gridForPassSet.framegrid
        this.tempClass = {
          'grid-template-columns': `repeat(${this.gridForPassSet.framegrid}, ${gridItemW}px)`,
          'grid-template-rows': `repeat(${this.gridForPassSet.framegrid}, ${gridItemH}px)`
        }
      }
      this.frames = []

      if (val.gridTotal && val.gridTotal.length) {
        for (var i = 0; i < val.gridTotal.length; i++) {
          var copyForm = JSON.parse(JSON.stringify(this.formdataTemp))
          copyForm.frameno = i + 1
          if (this.editframes.length && this.editframes[i]) {
            copyForm.channel = this.editframes[i].channel ? this.editframes[i].channel : null
            copyForm.decoder = this.editframes[i].decoder
            copyForm.recordpath = this.editframes[i].recordpath
            copyForm.encoder = this.editframes[i].encoder
            copyForm.width = this.editframes[i].width
            copyForm.height = this.editframes[i].height
            copyForm.bitrate = this.editframes[i].bitrate
            copyForm.recordfile = this.editframes[i].recordfile
            copyForm.frozenduration = this.editframes[i].frozenduration
            copyForm.blackduration = this.editframes[i].blackduration
            copyForm.silenceduration = this.editframes[i].silenceduration
            copyForm.burstduration = this.editframes[i].burstduration
            copyForm.receiveip = this.editframes[i].receiveip
          }
          copyForm = { ...copyForm, ...val.gridTotal[i] }
          this.frames.push(copyForm)
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
    setChannel(idx) {
      this.frames[idx].channel_class = this.frames[idx].channel.class
      this.frames[idx].channel_id = this.frames[idx].channel.id
    },
    savePassSet() {
      // if (this.frames.length) {
      //   console.log(this.$refs)
      //   for (var i = 0; i < this.frames.length; i++) {
      //     this.$refs[i].validate((valid) => {
      //       if (valid) {
      //         console.log('验证通过')
      //       } else {
      //         console.log('error submit!!')
      //         return false
      //       }
      //     })
      //   }
      // }
      this.$emit('submitAll')
    }
  }
}
</script>
<style>
#gridWrapPassSet {
  margin: 0 auto;
  width: 400px;
  height: calc(400px * 9 / 16);
  background-color: #eee;
  display: grid;
  /*grid-row-gap: 5px;
  grid-column-gap: 5px;*/
}
.outline {
  box-shadow: 0 0 0 2px #f00 inset;
}

.tableHead {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 13px;
}
.tableTd {
  text-align: center;
}
</style>
