# H5团队说明文档

### 1、日常

- 每天开工前，记得拉取 develop 分支最新的代码合并到自己的开发分支和bugfix分支，避免时间过长后再合并的冲突

***
## 更改日志
```
 - Tips：删除 `onTouchTap` ，统一修改为 `onClick` 触发点击事件
    - 修改日期 - 8月13号 10：07
```

```
 - Tips：弹层方法统一修改到了`services/message.js` ，增加了关闭方法等，调用方式不变
    - 注意引用路劲变为了 `services/message`
    - 修改日期 - 8月12号 11：44
```

```
- Tips：`request.js` 增加了错误码处理，有需要的错误处理方法可以写在 `const/err-code.js` 里面
    - 默认 `token` 过期和 `token` 为空会跳转到登录页面，注意了
    - 修改日期 - 8月11号 18：34
```

```
- Tips：`utils` 修改 `formatMoney` 方法，可以支持分割位数设置，是否显示小数点单位
```

```
- Tips：调用 `request.js` 接口获取后台接口数据方法时传 `loading` 参数可控制是否显示
    - 所有请求，不管是 `get` 还是 `post`，都会带 `channelId`，`clientType`，`platform`，`agentCode` 四个参数，注意留意自己接口是否有报错情况，如果有报错情况及时联系后台开发
    - `loading`，不传默认为 `true` | `bool` 值。
    - `channelId`：渠道ID
    - `clientType`：客户端类型
    - `platform`：平台
    - `agentCode`：代理编码
```

***


#### 2、修改文件注意事项
- 公用文件，请勿提交，如 `webpack.config.js`，`app.js`
- 为了方便自己本地开发而修改的调试代码，不可提交

  **`切记切记`**

### `如提交错误代码导致打包失败的，一次发10块钱红包`
### `如提交到线上导致严重bug的，扣相应kpi`

***

### 3、开发流程
1. 基于 develop 分支创建自己的开发分支
2. 基于自己的分支开发新功能，日常记得合并开发分支代码到自己分支
3. 开发完成后推送代码和分支到远程分支
4. 在远程分支申请合并到 develop 分支
5. 相关审核人员合并完成
6. 视情况是否删除本地|远程分支


***

### 4、封装的常用方法和基础库
- utils
    - utils.js
        - getParameter() // 统一取参方法 | 防 xss 漏洞
        - browser // 统一判断浏览器使用环境的属性
    - request.js
        - get
        - post
    - reg.js
        - 正则表达式
    - auth.js
        - 登录授权等统一方法
- scss
    - base.scss 基础cscc库，包含reset，常用按钮，z-index控制，箭头等
- 调用接口方法时传 loading 参数可控制是否显示 loading，不传默认为 true | bool 值
- more...

***

### 5、写在最后
- loading