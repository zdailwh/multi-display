import request from '@/utils/request'

export function fetchList(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }
  if (query.create_time_range && query.create_time_range.length) {
    params.create_time_range = query.create_time_range
  }
  if (query.update_time_range && query.update_time_range.length) {
    params.update_time_range = query.update_time_range
  }
  if (query.name !== '') {
    params.name = query.name
  }
  params.orderby = 'id'
  return request({
    url: '/admin/monitor/v1/devices',
    method: 'get',
    params
  })
}

export function getDevice(query) {
  return request({
    url: '/admin/monitor/v1/devices/' + query.id,
    method: 'get'
  })
}

export function createDevice(data) {
  return request({
    url: '/admin/monitor/v1/devices',
    method: 'post',
    data: data
  })
}

export function updateDevice(data) {
  return request({
    url: '/admin/monitor/v1/devices/' + data.id,
    method: 'put',
    data: data
  })
}

export function postDevice(data) {
  return request({
    url: '/admin/monitor/v1/devices/' + data.id,
    method: 'post',
    data: data
  })
}

export function deleteDevice(query) {
  return request({
    url: '/admin/monitor/v1/devices/' + query.id,
    method: 'delete'
  })
}
// 设置全屏
export function screenDevice(data) {
  return request({
    url: '/admin/monitor/v1/devices/' + data.id + '/screen',
    method: 'put',
    data: {
      frameno: data.frameno
    }
  })
}

// 设置静音
export function unmuteDevice(data) {
  return request({
    url: '/admin/monitor/v1/devices/' + data.id + '/unmute',
    method: 'put',
    data: {
      frameno: data.frameno
    }
  })
}
// 软件重启
export function confignew(data) {
  return request({
    url: '/admin/monitor/v1/devices/' + data.id + '/confignew',
    method: 'put'
  })
}
// 频道重启
export function versionew(data) {
  return request({
    url: '/admin/monitor/v1/devices/' + data.id + '/channelreset',
    method: 'put',
    data: {
      frameno: data.frameno
    }
  })
}

// 获取报警信息
export function getAlarms(query) {
  var params = {
    page: query.page - 1,
    per_page: query.limit
  }

  if (query.create_time_range && query.create_time_range.length) {
    params.create_time_range = query.create_time_range
  }
  if (query.update_time_range && query.update_time_range.length) {
    params.update_time_range = query.update_time_range
  }
  if (query.device_id !== '') {
    params.device_id = query.device_id
  }
  if (query.channel_id !== '') {
    params.channel_id = query.channel_id
  }
  if (query.type !== '') {
    params.type = query.type
  }
  return request({
    url: '/admin/monitor/v1/alarms',
    method: 'get',
    params
  })
}
