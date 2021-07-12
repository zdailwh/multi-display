const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: '@datetime',
    name: '@first',
    port: '1',
    'type|1': [1, 2],
    'status|1': [0, 1, 2]
  }))
}

const device = Mock.mock({
  id: 22,
  class: 'app\\monitor\\logic\\MultiScreen',
  class_name: '多画面设备',
  model_name: '多画面设备',
  create_time: '2021-07-08 16:50:45',
  update_time: '2021-07-09 15:07:26',
  status: 0,
  statusstr: '失效',
  path: '/api/admin/monitor/v1/devices/22',
  ip: '192.168.6.201',
  name: 'test1',
  deviceid: 10000,
  devicetype: 0,
  devips: '192.168.6.201|192.168.10.201',
  mediapath: '/storage/record/',
  spacetotal: 0,
  spaceavail: 0,
  heartbeat: 0,
  bannertitle: '测试',
  bannerheight: 0,
  framegrid: 2,
  framecnt: 4,
  voicemode: 0,
  screenmode: 0,
  configversion: 0,
  frames: [
    {
      device_class: 'app\\monitor\\logic\\MultiScreen',
      device_id: 22,
      channel_class: 'app\\monitor\\logic\\Channel',
      channel_id: 1,
      channel: null,
      frameno: 1,
      namesize: 0,
      namecolour: '',
      position: '',
      decoder: '',
      resolution: '',
      display: 'block',
      displayx: 0,
      displayy: 52,
      displayw: 960,
      displayh: 514,
      gridarea: '',
      serial: 1,
      recordpath: '',
      recordfile: '',
      encoder: '',
      bitrate: '111',
      width: 0,
      height: 0,
      frozenduration: 1,
      blackduration: 1,
      silenceduration: 1,
      burstduration: 1,
      receiveip: '',
      status: 0,
      class: 'app\\monitor\\logic\\FrameChannel',
      id: 52,
      delete_id: 0,
      create_time: '2021-07-08 16:50:45',
      update_time: '2021-07-09 13:34:27'
    },
    {
      device_class: 'app\\monitor\\logic\\MultiScreen',
      device_id: 22,
      channel_class: 'app\\monitor\\logic\\Channel',
      channel_id: 1,
      channel: '',
      frameno: 2,
      namesize: 0,
      namecolour: '',
      position: '',
      decoder: '',
      resolution: '',
      display: 'block',
      displayx: 960,
      displayy: 52,
      displayw: 960,
      displayh: 514,
      gridarea: '',
      serial: 2,
      recordpath: '',
      recordfile: '',
      encoder: '',
      bitrate: '222',
      width: 0,
      height: 0,
      frozenduration: 2,
      blackduration: 2,
      silenceduration: 2,
      burstduration: 2,
      receiveip: '',
      status: 0,
      class: 'app\\monitor\\logic\\FrameChannel',
      id: 52,
      delete_id: 0,
      create_time: '2021-07-08 16:50:45',
      update_time: '2021-07-09 13:34:27'
    },
    {
      device_class: 'app\\monitor\\logic\\MultiScreen',
      device_id: 22,
      channel_class: 'app\\monitor\\logic\\Channel',
      channel_id: 1,
      channel: '',
      frameno: 3,
      namesize: 0,
      namecolour: '',
      position: '',
      decoder: '',
      resolution: '',
      display: 'block',
      displayx: 0,
      displayy: 566,
      displayw: 960,
      displayh: 514,
      gridarea: '',
      serial: 3,
      recordpath: '',
      recordfile: '',
      encoder: '',
      bitrate: '333',
      width: 0,
      height: 0,
      frozenduration: 3,
      blackduration: 3,
      silenceduration: 3,
      burstduration: 3,
      receiveip: '',
      status: 0,
      class: 'app\\monitor\\logic\\FrameChannel',
      id: 52,
      delete_id: 0,
      create_time: '2021-07-08 16:50:45',
      update_time: '2021-07-09 13:34:27'
    },
    {
      device_class: 'app\\monitor\\logic\\MultiScreen',
      device_id: 22,
      channel_class: 'app\\monitor\\logic\\Channel',
      channel_id: 1,
      channel: '',
      frameno: 4,
      namesize: 0,
      namecolour: '',
      position: '',
      decoder: '',
      resolution: '',
      display: 'block',
      displayx: 960,
      displayy: 566,
      displayw: 960,
      displayh: 514,
      gridarea: '',
      serial: 4,
      recordpath: '',
      recordfile: '',
      encoder: '',
      bitrate: '444',
      width: 0,
      height: 0,
      frozenduration: 4,
      blackduration: 4,
      silenceduration: 4,
      burstduration: 4,
      receiveip: '',
      status: 0,
      class: 'app\\monitor\\logic\\FrameChannel',
      id: 52,
      delete_id: 0,
      create_time: '2021-07-08 16:50:45',
      update_time: '2021-07-09 13:34:27'
    }
  ]
})

module.exports = [
  {
    url: '/admin/monitor/v1/devices/[0-9]',
    type: 'get',
    response: config => {
      return device
    }
  },
  {
    url: '/admin/monitor/v1/devices',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 0, per_page = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < per_page * (page + 1) && index >= per_page * page)

      return {
        total: mockList.length,
        items: pageList
      }
    }
  },
  {
    url: '/admin/monitor/v1/devices/[0-9]',
    type: 'put',
    response: config => {
      return device
    }
  },
  {
    url: '/admin/monitor/v1/devices',
    type: 'post',
    response: config => {
      return device
    }
  },
  {
    url: '/admin/monitor/v1/devices/[0-9]',
    type: 'delete',
    response: config => {
      return device
    }
  }
]

