# vue3-pzSysytem-test 项目说明

## 项目简介
本项目是一个基于 Vue 3 和 Vite 构建的系统，包含两个子项目：`pzadmin`（管理端）和 `pzh5`（H5 端），用于实现相关业务功能。

## 项目结构
```
vue3-pzSysytem-test/
├── pzadmin/          # 管理端项目
└── pzh5/             # H5 端项目
```

## 子项目说明

### pzadmin（管理端）
1. **技术栈**
   - Vue 3
   - Vite
   - Element Plus（UI 组件库）
   - Vue Router（路由管理）
   - Vuex（状态管理）
   - Axios（网络请求）
   - Less（样式预处理器）

2. **主要功能**
   - 用户登录、注册、验证码获取
   - 权限管理（菜单权限列表、修改等）
   - 陪护师管理（创建、列表、删除等）
   - 订单管理（订单列表、状态更新等）
   - 首页报表信息展示

3. **脚本命令**
   ```bash
   # 启动开发服务器
   npm run dev

   # 构建生产版本
   npm run build

   # 预览生产构建结果
   npm run preview
   ```

### pzh5（H5 端）
1. **技术栈**
   - Vue 3
   - Vite
   - Vant（移动端 UI 组件库）
   - Vue Router（路由管理）
   - Axios（网络请求）
   - Less（样式预处理器）
   - qrcode（二维码生成）

2. **主要功能**
   - 用户登录
   - 首页信息展示
   - 陪护师列表查看
   - 订单创建、列表查看、详情查看

3. **脚本命令**
   ```bash
   # 启动开发服务器
   npm run dev

   # 构建生产版本
   npm run build

   # 预览生产构建结果
   npm run preview
   ```

## 安装与启动
1. 分别进入 `pzadmin` 和 `pzh5` 目录
2. 安装依赖
   ```bash
   npm install
   ```
3. 启动开发环境（参考上述子项目脚本命令）

## 注意事项
- 项目依赖 Node.js 环境，建议使用 Node.js 14 及以上版本
- 开发过程中若遇到依赖问题，可尝试删除 `node_modules` 目录后重新安装依赖
- 接口请求相关配置可在 `src/utils/request.js` 中查看和修改
