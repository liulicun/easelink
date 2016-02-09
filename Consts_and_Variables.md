#labels Phase-Implementation
#summary 使用内建的常量和变量。
# 常量 #

`String Version` Ease Link 版本号字符串。


`RegEx UrlPattern` 匹配一个 URL 字符串。
|`match[0]`|完整匹配|
|:---------|:---|
|`match[1]`|不含有请求（?）和锚点（#）的 URL|
|`match[2]`|协议部分|
|`match[3]`|不含有协议、请求和锚点部分的 URL|


`RegEx Base64Pattern` 匹配一个内容为 Base64 编码的 URL 字符串。
|`match[0]`|完整匹配|
|:---------|:---|
|`match[1]`|协议部分|
|`match[2]`|Base64 编码部分|


`RegEx PartialBase64Pattern` 匹配字符串中符合 Base64 编码的 URL 形式的子串。
|`match[0]`|完整匹配|
|:---------|:---|
|`match[1]`|协议部分|
|`match[2]`|Base64 编码部分|

# 变量 #

`stringbundle gL10N` Ease Link 本地化字符串组对象，在 `EaseLink.init()` 执行后可用。


`Bool gAuto` "自动修复链接"是否开启。


`Bool gPlain` "自动解码链接"是否开启。


`Object gEnabledAPs` 已经开启的自动处理协议列表。