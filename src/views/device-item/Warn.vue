<template>
  <div>
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
      <el-form-item prop="channel_id">
        <el-select v-model="filterForm.channel_id" placeholder="请选择频道">
          <el-option label="全部频道" value="" />
          <el-option v-for="(it, i) in allchannels" :key="i" :value="it.id" :label="it.name" />
        </el-select>
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="filterForm.type" placeholder="类型">
          <el-option label="全部类型" value="" />
          <el-option label="静帧" :value="0" />
          <el-option label="黑场" :value="1" />
          <el-option label="静音" :value="2" />
          <el-option label="爆音" :value="3" />
          <el-option label="断流" :value="4" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('filterForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 841px;">
      <!-- <el-table-column label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="频道" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.channel.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.device.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警类型" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.typestr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.starttime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="恢复时间" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.recoverytime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.duration }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="eventid" align="center">
        <template slot-scope="{row}">
          <span>{{ row.eventid }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.statusstr }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getAlarms } from '@/api/device'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  components: { Pagination },
  directives: { waves },
  props: {
    deviceid: {
      type: Number,
      default: 0
    },
    allchannels: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20
      },
      filterForm: {
        create_time_range: [],
        update_time_range: [],
        device_id: '',
        channel_id: '',
        type: ''
      }
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      getAlarms(this.listQuery).then(data => {
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
      this.listQuery.device_id = this.deviceid
      if (this.filterForm.create_time_range && this.filterForm.create_time_range.length) {
        this.listQuery.create_time_range = this.filterForm.create_time_range
      }
      if (this.filterForm.update_time_range && this.filterForm.update_time_range.length) {
        this.listQuery.update_time_range = this.filterForm.update_time_range
      }
      if (this.filterForm.channel_id !== '') {
        this.listQuery.channel_id = this.filterForm.channel_id
      }
      if (this.filterForm.type !== '') {
        this.listQuery.type = this.filterForm.type
      }
      this.getList()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.handleFilter()
    }
  }
}
</script>
