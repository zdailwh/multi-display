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
                <el-option value="2" label="2 x 2" />
                <el-option value="3" label="3 x 3" />
                <el-option value="4" label="4 x 4" />
                <el-option value="5" label="5 x 5" />
                <el-option value="6" label="6 x 6" />
              </el-select>
            </el-form-item>
            <el-form-item label="合并模板" prop="tempMerge">
              <el-select v-model="form2.tempMerge" placeholder="请选择合并模板" style="width: 100%;">
                <el-option value="" label="不合并" />
                <el-option :disabled="form2.temp <= 2" value="2" label="2 x 2" />
                <el-option :disabled="form2.temp <= 3" value="3" label="3 x 3" />
                <el-option :disabled="form2.temp <= 4" value="4" label="4 x 4" />
                <el-option :disabled="form2.temp <= 5" value="5" label="5 x 5" />
                <!-- <el-option :disabled="form2.temp <= 6" value="6" label="6 x 6" /> -->
              </el-select>
            </el-form-item>
            <el-form-item label="画框绘制">
              <div id="gridWrap" :style="tempClass">
                <div v-for="(item,k) in gridTotal" :key="k" class="gridItem" :style="{ gridArea: item.gridArea, display: item.serial > gridShowNums ? 'none': 'block' }" @click="mergeHandle(item.serial)">{{ item.serial }}</div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="commit('form2')">确 定</el-button>
              <el-button @click="reset('form2')">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="通道配置">
        <PassSet :allchannels="allChannels" />
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
        temp: '',
        tempMerge: ''
      },
      gridTotal: [],
      gridShowNums: 0,
      isMerged: false,
      tempClass: {},
      ruleValidateForm2: {
        temp: [
          { required: true, message: '画框模板不能为空', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'form2.temp': function(val) {
      this.form2.tempMerge = ''
      this.isMerged = false
      this.gridTotal.map((item) => {
        item.gridArea = ''
      })
      this.gridShowNums = this.form2.temp * this.form2.temp
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
      }
    },
    'form2.tempMerge': function(val) {
      this.isMerged = false
      this.gridTotal.map((item) => {
        item.gridArea = ''
      })
      this.gridShowNums = this.form2.temp * this.form2.temp
    }
  },
  created() {
    this.id = this.$route.params.id
  },
  mounted() {
    this.getAllChannels()
  },
  methods: {
    // selectTemp() {
    //   this.gridTotal.map((item) => {
    //     item.gridArea = ''
    //   })
    // },
    // selectTempMerge() {
    //   this.isMerged = false
    //   this.gridTotal.map((item) => {
    //     item.gridArea = ''
    //   })
    // },
    mergeHandle(idx) {
      this.isMerged = false

      this.gridTotal.map((item) => {
        item.gridArea = ''
      })

      if (!this.form2.tempMerge) {
        this.$message({
          message: '请先选择合并模板再进行合并！',
          type: 'warning'
        })
      } else {
        // 是否有合并的标识
        this.isMerged = true

        var columnstart = idx % this.form2.temp
        var rowstart = Math.ceil(idx / this.form2.temp)

        this.gridTotal[idx - 1].gridArea = `${rowstart} / ${columnstart} / span ${this.form2.tempMerge} / span ${this.form2.tempMerge}`

        this.gridShowNums = this.form2.temp * this.form2.temp - this.form2.tempMerge * this.form2.tempMerge + 1
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
