/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { currentUser } = initialState || {};
  return {
    canPatient: currentUser && (currentUser.access === 'patient' || currentUser.access === 'admin'),
    canDoctor: currentUser && (currentUser.access === 'doctor' || currentUser.access === 'admin'),
  };
}
