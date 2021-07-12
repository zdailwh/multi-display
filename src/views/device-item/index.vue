<template>
  <div v-if="id" class="app-container">
    <el-tabs v-model="currTab" type="border-card">
      <el-tab-pane label="操控" name="operate">
        <Operate :deviceid="id" :device="currDevice" />
      </el-tab-pane>
      <el-tab-pane label="基础配置" name="form1">
        <div class="formWrap">
          <el-form ref="form1" :model="form1" :rules="ruleValidateForm1" label-width="120px">
            <el-form-item label="banner文字" prop="bannertitle">
              <el-input v-model="form1.bannertitle" placeholder="请输入banner文字" />
            </el-form-item>
            <el-form-item label="banner高度" prop="bannerheight">
              <el-input v-model="form1.bannerheight" readonly placeholder="请输入banner高度" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="commit('form1')">下 一 步</el-button>
              <el-button @click="reset('form1')">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="画框配置" name="form2">
        <div class="formWrap">
          <el-form ref="form2" :model="form2" :rules="ruleValidateForm2" label-width="120px">
            <el-form-item label="画框模式" prop="framegrid">
              <el-select v-model="form2.framegrid" placeholder="请选择画框模式" style="width: 100%;" @change="framegridChange">
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
                  <div v-for="(item,k) in gridTotal" :key="k" :ref="'grid_' + item.serial" class="gridItem" :style="{ gridArea: item.gridArea }"><el-checkbox-button :label="item">{{ k + 1 }}</el-checkbox-button></div>
                </div>
              </el-checkbox-group>
              <p>
                <el-button plain @click="toMerge">合并</el-button>
              </p>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="commitTemp('form2')">下 一 步</el-button>
              <el-button @click="reset('form2')">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="通道配置" name="passset">
        <PassSet ref="passset" :allchannels="allChannels" :grid-for-pass-set="gridForPassSet" :editframes="currDevice.frames" @submitAll="submitAll" />
      </el-tab-pane>
      <el-tab-pane label="报警信息" name="warn">
        <Warn ref="warn" :deviceid="id" :allchannels="allChannels" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PassSet from './PassSet'
