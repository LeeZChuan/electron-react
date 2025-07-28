# K线图表分析应用

基于 Electron React Boilerplate 开发的跨平台桌面应用，集成了专业的 K线图表分析功能。

## 技术栈

本项目基于 [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) 构建，使用以下技术：

- **Electron**: 跨平台桌面应用框架
- **React**: 用户界面开发
- **React Router**: 页面路由管理
- **Webpack**: 模块打包工具
- **React Fast Refresh**: 热重载开发体验
- **KLineCharts**: 专业金融图表库

## 安装

### 1. 克隆项目

```bash
git clone <your-repository-url>
cd electron-react
```

### 2. 安装依赖

```bash
npm install
```

**注意**: 如果遇到网络问题，建议设置代理：

```bash
# 设置 npm 代理（如果使用 ClashX 等代理软件）
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890

# 设置 Electron 镜像
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

### 3. 启动开发环境

```bash
npm start
```

## 打包发布

### 通用打包命令

```bash
# 打包当前平台
npm run package

# 打包 Mac 版本
npm run package:mac

# 打包 Windows 版本  
npm run package:win
```

### 打包输出目录

- **通用打包**: `release/build/`
- **Mac 打包**: `release/build-mac/`
- **Windows 打包**: `release/build-win/`

### 打包产物说明

#### Mac 版本
- `.dmg`: 安装包（推荐分发）
- `.zip`: 压缩包（便携版）

#### Windows 版本
- `.exe`: NSIS 安装包（推荐分发）
- `portable.exe`: 便携版（无需安装）
- `.zip`: 压缩包

### 打包配置

项目在 `package.json` 中配置了详细的打包选项：

```json
{
  "build": {
    "appId": "com.electron.kline-demo",
    "productName": "K线图表分析",
    "directories": {
      "output": "release/build"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "assets/icon.icns"
    },
    "win": {
      "target": [
        {"target": "nsis", "arch": ["x64", "ia32"]},
        {"target": "portable", "arch": ["x64", "ia32"]},
        {"target": "zip", "arch": ["x64", "ia32"]}
      ],
      "icon": "assets/icon.ico"
    }
  }
}
```

## 项目结构

```
electron-react/
├── assets/                 # 应用图标和资源
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── main.ts        # 主进程入口
│   │   ├── menu.ts        # 原生菜单配置
│   │   └── preload.ts     # 预加载脚本
│   └── renderer/          # React 渲染进程
│       ├── App.tsx        # 主应用组件
│       ├── pages/         # 页面组件
│       │   ├── Dashboard.tsx  # K线图表页面
│       │   └── Home.tsx       # 首页
│       └── components/    # 可复用组件
│           └── KLineChartLoader.tsx
├── package.json           # 项目配置和脚本
└── tsconfig.json         # TypeScript 配置
```

## 主要功能

### K线图表分析
- **多指标支持**: MA、EMA、BOLL、MACD、KDJ、RSI
- **自适应布局**: 主图固定高度，副图指标可滚动
- **主题切换**: 支持明暗主题
- **交互优化**: 鼠标悬停提示，左侧Y轴显示

### 原生菜单
- **跨平台适配**: macOS 和 Windows/Linux 不同菜单样式
- **快捷键支持**: 导出数据、保存图片等操作
- **系统集成**: 与操作系统菜单栏完美融合

## 开发指南

### 添加新的技术指标

在 `src/renderer/pages/Dashboard.tsx` 中：

```typescript
// 1. 在 indicators 数组中添加新指标
const indicators = [
  // ... 现有指标
  { name: 'NEW_INDICATOR', enabled: false }
];

// 2. 在 useEffect 中创建指标
chartInstance.current.createIndicator('NEW_INDICATOR');

// 3. 设置指标面板高度（如果需要）
chartInstance.current.setPaneOptions({ 
  id: paneId, 
  height: 120 
});
```

### 自定义打包配置

修改 `package.json` 中的 `build` 配置：

```json
{
  "build": {
    "appId": "your.app.id",
    "productName": "你的应用名称",
    "directories": {
      "output": "release/your-output-dir"
    }
  }
}
```

## 故障排除

### 网络连接问题

如果遇到 `ETIMEDOUT` 错误：

1. **设置代理**:
   ```bash
   git config --global http.proxy http://127.0.0.1:7890
   git config --global https.proxy http://127.0.0.1:7890
   ```

2. **使用镜像**:
   ```bash
   export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
   ```

3. **配置 npm 代理**:
   ```bash
   npm config set proxy http://127.0.0.1:7890
   npm config set https-proxy http://127.0.0.1:7890
   ```

### 打包失败

1. **清理缓存**:
   ```bash
   npm run clean
   rm -rf node_modules
   npm install
   ```

2. **检查端口占用**:
   ```bash
   lsof -i :3000  # 检查开发端口
   ```

3. **重新打包**:
   ```bash
   npm run package
   ```

## 许可证

MIT © [Electron React Boilerplate](https://github.com/electron-react-boilerplate)

---

## 参考项目

本项目基于 [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) 构建，感谢原项目的优秀架构和工具链支持。

- **原项目**: [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- **文档**: [electron-react-boilerplate.js.org](https://electron-react-boilerplate.js.org/docs/installation)
- **社区**: [Discord](https://discord.gg/Fjy3vfgy5q)