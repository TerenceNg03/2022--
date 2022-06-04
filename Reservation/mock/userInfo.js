// eslint-disable-next-line import/no-extraneous-dependencies
const reservations = [
  {
    key: '1',
    time: '2022/5/26',
    department: '普通外科',
    doctor: '张医生',
    address: '浙江大学附属第一医院',
  },
  {
    key: '2',
    time: '2022/2/23',
    department: '肛肠科',
    doctor: '李医生',
    address: '浙江大学附属第一医院',
  },
  {
    key: '3',
    time: '2021/12/9',
    department: '精神病科',
    doctor: '王医生',
    address: '浙江省立同德医院',
  },
];

const records = [
  {
    title: '马应龙痔疮膏',
  },
  {
    title: '盐酸伪麻黄碱片',
  },
  {
    title: '致康胶囊',
  },
  {
    title: '泰诺',
  },
];

const bills = [
  {
    key: '1',
    name: '张三',
    canbao: '是',
    zhifufangshi: '支付宝',
    ordertime: '2022-04-24 18:00:00',
    jiuzhentime: '2019-04-24 18:00:00',
    address: '浙江大学附属第一医院',
    state: 'success',
    text: '已支付',
    gongjizhifu: '280',
    yibaodaifu: '200',
    zifeizhifu: '80',
    xiangqing: "马应龙痔疮膏×1盒：100元,\
    致康胶囊×3盒：100元,\
    医生检查费用：80元",
  },
  {
    key: '2',
    name: '张三',
    canbao: '是',
    zhifufangshi: '支付宝',
    ordertime: '2022-04-24 18:00:00',
    jiuzhentime: '2019-04-24 18:00:00',
    address: '浙江大学附属第一医院',
    state: 'success',
    text: '已支付',
    gongjizhifu: '280',
    yibaodaifu: '200',
    zifeizhifu: '80',
    xiangqing: "马应龙痔疮膏×1盒：100元,\
    致康胶囊×3盒：100元,\
    医生检查费用：80元",
  }
];

function getReservations(req, res) {
  return res.json({
    data: reservations,
  });
}

function getRecords(req, res) {
  return res.json({
    data: records,
  });
}

function getBills(req, res) {
  return res.json({
    data: bills,
  });
}

export default {
  'GET  /api/reservation/get_reservations': getReservations,
  'GET  /api/record/get_records': getRecords,
  'GET  /api/pharmacy/get_bills': getBills,
};
