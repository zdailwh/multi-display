<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="基础配置">
        <div class="formWrap">
          <el-form ref="form1" :model="form1" :rules="ruleValidateForm1" label-width="120px">
            <el-form-item label="设备IP" prop="deviceip">
              <el-input v-model="form1.deviceip" placeholder="请输入设备IP" />
            </el-form-item>
            <el-form-item label="banner文字" prop="banner">
              <el-input v-model="form1.banner" placeholder="请输入banner文字" />
            </el-form-item>
            <el-form-item label="banner高度" prop="bannerh">
              <el-input v-model="form1.bannerh" readonly placeholder="请输入banner高度" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="commit('form1')">确 定</el-button>
              <el-button @click="reset('form1')">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="画框配置">
        <div class="formWrap">
          <el-form ref="form2" :model="form2" :rules="ruleValidateForm2" label-width="120px">
            <el-form-item label="画框模板" prop="temp">
              <el-select v-model="form2.temp" placeholder="请选择画框模板" style="width: 100%;">
                <el-option :value="2" label="2 x 2" />
                <el-option :value="3" label="3 x 3" />
                <el-option :value="4" label="4 x 4" />
                <el-option :value="5" label="5 x 5" />
                <el-option :value="6" label="6 x 6" />
              </el-select>
            </el-form-item>
            <el-form-item label="合并模板" prop="tempMerge">
              <el-select v-model="form2.tempMerge" placeholder="请选择合并模板" style="width: 100%;">
                <el-option value="" label="不合并" />
                <el-option :disabled="form2.temp <= 2" :value="2" label="2 x 2" />
                <el-option :disabled="form2.temp <= 3" :value="3" label="3 x 3" />
                <el-option :disabled="form2.temp <= 4" :value="4" label="4 x 4" />
                <el-option :disabled="form2.temp <= 5" :value="5" label="5 x 5" />
                <!-- <el-option :disabled="form2.temp <= 6" :value="6" label="6 x 6" /> -->
              </el-select>
            </el-form-item>
            <el-form-item label="画框绘制">
              <div id="gridWrap" :style="tempClass">
                <div v-for="(item,k) in gridTotal" :key="k" class="gridItem" :style="{ gridArea: item.gridArea, display: item.serial > gridShowNums ? 'none': 'block' }" @click="mergeHandle(item.serial)">{{ item.serial }}</div>
                <!-- //x:{{ item.display_x }}//y:{{ item.display_y }}//w:{{ item.display_w }}//h:{{ item.display_h }} -->
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="commitTemp('form2')">确 定</el-button>
              <el-button @click="reset('form2')">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="通道配置">
        <PassSet :allchannels="allChannels" :grid-for-pass-set="gridForPassSet" />
      </el-tab-pane>
      <el-tab-pane label="操控">
        <Operate />
      </el-tab-pane>
      <el-tab-pane label="报警信息">
        <Warn />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PassSet from './PassSet'
