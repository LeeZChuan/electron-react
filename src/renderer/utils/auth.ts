// 用户信息接口
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  lastLoginTime: number;
}

// 登录请求参数
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Mock 用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    lastLoginTime: Date.now()
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    role: 'user',
    lastLoginTime: Date.now()
  }
];

// Mock 登录逻辑
export const mockLogin = async (params: LoginParams): Promise<LoginResponse> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { username, password } = params;
  
  // 验证用户名和密码
  if (username === 'admin' && password === 'admin123') {
    const user = mockUsers.find(u => u.username === username);
    if (user) {
      // 更新最后登录时间
      user.lastLoginTime = Date.now();
      
      return {
        success: true,
        message: '登录成功',
        user,
        token: `mock_token_${Date.now()}`
      };
    }
  } else if (username === 'user' && password === 'user123') {
    const user = mockUsers.find(u => u.username === username);
    if (user) {
      user.lastLoginTime = Date.now();
      
      return {
        success: true,
        message: '登录成功',
        user,
        token: `mock_token_${Date.now()}`
      };
    }
  }
  
  return {
    success: false,
    message: '用户名或密码错误'
  };
};

// 检查是否已登录
export const checkLoginStatus = (): boolean => {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('auth_user');
  return !!(token && user);
};

// 获取当前用户信息
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('auth_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

// 保存登录信息
export const saveLoginInfo = (user: User, token: string): void => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
};

// 清除登录信息
export const clearLoginInfo = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

// 登出
export const logout = (): void => {
  clearLoginInfo();
  // 可以在这里添加其他登出逻辑，比如清除其他缓存等
}; 