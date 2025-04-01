// 模拟用户数据
const users = {
  admin: {
    token: 'admin-token',
    roles: ['admin'],
    name: 'Admin User',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
  },
  editor: {
    token: 'editor-token',
    roles: ['editor'],
    name: 'Editor User',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  user: {
    token: 'user-token',
    roles: ['user'],
    name: 'Normal User',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
  }
}

export function mockLogin(data) {
  const { username } = data
  const userData = users[username] || users.admin
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '登录成功',
        data: {
          token: userData.token
        }
      })
    }, 300)
  })
}

export function mockGetUserInfo(token) {
  let userInfo = Object.values(users).find(user => user.token === token)
  if (!userInfo) {
    userInfo = users.admin
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '获取用户信息成功',
        data: {
          roles: userInfo.roles,
          name: userInfo.name,
          avatar: userInfo.avatar
        }
      })
    }, 300)
  })
}

export function mockLogout() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        message: '退出成功'
      })
    }, 300)
  })
} 