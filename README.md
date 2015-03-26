heysdktools
===

**heysdktools**是**HeySDK**项目的命令行工具，使用**Nodejs**编写。

更新说明
---
0.6版配合最新的HeySDK后台，调整了配置文件为json格式，取消了前面版本使用的csv格式，望用户尽快更新。

安装
---
**heysdktools**建议通过**npm**全局安装，譬如：

```
npm -g install heysdktools
```

安装完以后，就可以直接使用heysdk命令来构建游戏项目了。

查看版本号
---
通过下面的命令可以查看当前安装的heysdktools版本。

```
heysdk ver
```

构建项目
---
通过下面的命令可以构建项目，其中heysdkios.json文件需要通过heysdk后台生成。

```
heysdk init heysdkios.json
```

还原项目
---
如果希望还原项目，可以通过下面指令来实现：

```
heysdk revert heysdkios.json
```