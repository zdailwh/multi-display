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
            <el-form-item label="画框绘制">
              <el-checkbox-group v-model="checkList">
                <div id="gridWrap" :style="tempClass">
                  <div v-for="(item,k) in gridTotal" :key="k" class="gridItem" :style="{ gridArea: item.gridArea, display: item.serial > gridShowNums ? 'none': 'block' }"><el-checkbox :label="item">{{ item.serial }}</el-checkbox></div>
                  <!-- //x:{{ item.display_x }}//y:{{ item.display_y }}//w:{{ item.display_w }}//h:{{ item.display_h }} -->
                </div>
              </el-checkbox-group>
              <div>
                <el-button type="primary" @click="toMerge">合并</el-button>
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
        temp: null
      },
      checkList: [],
      gridTotal: [],
      gridShowNums: 0,
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
      this.checkList = []
      // 计算每个框的宽高像素
      this.channelW = Math.round(1920 / val)
      this.channelH = Math.round(this.channelW / 1.05 * 9 / 16)
      // var bannH = 1080 - this.channelH * val

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
    doMerge() {
      // console.log(this.checkList)
      var row_num = parseInt(this.checkList.length ** 0.5)
      this.checkList.sort((a, b) => {
        return a.serial - b.serial
      })
      var leftTopItem = this.checkList[0]
      var originRowSpan = parseInt(leftTopItem.display_w / this.channelW)
      var originColumnSpan = parseInt(leftTopItem.display_h / this.channelH)
      var columnStart = parseInt(leftTopItem.display_x / this.channelW) + 1
      var rowStart = parseInt(leftTopItem.display_y / this.channelH) + 1
      this.gridTotal[leftTopItem.serial - 1].gridArea = `${rowStart} / ${columnStart} / span ${originRowSpan * row_num} / span ${originColumnSpan * row_num}`
      this.gridShowNums = this.gridShowNums - row_num ** 2 + 1

      this.$nextTick(() => {
        this.gridTotal.map((item) => {
          var offLeft = document.querySelectorAll('.gridItem')[item.serial - 1].offsetLeft
          var offTop = document.querySelectorAll('.gridItem')[item.serial - 1].offsetTop
          item.display_x = Math.round(offLeft / this.gridOffsetWidth) * this.channelW
          item.display_y = Math.round(offTop / this.gridOffsetHeight) * this.channelH
          if (item.serial === leftTopItem.serial) {
            item.display_w = originRowSpan * row_num * this.channelW
            item.display_h = originColumnSpan * row_num * this.channelH
          }
        })
      })
      this.checkList = []
    },
    toMerge() {
      if (this.checkList.length > 3 && this.checkList.length < this.form2.temp ** 2) {
        if (parseInt(this.checkList.length ** 0.5) === parseFloat(this.checkList.length ** 0.5)) {
          // 检查被选画框的宽高是否都是相同的
          var oneW = this.checkList[0].display_w
          var oneH = this.checkList[0].display_h
          var filteredW = this.checkList.every((item) => {
            return item.display_w === oneW
          })
          var filteredH = this.checkList.every((item) => {
            return item.display_h === oneH
          })
          if (filteredW && filteredH) {
            // 检查被选画框的坐标是否符合规律 按照x坐标分组
            var row_num = parseInt(this.checkList.length ** 0.5)
            var myO = {}
            this.checkList.map((item) => {
              if (myO[item.display_x]) {
                myO[item.display_x].push(item)
              } else {
                myO[item.display_x] = [item]
              }
            })

            // 判断x分组后 每组的长度是否相同
            var lenArr = []
            for (var item in myO) {
              lenArr.push(myO[item].length)
            }
            var checkLenRes = lenArr.every(item => lenArr[0] === item)
            if (!checkLenRes) {
              this.$message({
                message: '勾选的底框不能合并！',
                type: 'warning'
              })
              return
            }

            var numArr_x = Object.keys(myO)
            var diffNumArr_x = []
            for (var i = 0; i < numArr_x.length - 1; i++) {
              diffNumArr_x.push(parseInt(numArr_x[i + 1]) - parseInt(numArr_x[i]))
            }
            var checkXres = diffNumArr_x.every(item => diffNumArr_x[0] === item && diffNumArr_x[0] === oneW)
            console.log('x坐标是否连续的：' + checkXres)
            console.log('x分组长度：' + numArr_x.length)
            // x坐标是连续的 而且按照x坐标分组 分组个数等于合并模式个数
            if (checkXres && numArr_x.length === row_num) {
              // 按照y坐标从小到大排序
              var checkYresArr = []
              for (var key in myO) {
                myO[key] = myO[key].sort((a, b) => {
                  return a.display_y - b.display_y
                })

                var diffNumArr_y = []
                for (var j = 0; j < myO[key].length - 1; j++) {
                  diffNumArr_y.push(myO[key][j + 1].display_y - myO[key][j].display_y)
                }
                var checkYres = diffNumArr_y.every(item => diffNumArr_y[0] === item && diffNumArr_y[0] === oneH)
                console.log(key + '/' + checkYres)
                checkYresArr.push(checkYres)
              }
              // 判断按照x分组后 每组按y排序后 每组的y坐标组成的字符串是否相同
              var strYO = {}
              for (var kk in myO) {
                strYO[kk] = myO[kk].map((item) => {
                  return item.display_y
                })
              }
              var strYArr = []
              for (var k in strYO) {
                strYArr.push(strYO[k].join())
              }

              if (checkYresArr.every(item => item === true) && strYArr.every(item => strYArr[0] === item)) {
                console.log('可以合并')
                this.doMerge()
              } else {
                this.$message({
                  message: '勾选的底框不能合并！',
                  type: 'warning'
                })
              }
            } else {
              this.$message({
                message: '勾选的底框不能合并！',
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: '勾选的底框宽高不统一！',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: '勾选的数量不是平方数，无法组合！',
            type: 'warning'
          })
        }
      } else {
        this.$message({
          message: '勾选的底框数量不满足要求！',
          type: 'warning'
        })
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