import Operate from './Operate'
import Warn from './Warn'
import { getAllChannels } from '@/api/channel'
import { getDevice, postDevice } from '@/api/device'
export default {
  components: { PassSet, Operate, Warn },
  data() {
    return {
      currTab: 'operate',
      allChannels: [],
      id: null,
      currDevice: {},
      form1: {
        bannertitle: '',
        bannerheight: 0
      },
      ruleValidateForm1: {
        bannertitle: [
          { required: true, message: 'banner名称不能为空', trigger: 'blur' }
        ],
        bannerheight: [
          { required: true, message: 'banner高度不能为空', trigger: 'blur' }
        ]
      },
      form2: {
        framegrid: null
      },
      checkList: [],
      gridTotal: [],
      tempClass: {},
      ruleValidateForm2: {
        framegrid: [
          { required: true, message: '画框模式不能为空', trigger: 'change' }
        ]
      },
      gridOffsetWidth: 0,
      gridOffsetHeight: 0,
      channelW: 0,
      channelH: 0,
      bannH: 0,
      gridForPassSet: {}
    }
  },
  watch: {
    gridTotal(newval) {
      var filtedGridTotal = newval.filter((item) => {
        return item.display === 'block'
      })
      this.gridForPassSet = {
        gridTotal: JSON.parse(JSON.stringify(filtedGridTotal)),
        framegrid: this.form2.framegrid
      }
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
    if (this.id) {
      this.$refs.warn.handleFilter()
    }
  },
  methods: {
    getDevice() {
      getDevice({ id: this.id }).then(response => {
        this.currDevice = response
        this.form1 = {
          bannertitle: this.currDevice.bannertitle,
          bannerheight: this.currDevice.bannerheight
        }
        if (this.currDevice.framegrid) {
          this.form2 = {
            framegrid: this.currDevice.framegrid
          }
          this.$nextTick(() => {
            this.framegridChange(this.currDevice.framegrid, 'edit')
          })
        }
        // var gridArr = []
        // for (var i = 0; i < this.currDevice.framecnt; i++) {
        //   gridArr.push({
        //     serial: this.currDevice.frames[i].serial,
        //     gridArea: this.currDevice.frames[i].gridArea,
        //     displayx: this.currDevice.frames[i].displayx,
        //     displayy: this.currDevice.frames[i].displayy,
        //     displayw: this.currDevice.frames[i].displayw,
        //     displayh: this.currDevice.frames[i].displayh,
        //     display: this.currDevice.frames[i].display
        //   })
        // }
        // this.gridTotal = gridArr
      })
    },
    framegridChange(val, to = '') {
      this.checkList = []
      // 计算每个框的宽高像素
      this.channelW = Math.round(1920 / val)
      this.channelH = Math.round(this.channelW / 1.05 * 9 / 16)
      this.bannH = 1080 - this.channelH * val
      var gridWrap = document.querySelector('#gridWrap')

      this.$nextTick(() => {
        gridWrap.innerHTML = ''
        this.gridTotal = []

        this.$nextTick(() => {
          if (gridWrap) {
            // 修改网格容器样式
            var gridW = gridWrap.clientWidth || 480
            var gridH = gridWrap.clientHeight || (480 * 9 / 16)
            var gridItemW = gridW / val
            var gridItemH = gridH / val
            this.tempClass = {
              'grid-template-columns': `repeat(${val}, ${gridItemW}px)`,
              'grid-template-rows': `repeat(${val}, ${gridItemH}px)`
            }

            // 生成网格元素
            var gridArr = []
            if (to === 'edit' && this.currDevice.framecnt) {
              for (var j = 0; j < this.currDevice.framecnt; j++) {
                gridArr.push(this.currDevice.frames[j])
              }
              this.gridTotal = gridArr
            } else {
              var num = 0
              num = val * val
              for (var i = 0; i < num; i++) {
                gridArr.push({
                  serial: i + 1,
                  gridArea: '',
                  displayx: '',
                  displayy: '',
                  displayw: '',
                  displayh: '',
                  display: 'block'
                })
              }
              this.gridTotal = gridArr
              this.$nextTick(() => {
                // 保存每个单元格的宽高，因为offsetTop offsetLeft 获取到的值被取整 所以不能直接用上面的gridItemW gridItemH
                this.gridOffsetWidth = this.$refs['grid_2'][0].offsetLeft
                this.gridOffsetHeight = this.$refs['grid_' + (val + 1)][0].offsetTop
                this.calcInit()
              })
            }
          }
        })
      })
    },
    calcInit() {
      this.gridTotal.map((item) => {
        var offLeft = this.$refs['grid_' + item.serial][0].offsetLeft

        var offTop = this.$refs['grid_' + item.serial][0].offsetTop
        item.displayx = Math.round(offLeft / this.gridOffsetWidth) * this.channelW
        item.displayy = Math.round(offTop / this.gridOffsetHeight) * this.channelH + this.bannH
        item.displayw = this.channelW
        item.displayh = this.channelH
      })
    },
    doMerge() {
      // console.log(this.checkList)
      var row_num = parseInt(this.checkList.length ** 0.5)
      this.checkList.sort((a, b) => {
        return a.serial - b.serial
      })
      var serialArr = this.checkList.map((item) => {
        return item.serial
      })
      console.log(serialArr)
      var leftTopItem = this.checkList[0]
      var originRowSpan = parseInt(leftTopItem.displayw / this.channelW)
      var originColumnSpan = parseInt(leftTopItem.displayh / this.channelH)
      var columnStart = parseInt(leftTopItem.displayx / this.channelW) + 1
      var rowStart = parseInt(leftTopItem.displayy / this.channelH) + 1
      this.gridTotal[leftTopItem.serial - 1].gridArea = `${rowStart} / ${columnStart} / span ${originRowSpan * row_num} / span ${originColumnSpan * row_num}`

      this.$nextTick(() => {
        this.gridTotal.map((item) => {
          var offLeft = this.$refs['grid_' + item.serial][0].offsetLeft
          var offTop = this.$refs['grid_' + item.serial][0].offsetTop
          item.displayx = Math.round(offLeft / this.gridOffsetWidth) * this.channelW
          item.displayy = Math.round(offTop / this.gridOffsetHeight) * this.channelH + this.bannH
          if (item.serial === leftTopItem.serial) {
            item.displayw = originRowSpan * row_num * this.channelW
            item.displayh = originColumnSpan * row_num * this.channelH
          } else if (serialArr.indexOf(item.serial) !== -1) {
            this.$refs['grid_' + item.serial][0].remove()
            item.display = 'none'
          }
        })
      })
      this.checkList = []
    },
    toMerge() {
      console.log(this.checkList)
      if (this.checkList.length > 3 && this.checkList.length < this.form2.framegrid ** 2) {
        if (parseInt(this.checkList.length ** 0.5) === parseFloat(this.checkList.length ** 0.5)) {
          // 检查被选画框的宽高是否都是相同的
          var oneW = this.checkList[0].displayw
          var oneH = this.checkList[0].displayh
          var filteredW = this.checkList.every((item) => {
            return item.displayw === oneW
          })
          var filteredH = this.checkList.every((item) => {
            return item.displayh === oneH
          })
          if (filteredW && filteredH) {
            // 检查被选画框的坐标是否符合规律 按照x坐标分组
            var row_num = parseInt(this.checkList.length ** 0.5)
            var myO = {}
            this.checkList.map((item) => {
              if (myO[item.displayx]) {
                myO[item.displayx].push(item)
              } else {
                myO[item.displayx] = [item]
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
                  return a.displayy - b.displayy
                })

                var diffNumArr_y = []
                for (var j = 0; j < myO[key].length - 1; j++) {
                  diffNumArr_y.push(myO[key][j + 1].displayy - myO[key][j].displayy)
                }
                var checkYres = diffNumArr_y.every(item => diffNumArr_y[0] === item && diffNumArr_y[0] === oneH)
                console.log(key + '/' + checkYres)
                checkYresArr.push(checkYres)
              }
              // 判断按照x分组后 每组按y排序后 每组的y坐标组成的字符串是否相同
              var strYO = {}
              for (var kk in myO) {
                strYO[kk] = myO[kk].map((item) => {
                  return item.displayy
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
          this.currTab = 'form2'
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    commitTemp(formname) {
      this.$refs[formname].validate((valid) => {
        if (valid) {
          var filtedGridTotal = this.gridTotal.filter((item) => {
            return item.display === 'block'
          })
          this.gridForPassSet = {
            gridTotal: JSON.parse(JSON.stringify(filtedGridTotal)),
            framegrid: this.form2.framegrid
          }
          this.currTab = 'passset'
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
    },
    submitAll() {
      var frames = this.$refs.passset.frames
      var formconcat = { ...this.form1, ...this.form2 }
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
