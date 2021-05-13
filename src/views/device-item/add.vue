<template>
  <el-dialog
    title="创建频道"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="formadd.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类型" prop="type">
          <el-select v-model="formadd.type" placeholder="请选择设备类型" style="width: 100%;">
            <el-option :value="1" label="多画面监看" />
            <el-option :value="2" label="录制服务器" />
          </el-select>
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
        type: null
      },
      ruleValidate: {
        name: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '设备类型不能为空', trigger: 'change' }
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
          type: null
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