import Operate from './Operate'
import Warn from './Warn'
import { getAllChannels } from '@/api/channel'
export default {
  components: { PassSet, Operate, Warn },
  data() {
    return {
      allChannels: [],
      id: null,
      form1: {
        deviceip: '',
        banner: '',
        bannerh: '自适应'
      },
      ruleValidateForm1: {
        deviceip: [
          { required: true, message: '设备IP不能为空', trigger: 'blur' }
        ],
        banner: [
          { required: true, message: 'banner名称不能为空', trigger: 'blur' }
        ],
        bannerh: [
          { required: true, message: 'banner高度不能为空', trigger: 'blur' }
        ]
      },
      form2: {
        temp: null,
        tempMerge: null
      },
      gridTotal: [],
      gridShowNums: 0,
      isMerged: false,
      tempClass: {},
      ruleValidateForm2: {
        temp: [
          { required: true, message: '画框模板不能为空', trigger: 'change' }
        ]
      },
      gridOffsetWidth: 0,
      gridOffsetHeight: 0,
      channelW: 0,
      channelH: 0,
      gridForPassSet: {}
    }
  },
  watch: {
    'form2.temp': function(val) {
      // 计算每个框的宽高像素
      this.channelW = Math.round(1920 / val)
      this.channelH = Math.round(this.channelW / 1.05 * 9 / 16)
      // var bannH = 1080 - this.channelH * val

      this.form2.tempMerge = ''
      this.isMerged = false

      this.gridShowNums = this.form2.temp ** 2
      var gridWrap = document.querySelector('#gridWrap')
      if (gridWrap) {
        // 修改网格容器样式
        var gridW = gridWrap.clientWidth
        var gridH = gridWrap.clientHeight
        var gridItemW = gridW / val
        var gridItemH = gridH / val
        this.tempClass = {
          'grid-template-columns': `repeat(${val}, ${gridItemW}px)`,
          'grid-template-rows': `repeat(${val}, ${gridItemH}px)`
        }
        // 生成网格元素
        var gridArr = []
        var num = 0
        num = val * val
        for (var i = 0; i < num; i++) {
          gridArr.push({
            serial: i + 1,
            gridArea: '',
            display_x: '',
            display_y: '',
            display_w: '',
            display_h: ''
          })
        }
        this.gridTotal = gridArr
        this.$nextTick(() => {
          // 保存每个单元格的宽高，因为offsetTop offsetLeft 获取到的值被取整 所以不能直接用上面的gridItemW gridItemH
          this.gridOffsetWidth = document.querySelectorAll('.gridItem')[1].offsetLeft
          this.gridOffsetHeight = document.querySelectorAll('.gridItem')[val].offsetTop
          this.calcInit()
        })
      }
    },
    'form2.tempMerge': function(val) {
      this.isMerged = false
      this.gridTotal.map((item) => {
        item.gridArea = ''
      })
      this.gridShowNums = this.form2.temp ** 2
      this.$nextTick(() => {
        this.calcInit()
      })
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  mounted() {
    this.getAllChannels()
  },
  methods: {
    calcInit() {
      this.gridTotal.map((item) => {
        var offLeft = document.querySelectorAll('.gridItem')[item.serial - 1].offsetLeft
        var offTop = document.querySelectorAll('.gridItem')[item.serial - 1].offsetTop
        item.display_x = Math.round(offLeft / this.gridOffsetWidth) * this.channelW
        item.display_y = Math.round(offTop / this.gridOffsetHeight) * this.channelH
        item.display_w = this.channelW
        item.display_h = this.channelH
      })
    },
    mergeHandle(idx) {
      this.isMerged = false
      this.gridTotal.map((item) => {
        item.gridArea = ''
      })
      this.gridShowNums = this.form2.temp ** 2
      this.$nextTick(() => {
        this.calcInit()
      })

      if (!this.form2.tempMerge) {
        this.$message({
          message: '请先选择合并模板再进行合并！',
          type: 'warning'
        })
      } else {
        var columnstart = idx % this.form2.temp === 0 ? this.form2.temp : idx % this.form2.temp
        var rowstart = Math.ceil(idx / this.form2.temp)
        if ((columnstart + this.form2.tempMerge) > (this.form2.temp + 1) || (rowstart + this.form2.tempMerge) > (this.form2.temp + 1)) {
          // 当前单元格不能合并
        } else {
          // 是否有合并的标识
          this.isMerged = true

          this.gridTotal[idx - 1].gridArea = `${rowstart} / ${columnstart} / span ${this.form2.tempMerge} / span ${this.form2.tempMerge}`

          this.gridShowNums = this.form2.temp ** 2 - this.form2.tempMerge ** 2 + 1

          this.$nextTick(() => {
            this.gridTotal.map((item) => {
              var offLeft = document.querySelectorAll('.gridItem')[item.serial - 1].offsetLeft
              var offTop = document.querySelectorAll('.gridItem')[item.serial - 1].offsetTop
              item.display_x = Math.round(offLeft / this.gridOffsetWidth) * this.channelW
              item.display_y = Math.round(offTop / this.gridOffsetHeight) * this.channelH
              if (item.serial === idx) {
                item.display_w = this.form2.tempMerge * this.channelW
                item.display_h = this.form2.tempMerge * this.channelH
              }
            })
          })
        }
      }
    },
    reset(formname) {
      this.$refs[formname].resetFields()
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
    commitTemp(formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.gridForPassSet = {
            gridTotal: JSON.parse(JSON.stringify(this.gridTotal)),
            gridShowNums: this.gridShowNums,
            temp: this.form2.temp
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getAllChannels() {
      getAllChannels().then(data => {
        this.allChannels = data.items
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
