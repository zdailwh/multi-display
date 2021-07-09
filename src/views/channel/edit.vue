<template>
  <el-dialog
    title="编辑频道"
    :visible.sync="dialogVisibleEdit"
    width="50%"
    :before-close="handleClose"
  >
    <div>
      <el-form ref="form" :model="editItem" :rules="ruleValidate" label-width="80px">
        <!-- <el-form-item label="频道名称" prop="name">
          <el-input v-model="editItem.name" placeholder="请输入频道名称" />
        </el-form-item> -->
        <el-form-item label="频道编号" prop="no">
          <el-input v-model="editItem.no" placeholder="请输入频道编号" />
        </el-form-item>
        <el-form-item label="频道类型" prop="type">
          <el-select v-model="editItem.type" placeholder="请选择频道类型" style="width: 100%;">
            <el-option :value="0" label="电视" />
            <el-option :value="1" label="广播" />
          </el-select>
        </el-form-item>
        <el-form-item label="频道链接" prop="chnurl">
          <el-input v-model="editItem.chnurl" placeholder="请输入频道链接" />
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
import { updateChannel } from '@/api/channel'
export default {
  props: {
    dialogVisibleEdit: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
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
          this.updateChannel()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateChannel() {
      updateChannel(this.editItem).then(response => {
        this.$message({
          message: '编辑成功！',
          type: 'success'
        })
        this.$emit('changeEditVisible', false)
        this.$emit('refresh')
      })
    },
    reset() {
      this.$refs.form.resetFields()
      this.$emit('changeEditVisible', false)
    },
    handleClose(done) {
      this.$emit('changeEditVisible', false)
      // done()
    }
  }
}
</script>
