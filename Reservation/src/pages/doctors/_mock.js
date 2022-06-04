// eslint-disable-next-line import/no-extraneous-dependencies
const names = [
  '张医生',
  '李医生',
  '王医生',
  '陈医生',
  '徐医生',
  '赵医生',
  '林医生',
  '孙医生',
];

const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const hospitals = [
  '浙江大学附属第一医院',
  '浙江省立同德医院',
  '浙大二院',
  '浙江大学附属第一医院',
  '浙江省立同德医院',
];

const departments = [
  '外科',
  '小儿科',
  '内科',
  '内科',
  '小儿科',
];

function fakeList(count) {
  const list = [];

  for (let i = 0; i < count; i += 1) {
    list.push({
      id: 20023+i,
      realName: names[i % 8],
      avatar: avatars[i % 8],
      hospital: hospitals[i % 5],
      department: departments[i % 5],
    });
  }

  return list;
}

function getFakeHospitals(req, res) {
  return res.json({
    success: true,
    data: ['浙江大学附属第一医院', '浙大二院', '浙江省立同德医院'],
  });
}

function getFakeDepartments(req, res) {
  return res.json({
    success: true,
    data: ['外科', '内科', '小儿科'],
  });
}

function getFakeDoctors(req, res) {
  const result = fakeList(50);
  return res.json({
    success: true,
    data: result,
  });
}

function postFakeReservation(req, res) {
  
}

function getFakeArrangement(req, res) {
  return res.json({
    success: true,
    data: {
      0: [
        {
          start: "12:00:00",
          end: "13:00:00",
        },
        {
          start: "15:00:00",
          end: "16:00:00",
        },
      ],
      1: [
        {
          start: "13:00:00",
          end: "14:00:00",
        },
      ],
      2: [
        {
          start: "12:00:00",
          end: "13:00:00",
        },
        {
          start: "16:00:00",
          end: "16:30:00",
        },
      ],
      3: [
        {
          start: "12:00:00",
          end: "13:00:00",
        },
      ],
      4: [
        {
          start: "12:00:00",
          end: "13:00:00",
        },
      ],
      5: [
        {
          start: "00:00:00",
          end: "01:00:00",
        },
        {
          start: "12:00:00",
          end: "13:00:00",
        },
      ],
      6: [
        {
          start: "13:00:00",
          end: "14:00:00",
        },
      ],
    },
  });
}

function getFakeOccupiedRanges(req, res) {
  return res.json({
    success: true,
    data: {
      0: [
        {
          start: "15:00:00",
          end: "16:00:00",
        },
      ],
      1: [
        {
          start: "13:00:00",
          end: "14:00:00",
        },
      ],
      2: [
        
      ],
      3: [
        
      ],
      4: [
        {
          start: "12:00:00",
          end: "13:00:00",
        },
      ],
      5: [
        
      ],
      6: [
        
      ],
    },
  });
}

export default {
  'GET  /api/doctor': getFakeDoctors,
  'GET  /api/doctor/all': getFakeDoctors,
  'GET  /api/doctor/hospital/:hospital': getFakeDoctors,
  'GET  /api/doctor/dept/:dept': getFakeDoctors,

  'GET  /api/hospital': getFakeHospitals,
  'GET  /api/dept': getFakeDepartments,
  'POST /api/make_appoint': postFakeReservation,
  'GET  /api/arrange/:id': getFakeArrangement,
  'GET  /api/occupation': getFakeOccupiedRanges,
};
