# Pages 文件夹

## 项目结构
每个页面都有独立的文件夹，包含该页面的所有相关文件：

```
pages/
├── Login/           # 登录页面
│   ├── index.tsx    # 主组件
│   ├── styles.css   # 样式文件
│   └── README.md    # 文档说明
├── Dashboard/       # 主面板页面
│   ├── index.tsx    # 主组件
│   ├── styles.css   # 样式文件
│   └── README.md    # 文档说明
├── Home/            # 首页
│   ├── index.tsx    # 主组件
│   └── README.md    # 文档说明
├── Abort/           # 关于页面
│   ├── index.tsx    # 主组件
│   └── README.md    # 文档说明
└── README.md        # 本文件
```

## 命名规范
- 每个页面文件夹使用大驼峰命名（PascalCase）
- 主组件文件统一命名为 `index.tsx`
- 样式文件统一命名为 `styles.css`
- 每个文件夹都包含 `README.md` 文档

## 导入方式
由于使用了 `index.tsx` 作为主文件，导入路径保持不变：

```tsx
// 导入页面组件
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Abort from './pages/Abort';
```

## 优势
1. **更好的组织性**: 每个页面的相关文件集中管理
2. **易于维护**: 页面相关的所有文件都在同一个文件夹中
3. **清晰的文档**: 每个页面都有独立的README说明
4. **可扩展性**: 可以轻松添加页面相关的其他文件（如测试、类型定义等）
5. **团队协作**: 不同开发者可以独立开发不同页面，减少冲突 