<template>
  <div class="formWrap">
    <el-form ref="formdata" :model="formdata" :rules="ruleValidate" label-width="120px">
      <el-form-item label="声音监听" prop="voice">
        <el-select v-model="formdata.voice" placeholder="请选择要进行声音监听的频道" style="width: 100%;">
          <el-option value="" label="静音" />
          <el-option value="频道1" label="频道1" />
          <el-option value="频道2" label="频道2" />
        </el-select>
      </el-form-item>
      <el-form-item label="全屏监看" prop="screen">
        <el-select v-model="formdata.screen" placeholder="请选择要进行全屏监看的频道" style="width: 100%;">
          <el-option value="" label="多画面" />
          <el-option value="频道1" label="频道1" />
          <el-option value="频道2" label="频道2" />
        </el-select>
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
  data() {
    return {
      formdata: {
        voice: '',
        screen: ''
      },
      ruleValidate: {
      }
    }
  },
  watch: {
    'formdata.voice': function(val) {
      if (val) {
        this.formdata.screen = ''
      }
    },
    'formdata.screen': function(val) {
      if (val) {
        this.formdata.voice = ''
      }
    }
  },
  mounted() {
  },
  methods: {
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
    }
  }
}
</script>
