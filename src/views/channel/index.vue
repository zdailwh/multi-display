<template>
  <div class="app-container">
    <el-form ref="filterForm" :model="filterForm" :inline="true" class="filter-form">
      <el-form-item prop="create_time_range">
        <el-date-picker
          v-model="filterForm.create_time_range"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期"
        />
      </el-form-item>
      <el-form-item prop="update_time_range">
        <el-date-picker
          v-model="filterForm.update_time_range"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="更新开始日期"
          end-placeholder="更新结束日期"
        />
      </el-form-item>
      <br>
      <el-form-item prop="name">
        <el-input v-model="filterForm.name" placeholder="频道名称" style="width:120px" />
      </el-form-item>
      <el-form-item prop="no">
        <el-input v-model="filterForm.no" placeholder="频道编号" style="width:120px" />
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="dialogVisibleAdd = true">
        创建频道
      </el-button>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 841px;">
      <el-table-column label="频道编号" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.no }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频道名称" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频道类型" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.type === 0 ? '电视' : '广播' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="频道链接" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.chnurl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警" align="center" width="80">
        <template slot-scope="{row}">
          <el-tag v-if="row.alarmflag === 1" type="success">开启</el-tag>
          <el-tag v-if="row.alarmflag === 0" type="danger">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row, $index}">
          <el-button v-if="row.alarmflag === 0" type="text" size="medium" @click="alarmon(row.id, $index)">开启报警</el-button>
          <el-button v-if="row.alarmflag === 1" type="text" size="medium" @click="alarmoff(row.id, $index)">关闭报警</el-button>
          <el-button type="text" size="medium" @click="editHandle(row, $index)">编辑</el-button>
          <el-popover
            placement="top"
            width="170"
            trigger="hover"
          >
            <p>确定要删除此频道吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="danger" size="mini" @click="delChannel(row.id, $index)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="medium" style="margin-left: 10px;">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <Add :dialog-visible-add="dialogVisibleAdd" @changeAddVisible="changeAddVisible" @refresh="getList" />
    <Edit :edit-item="editItem" :dialog-visible-edit="dialogVisibleEdit" @changeEditVisible="changeEditVisible" @refresh="getList" />
  </div>
</template>

<script>
import { fetchList, alarmon, alarmoff, deleteChannel } from '@/api/channel'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Add from './add.vue'
import Edit from './edit.vue'

export default {
  components: { Pagination, Add, Edit },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      filterForm: {
        create_time_range: [],
        update_time_range: [],
        name: '',
        port: ''
      },
      editItem: {},
      editIndex: '',
      dialogVisibleAdd: false,
      dialogVisibleEdit: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(data => {
        this.list = data.items
        this.total = data.total

        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      if (this.filterForm.create_time_range && this.filterForm.create_time_range.length) {
        this.listQuery.create_time_range = this.filterForm.create_time_range
      }
      if (this.filterForm.update_time_range && this.filterForm.update_time_range.length) {
        this.listQuery.update_time_range = this.filterForm.update_time_range
      }
      if (this.filterForm.name !== '') {
        this.listQuery.name = this.filterForm.name
      }
      if (this.filterForm.no !== '') {
        this.listQuery.no = this.filterForm.no
      }
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    },
    alarmon(id, idx) {
      alarmon({ id: id }).then(data => {
        this.$message({
          message: '开启报警成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    alarmoff(id, idx) {
      alarmoff({ id: id }).then(data => {
        this.$message({
          message: '关闭报警成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    delChannel(id, idx) {
      deleteChannel({ id: id }).then(response => {
        this.$message({
          message: '删除成功！',
          type: 'success'
        })
        this.getList()
      })
    },
    changeAddVisible(params) {
      this.dialogVisibleAdd = params
    },
    editHandle(item, idx) {
      this.editItem = item
      this.editIndex = idx
      this.dialogVisibleEdit = true
    },
    changeEditVisible(params) {
      this.dialogVisibleEdit = params
    }
  }
}
</script>
