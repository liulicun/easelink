#summary 测试用户指南。
#labels Phase-Guide,Deprecated
# 用户指南 #

感谢您安装了 Ease Link 的测试版。

## 更新 ##

相对于上个版本，这个版本增加了对非 ASCII 网址的处理能力<sup>*</sup>。因为 btoa 和 atob 两个 DOM Level 0 扩展的 Base64 编/译码是 ASCII 的，所以，转出来的字符在字节上与正确编码下中文是相同的，但是不能正常显示。该测试版本在解码后，再进行一次百分比转义，只要网页的编码恰当就可以显示出地址中的中文<sup>**</sup>。

<sub>* 根据 RFC3986，非 ASCII 字符应该依照其 UTF-8 的字节进行百分比转义，国内的情况……</sub>

<sub>** 比如：某土鳖站长用 GB2312 作为编码，然后进行迅雷 Base64 编码，此时 Base64 内所含有的字节内容为 GB2312 编码；此时该地址被贴在一个 UTF-8 编码的网页上，在进行 Base64 解码后，经过百分比转义，浏览器会按照 UTF-8 编码去解读解码后的字节，于是乱码产生了。</sub>

## 测试 ##

**http://www.3gp2.com/Software/Catalog986/17512.html （GB2312，一个不恰当的测试页面，但是能正常显示汉字了，有其他的欢迎告知）**

# 扩展阅读 #

  * [用户指南](User_Guide.md)
  * [人造烦恼](Troubles.md)
  * [添加对新协议的支持](Add_New_Protocol.md)