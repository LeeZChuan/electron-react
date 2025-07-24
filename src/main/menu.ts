import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

/**
 * 菜单构建器类 - 负责创建跨平台的原生菜单栏
 * 
 * 平台差异说明：
 * - macOS (darwin): 菜单栏在屏幕顶部，应用菜单在最左侧
 * - Windows/Linux: 菜单栏在应用窗口内部，文件菜单在最左侧
 */
export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  /**
   * 构建并设置应用菜单
   * 根据操作系统平台选择不同的菜单模板
   */
  buildMenu(): Menu {
    // 开发环境下启用右键检查元素功能
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    // 根据平台选择菜单模板
    // darwin = macOS, 其他平台使用默认模板
    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()    // macOS 专用菜单结构
        : this.buildDefaultTemplate();  // Windows/Linux 通用菜单结构

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  /**
   * 开发环境专用功能设置
   * 为所有平台添加右键检查元素功能，方便调试
   */
  setupDevelopmentEnvironment(): void {
    // 监听右键菜单事件，添加"检查元素"选项
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            // 在指定位置打开开发者工具检查元素
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  /**
   * 构建 macOS 专用菜单模板
   * 
   * macOS 菜单特点：
   * 1. 应用菜单在最左侧（包含About、Services、Hide、Quit等）
   * 2. 使用 Command 键作为主要修饰键
   * 3. 菜单项可以绑定系统 selector（如 hide:、quit: 等）
   * 4. 支持 Services 子菜单（系统级服务）
   * 5. 窗口管理菜单是标准配置
   */
  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    // macOS 应用菜单 - 位于菜单栏最左侧，以应用名称命名
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron', // 这里会被系统自动替换为应用名称
      submenu: [
        {
          label: 'About K线图表分析',
          selector: 'orderFrontStandardAboutPanel:', // macOS 系统级关于面板
        },
        { type: 'separator' }, // 分隔线
        { 
          label: 'Services', 
          submenu: [] // macOS 系统服务菜单，系统会自动填充
        },
        { type: 'separator' },
        {
          label: 'Hide K线图表分析',
          accelerator: 'Command+H', // macOS 标准隐藏快捷键
          selector: 'hide:', // 系统级隐藏方法
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H', // 隐藏其他应用
          selector: 'hideOtherApplications:',
        },
        { 
          label: 'Show All', 
          selector: 'unhideAllApplications:' // 显示所有应用
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q', // macOS 标准退出快捷键
          click: () => {
            app.quit();
          },
        },
      ],
    };
    // macOS 编辑菜单 - 标准的文本编辑功能
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { 
          label: 'Undo', 
          accelerator: 'Command+Z', 
          selector: 'undo:' // 系统级撤销操作
        },
        { 
          label: 'Redo', 
          accelerator: 'Shift+Command+Z', 
          selector: 'redo:' // 系统级重做操作
        },
        { type: 'separator' },
        { 
          label: 'Cut', 
          accelerator: 'Command+X', 
          selector: 'cut:' // 系统级剪切
        },
        { 
          label: 'Copy', 
          accelerator: 'Command+C', 
          selector: 'copy:' // 系统级复制
        },
        { 
          label: 'Paste', 
          accelerator: 'Command+V', 
          selector: 'paste:' // 系统级粘贴
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:', // 系统级全选
        },
      ],
    };
    // macOS 视图菜单 - 开发版本（包含调试工具）
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R', // macOS 标准刷新快捷键
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F', // macOS 全屏快捷键
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I', // macOS 开发者工具快捷键
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    
    // macOS 视图菜单 - 生产版本（只保留基本功能）
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F', // 生产环境仍保留全屏功能
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    // macOS 窗口菜单 - macOS 特有的窗口管理功能
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M', // macOS 标准最小化快捷键
          selector: 'performMiniaturize:', // 系统级最小化
        },
        { 
          label: 'Close', 
          accelerator: 'Command+W', // macOS 标准关闭快捷键
          selector: 'performClose:' // 系统级关闭窗口
        },
        { type: 'separator' },
        { 
          label: 'Bring All to Front', 
          selector: 'arrangeInFront:' // macOS 特有：将所有窗口置前
        },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme',
            );
          },
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };

    // 根据环境选择视图菜单版本
    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev  // 开发环境：包含调试工具
        : subMenuViewProd; // 生产环境：精简版

    // 返回 macOS 完整菜单结构
    // 顺序：应用菜单 -> 编辑 -> 视图 -> 窗口 -> 帮助
    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  /**
   * 构建 Windows/Linux 通用菜单模板
   * 
   * Windows/Linux 菜单特点：
   * 1. 文件菜单在最左侧（没有应用菜单概念）
   * 2. 使用 Ctrl 键作为主要修饰键
   * 3. 菜单项使用 & 符号定义快捷访问键（Alt+字母）
   * 4. 没有系统级 selector，需要手动实现所有功能
   * 5. 菜单栏集成在应用窗口内部
   */
  buildDefaultTemplate(): MenuItemConstructorOptions[] {
    const templateDefault: MenuItemConstructorOptions[] = [
      // Windows/Linux 文件菜单 - 应用相关的文件操作
      {
        label: '&File', // &F 表示 Alt+F 可以打开此菜单
        submenu: [
          {
            label: '&Export Chart Data', // Alt+E 快捷访问
            accelerator: 'Ctrl+E', // Windows/Linux 标准修饰键
            click: () => {
              // 发送导出数据事件到渲染进程
              this.mainWindow.webContents.send('export-chart-data');
            },
          },
          {
            label: '&Save Chart Image', // Alt+S 快捷访问
            accelerator: 'Ctrl+S', // Windows/Linux 保存快捷键
            click: () => {
              // 发送保存图表图片事件到渲染进程
              this.mainWindow.webContents.send('save-chart-image');
            },
          },
          { type: 'separator' }, // 分隔线分组功能
          {
            label: '&Close', // Alt+C 快捷访问
            accelerator: 'Ctrl+W', // Windows/Linux 关闭快捷键
            click: () => {
              this.mainWindow.close(); // 手动关闭窗口（非系统级）
            },
          },
        ],
      },
      // Windows/Linux 视图菜单 - 根据环境动态配置
      {
        label: '&View', // Alt+V 快捷访问
        submenu:
          // 开发环境包含调试工具，生产环境只保留基本功能
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                // 开发环境菜单项
                {
                  label: '&Reload', // Alt+R 快捷访问
                  accelerator: 'Ctrl+R', // Windows/Linux 刷新快捷键
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen', // Alt+F 快捷访问
                  accelerator: 'F11', // Windows/Linux 标准全屏键
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools', // Alt+D 快捷访问
                  accelerator: 'Alt+Ctrl+I', // Windows/Linux 开发者工具快捷键
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                // 生产环境菜单项（精简版）
                {
                  label: 'Toggle &Full Screen', // 生产环境仍保留全屏功能
                  accelerator: 'F11', // F11 是 Windows/Linux 通用全屏键
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
              ],
      },
      // Windows/Linux 帮助菜单 - 外部链接和应用信息
      {
        label: 'Help', // 注意：这里没有 & 符号，表示不设置快捷访问键
        submenu: [
          {
            label: 'Learn More',
            click() {
              // 在默认浏览器中打开外部链接
              shell.openExternal('https://electronjs.org');
            },
          },
          {
            label: 'Documentation',
            click() {
              // 打开技术文档
              shell.openExternal(
                'https://github.com/electron/electron/tree/main/docs#readme',
              );
            },
          },
          {
            label: 'Community Discussions',
            click() {
              // 打开社区讨论页面
              shell.openExternal('https://www.electronjs.org/community');
            },
          },
          {
            label: 'Search Issues',
            click() {
              // 打开问题跟踪页面
              shell.openExternal('https://github.com/electron/electron/issues');
            },
          },
        ],
      },
    ];

    // 返回 Windows/Linux 菜单结构
    // 顺序：文件 -> 视图 -> 帮助（比 macOS 简化，没有应用菜单和窗口菜单）
    return templateDefault;
  }
}
