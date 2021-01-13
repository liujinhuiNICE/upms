const getters = {
  userInfo: (state) => state.user.userInfo,
  token: (state) => state.user.token,
  username: (state) => state.user.username,
  userId: (state) => state.user.userId,
  roles: (state) => state.user.roles,
  opened: (state) => {
    if (state.app.opened === 'false') {
      return false
    } if (state.app.opened === 'true') {
      return true
    }
  }
}
export default getters
