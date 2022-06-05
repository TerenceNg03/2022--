const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (req, res) => {
    if (!access) {
      res.status(401).send({
        success: true,
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
      });
      return;
    }

    if(access === 'patient') {
      res.send({
        success: true,
        data: {
          name: 'Serati Ma',
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          id: '10001',
          notifyCount: 12,
          unreadCount: 11,
          access: access,
          geographic: {
            province: '浙江省',
            city: '杭州市',
            address: '西湖区工专路 77 号',
          },
          phone: '0752-268888888',
        },
      });
      return;
    }

    res.send({
      success: true,
      data: {
        name: '张医生',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        id: '20023',
        notifyCount: 12,
        unreadCount: 11,
        access: access,
        geographic: {
          province: '浙江省',
          city: '杭州市',
          address: '西湖区工专路 77 号',
        },
        phone: '0752-268888888',
      },
    });
  },
  'POST /api/login/account': async (req, res) => {
    access = req.body.role;

    res.send({
      status: 'ok',
      currentAuthority: access,
    });
  },
  'POST /api/login/outLogin': (req, res) => {
    access = '';
    res.send({
      data: {},
      success: true,
    });
  },
  'POST /api/register': (req, res) => {
    res.send({
      status: 'ok',
      currentAuthority: 'user',
      success: true,
    });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Forbidden',
      message: 'Forbidden',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
