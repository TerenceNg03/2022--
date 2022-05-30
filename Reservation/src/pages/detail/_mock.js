const patient = {
  name: '张力',
  sex: '男',
  diagNumber: '123456',
  diagTime: '2021-12-25',
  IDCardNumber: 330202199506240912,
  medicalRecords: [],
};

function getDetail(req, res) {
  return res.json({
    data: patient,
  });
}

function changeStatus(req, res) {
  return res.json({
    data: {
      success: true,
    },
  });
}

function writeDiagnose(req, res) {
  return res.json({
    data: {
      success: true,
      id: 1,
    },
  });
}

export default {
  'GET  /api/get_detail': getDetail,
  'POST /api/change_status': changeStatus,
  'GET  /api/write': writeDiagnose,
};