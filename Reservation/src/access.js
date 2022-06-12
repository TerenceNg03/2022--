/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { currentUser } = initialState || {};
  return {
    canPatient: currentUser && (currentUser.access === 'PATIENT' || currentUser.access === 'ADMIN'),
    canDoctor: currentUser && (currentUser.access === 'DOCTOR' || currentUser.access === 'ADMIN'),
  };
}
