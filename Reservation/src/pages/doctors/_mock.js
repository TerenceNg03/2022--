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
const desc = [
  '该医生很牛',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
];

function fakeList(count) {
  const list = [];

  for (let i = 0; i < count; i += 1) {
    list.push({
      id: 20023+i,
      name: names[i % 8],
      avatar: avatars[i % 8],
      description: desc[i % 5],
      href: 'https://ant.design',
    });
  }

  return list;
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
          start: "12:00",
          end: "13:00",
        },
        {
          start: "15:00",
          end: "16:00",
        },
      ],
      1: [
        {
          start: "13:00",
          end: "14:00",
        },
      ],
      2: [
        {
          start: "12:00",
          end: "13:00",
        },
        {
          start: "16:00",
          end: "16:30",
        },
      ],
      3: [
        {
          start: "12:00",
          end: "13:00",
        },
      ],
      4: [
        {
          start: "12:00",
          end: "13:00",
        },
      ],
      5: [
        {
          start: "00:00",
          end: "01:00",
        },
        {
          start: "12:00",
          end: "13:00",
        },
      ],
      6: [
        {
          start: "13:00",
          end: "14:00",
        },
      ],
    },
  });
}

function getFakePickedTime(req, res) {
  return res.json({
    success: true,
    data: {
      0: [
        {
          start: "15:00",
          end: "16:00",
        },
      ],
      1: [
        {
          start: "13:00",
          end: "14:00",
        },
      ],
      2: [
        
      ],
      3: [
        
      ],
      4: [
        {
          start: "12:00",
          end: "13:00",
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
  'GET  /api/get_doctors': getFakeDoctors,
  'POST /api/make_appoint': postFakeReservation,
  'GET  /api/arrange': getFakeArrangement,
  'GET  /api/query_picked_time': getFakePickedTime,
};
