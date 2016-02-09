#summary Chrome 用户指南。
#labels Featured,Phase-Guide,Browser-Chrome

# 用户指南 #

感谢您安装了 Ease Link，以下内容将有助于您使用 Ease Link。

## 修复链接 ##

Ease Link 可以修复专用链接，如果您在点击迅雷等专用链接时提示“此操作被浏览器拒绝！”等。您只需在该链接上点击右键，然后选择需要的操作即可。

默认状态下 Ease Link 已经开启了“在页面载入时处理迅雷专用链接”功能，可以在加载页面后自动修复迅雷专用链接，您也可以选择开启自动修复 QQ 旋风链接功能。

![http://easelink.googlecode.com/svn/wiki/prompt_chrome.png](http://easelink.googlecode.com/svn/wiki/prompt_chrome.png)

![http://easelink.googlecode.com/svn/wiki/fix_chrome.png](http://easelink.googlecode.com/svn/wiki/fix_chrome.png)

## 解码链接 ##

[（有缺陷）](#%E7%BC%BA%E9%99%B7.md)

当一个链接的链接地址符合迅雷、Flashget 和 QQ 旋风等软件的协议时，您只需在需要解码的链接上点击右键，Ease Link 便可对其进行修复。默认状态下“自动解码专用链接为常规链接”开启，即在菜单开启的同时<sup>*</sup>，该链接会被自动解码，您只需在菜单中选择您需要的操作即可。

<sub>* 纳米盘并不支持自动解码，需要点击弹出菜单中的“解码此链接”菜单项。</sub>

## 转换链接 ##

当您在网页上遇到文本网址时，只需将其选中，在右键菜单内选择“转换为链接”。转换时根据“自动解码专用链接为常规链接”选项决定是否解码。

您可以用以下地址作为测试：

thunder://QUFodHRwOi8vNDYuZHVvdGUub3JnL3RodW5kZXI1LmV4ZVpa

Flashget://W0ZMQVNIR0VUXWh0dHA6Ly9kbC1zaC1vY24tMS5wY2hvbWUubmV0LzF3L3RnL2ZnY25fNTIzLnJhcltGTEFTSEdFVF0=&5769

## 配置 ##

打开[chrome://extensions 扩展程序]，点击 Ease Link 条目下的选项。

  * **自动解码专用链接为常规链接** 开启时，Ease Link 将尽可能自动对链接进行解码，而不需您在右键菜单中点击“解码此链接”。
  * **在页面载入时处理迅雷专用链接** 开启时，Ease Link 会在页面加载完成后自动修复迅雷专用链接。
  * **在页面载入时处理 QQ 旋风专用链接** 开启时，Ease Link 会在页面加载完成后自动修复 QQ 旋风专用链接。

**注意** 如果您发现 Ease Link 有损您的浏览器性能，请关闭“在页面载入时处理XX专用链接”选项。

## 处理全部链接 ##

通过点击右键菜单中的“处理全部链接”，您可以要求 Ease Link 处理页面上的全部链接<sup>**</sup>。此时，Ease Link 将不参照选项菜单内的自动处理协议相关设置，而会处理页面上的所有支持协议的链接。
但是，Ease Link 将根据“自动解码链接”选项解码页面上的链接，如果“自动解码链接”选项关闭，则不在处理时自动解码。

<sub>** 为保证性能，只处理各种类型链接的前 50 个。如果有必要，您可以多次执行此操作。</sub>

## 从其他扩展调用 ##

您可以从其他插件调用 Ease Link 进行手动的链接处理。

从其他插件的 Content Script 中调用：
```
chrome.extension.sendRequest('mnbllbbekhlliaedopijladkbckldcbb', {
  topic: 'fix'
});
```

从其他插件的 Pages 中调用：
```
chrome.extension.sendRequest('mnbllbbekhlliaedopijladkbckldcbb', {
  topic: 'fix',
  tabId: tab.id
});
```

其中：
  * `fix` 亦可为 `processAll`。
  * `tab.id` 指定需要进行处理的 Tab ID。

# 支持协议列表 #

|**协议**|**说明**|**支持自动处理**|**可修复**|**可解码**|
|:-----|:-----|:---------|:------|:------|
|thunder|迅雷专用链接|是         |是      |是      |
|qqdl  |QQ 旋风专用链接|是         |是      |是      |
|fs2you|RayFile|否         |否（不需要） |是      |
|flashget|Flashget专用链接|否         |是      |是      |
|tencent|QQ 临时聊天|否         |是      |否      |
|#namipan|纳米盘   |否         |否（不需要） |是      |


# 缺陷 #

  1. 由于 chrome.contextMenus.`*` API 尚不完善，所以不能隐藏部分菜单项，故“解码此链接”、“转换为链接”等可能始终显示。同时，纳米盘下载链接上不能显示“解码此链接”，需要点击“处理全部链接”来解决问题。

# 扩展阅读 #

  * [人造烦恼](Troubles.md)
  * [添加对新协议的支持](Add_New_Protocol.md)