#summary 使用内建的函数。
#labels Phase-Implementation
# 函数 #

`Function defaultFixer(attname)` 生成一个默认修复函数。该函数将所提供 `HTMLAnchorElement node` 的 `attname` 属性复制到 `href` 属性，并移除 `attname` 属性，同时去掉和 `node` 相关连的事件。
|`attname`|为目标元素中的属性名|
|:--------|:---------|


`Function defaultDecoder(prelen, suflen)` 生成一个默认的解码函数。该函数处理 Base64 形式的自定协议 URL，如迅雷、QQ 旋风等。
|`prelen`|解码后 URL 前缀长度|
|:-------|:-----------|
|`suflen`|解码后 URL 后缀长度|