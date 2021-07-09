<template>
  <el-dialog
    title="创建频道"
    :visible.sync="dialogVisibleAdd"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formadd" :rules="ruleValidate" label-width="100px">
        <el-form-item label="频道名称" prop="name">
          <el-input v-model="formadd.name" placeholder="请输入频道名称" />
        </el-form-item>
        <el-form-item label="频道编号" prop="no">
          <el-input v-model="formadd.no" placeholder="请输入频道编号" />
        </el-form-item>
        <el-form-item label="频道类型" prop="type">
          <el-select v-model="formadd.type" placeholder="请选择频道类型" style="width: 100%;">
            <el-option :value="0" label="电视" />
            <el-option :value="1" label="广播" />
          </el-select>
        </el-form-item>
        <el-form-item label="频道链接" prop="chnurl">
          <el-input v-model="formadd.chnurl" placeholder="请输入频道链接" />
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
import { createChannel } from '@/api/channel'
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
        no: '',
        type: '',
        chnurl: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '频道名称不能为空', trigger: 'blur' }
        ],
        no: [
          { required: true, message: '频道编号不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '频道类型不能为空', trigger: 'change' }
        ],
        chnurl: [
          { required: true, message: '频道链接不能为空', trigger: 'blur' }
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
          this.createChannel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    createChannel() {
      console.log(this.formadd)
      createChannel(this.formadd).then(response => {
        this.$message({
          message: '创建成功！',
          type: 'success'
        })
        this.formadd = {
          name: '',
          no: '',
          type: '',
          chnurl: ''
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
