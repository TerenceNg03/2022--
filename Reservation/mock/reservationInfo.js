const patient = {
  name: '张力',
  sex: '男',
  age: 27,
  diagNumber: '123456',
  diagTime: '2021-12-25',
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
  'GET  /api/management/get_detail': getDetail,
  'POST /api/reservation/change_status': changeStatus,
  'GET  /api/record/write': writeDiagnose,
};