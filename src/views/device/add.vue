<template>
  <el-dialog
    title="创建设备"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="formadd.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类型" prop="devicetype">
          <el-select v-model="formadd.devicetype" placeholder="请选择设备类型" style="width: 100%;">
            <el-option :value="0" label="多画面监看" />
            <el-option :value="1" label="录制服务器" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备IP" prop="ip">
          <el-input v-model="formadd.ip" placeholder="请输入设备IP" />
        </el-form-item>
        <el-form-item label="输入网卡IP" prop="devips">
          <el-input v-model="formadd.devips" placeholder="当为多个IP时，用|连接，如：127.0.0.0|127.0.0.1|127.0.0.2" />
        </el-form-item>
        <el-form-item label="媒资目录" prop="mediapath">
          <el-input v-model="formadd.mediapath" placeholder="请输入媒资目录" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="reset">取 消</el-button>
      <el-button type="primary" @click="commit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { createDevice } from '@/api/device'
export default {
  props: {
    dialogVisibleAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formadd: {
        name: '',
        devicetype: 0,
        ip: '',
        devips: '',
        mediapath: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        devicetype: [
          { required: true, message: '设备类型不能为空', trigger: 'change' }
        ],
        ip: [
          { required: true, message: '设备IP不能为空', trigger: 'blur' }
        ],
        devips: [
          { required: true, message: '输入网卡IP不能为空', trigger: 'blur' }
        ],
        mediapath: [
          { required: true, message: '媒资目录不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
  },
  methods: {
    commit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createDevice()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createDevice() {
      console.log(this.formadd)
      createDevice(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          name: '',
          devicetype: 0,
          ip: '',
          devips: '',
          mediapath: ''
        }
        this.$emit('changeAddVisible', false)
        this.$emit('refresh')
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.$emit('changeAddVisible', false)
    },
    handleClose(done) {
      this.$emit('changeAddVisible', false)
      // done()
    }
  }
}
</script>
