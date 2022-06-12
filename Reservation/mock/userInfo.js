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
    recordID: 1,
    doctorName: '张小丽',
    description: '腹胀腹泻腹痛伴呕吐1天',
  },
  {
    recordID: 3,
    doctorName: '胡英俊',
    description: '腹胀腹泻腹痛伴呕吐1天',
  },
];

const bills = [
  {
    key: '1',
    paytime: '2022-04-24 18:00:00',
    state: 'success',
    text: '已支付',
    price: '280',
    xiangqing: "马应龙痔疮膏×1盒：100元,\
    致康胶囊×3盒：100元,\
    医生检查费用：80元",
  },
  {
    key: '2',
    paytime: '2022-04-24 18:00:00',
    state: 'success',
    text: '已支付',
    price: '280',
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
