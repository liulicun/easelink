#summary 迅雷下载软件为 Firefox 和 Chrome 用户带来的不便。
#labels Featured,Phase-Implementation
# 人造烦恼 #

## 背景 ##

迅雷、Flashget 和 QQ 旋风都使用了私有的 [URL 协议](http://msdn.microsoft.com/en-us/library/aa767914%28VS.85%29.aspx)链接。这并不稀奇，而且这样的自定义协议也是被 Firefox 所支持的。Firefox 会自动根据系统上已经注册的协议来调用相关的应用程序打开这些链接。

但是为何网页上的迅雷、Flashget 和 QQ 旋风链接却不能直接打开呢？像迅雷和 QQ 旋风的链接会弹出写着“此操作被浏览器拒绝！”的对话框，而 Flashget 的链接则会直接跳转到 Flashget 的下载页面。

![http://easelink.googlecode.com/svn/wiki/prompt.png](http://easelink.googlecode.com/svn/wiki/prompt.png)

原因很简单，因为迅雷、Flashget 和 QQ 旋风都是使用了脚本来完善各自的下载体验，同时也为了拉客。但是这些脚本质量都十分拙劣，并不支持除去 IE 外的其他浏览器。于是就导致了这些链接不能打开的情况。

## 代码分析 ##

迅雷、Flashget 和 QQ 旋风的典型下载链接如下：

迅雷：
```
<a style="color: rgb(0, 51, 153);" oncontextmenu="ThunderNetwork_SetHref(this,2,4)"
   onclick="bangtj('xl1');return OnDownloadClick_Simple(this)"
   thunderrestitle="迅雷(Thunder) V5.9.15.1274" thundertype="04" thunderpid="19985"
   thunderhref="thunder://QUFodHRwOi8vNDYuZHVvdGUub3JnL3RodW5kZXI1LmV4ZVpa"
   target="_self" href="#">迅雷高速下载点1</a>
<!-- 地址：thunder://QUFodHRwOi8vNDYuZHVvdGUub3JnL3RodW5kZXI1LmV4ZVpa -->
```

Flashget：

```
<a oncontextmenu="Flashget_SetHref_js(this, 5769);" onclick="convertFgURL(0, 5769)"
   href="javascript:void(0);">Flashget高速下载</a>
<!-- 地址：?? -->
```

QQ 旋风：

```
<a target="_self" oncontextmenu="OnContextClick(this,event)"
   onclick="OnDownloadClick_Simple(this,event,6000019)"
   qhref="http://xiazai.zol.com.cn/down.php?softid=313602&amp;subcatid=33&amp;site=10"
   href="javascript:void(0);">使用超级旋风下载</a>
<!-- http://xiazai.zol.com.cn/down.php?softid=313602&amp;subcatid=33&amp;site=10 -->
```

可以看出，他们都使用了一些方法来隐藏各自的链接地址。下载地址不在 href 属性内，并且有的已经进行了 Base64 编码。至于解码后的内容就是普通的 HTTP 或者 FTP 协议的下载地址，并不是像 ed2k 等协议中的 hashset 内容。

```
print(window.atob('QUFodHRwOi8vNDYuZHVvdGUub3JnL3RodW5kZXI1LmV4ZVpa'));
//outputs AAhttp://46.duote.org/thunder5.exeZZ
```

在用户点击时，onClick 事件会被捕获，从而执行各自的专用脚本，在这些脚本中就会因为非 IE 浏览器和未安装某某下载工具而终止访问下载地址的过程。

可以推断，这种下载链接并不仅仅是为了为各自用户提供更好的下载体验，而更大程度上在于排挤其他下载软件和扩大自身影响力，构成不用某某软件不能下载的困境。

## Ease Link 实现 ##

在 Ease Link 之前就出现了很多用于解决这些问题的 Firefox/Chrome 扩展，有些版本的迅雷也含有通吃其他协议小补丁，原理大致如下。

Firefox 和 Chrome 都不支持 ActiveX 所以只要是直接打开链接，一定会被其各自的脚本所拦截。于是一般的解决途径就是事先找到这些不能打开的链接，并进行处理。去掉相关的事件，并且将链接解码为普通的 HTTP 和 FTP 协议地址。当然也可以仅仅去掉链接上的附加事件，保留其私有的协议。

IE 上的解决方案则略显优越，因为 IE 支持 ActiveX，所以这些链接可以直接打开，但是会因为没有安装某某软件而被拦截。这时候通吃各种协议的补丁会注册这些组件，构造出已经安装某某软件的假象，并且会注册为某某协议的 Handler。它将收到的信息进行重新的编码转换为可以被某某软件理解的其他协议信息，从而被相关软件打开。

### 流程 ###

鉴于这些链接的复杂性和可能的各种情况 Ease Link 并没有什么其他的新办法，是用了如下的流程进行处理：

  1. 寻找需要修复的链接
  1. 去除关联事件，修复链接
  1. 解码链接为 HTTP 或 FTP 协议

#### 寻找链接 ####

Firefox 和 Chrome 都支持 XPath (`doc.evaluate()`)，这是寻找特征元素的首选方式，而非使用传统的 DOM。

```
.//a[@thunderhref]
.//a[@qhref]
.//a[@href and starts-with(translate(@href, 'FSYOU', 'fsyou'), 'fs2you:')]
.//a[count(@*[contains(translate(., 'FLASHGET', 'flashget'), 'flashget://')])>0]
.//a[@href and starts-with(translate(@href, 'HTPWAQCOM', 'htpwaqcom'), 'http://wpa.qq.com/')]
.//a[@href and starts-with(translate(@href, 'JAVSCRIPT', 'javscript'), 'javascript:')
     and contains(translate(@href, 'NAMIPCO', 'namipco'), '.namipan.com')]
```

由于使用 DOM 需要用 Javascript 来遍历所有的 Anchor 元素，并将其与特征依次对比，自然是效率低下的。当然你可能也会想到使用 `doc.getAnonymousElementByAttribute()` 来获取元素但是这种方法只能进行精确匹配，而无法进行模糊的匹配。
但是使用 XPath 则不同，XPath 是被完整封装的 Native Code，可以直接返回匹配后的元素引用，其效率自然不是使用 DOM 所能企及的。故而在 Ease Link 中是用了此种方法来确保寻找元素的高效和低成本。

使用[ZOL软件下载频道首页](http://xiazai.zol.com.cn/)进行测试<sup>*</sup>，查找迅雷专用链接。所用代码如下：
```
function findByDOM() {
  var nodes = [];
  var node;
  var result = document.getElementsByTagName('a');
  for (var i = 0; i < result.length; ++i) {
    node = result[i];
    if (node.hasAttribute('thunderhref')) nodes.push(node);
  }
  return nodes;
}

function findByXPath() {
  var nodes = [];
  var node;
  var iterator = document.evaluate('.//a[@thunderhref]', document.documentElement, null, XPathResult.ANY_TYPE, null);
  while (!iterator.invalidIteratorState && (node = iterator.iterateNext()))
    nodes.push(node);
  return nodes;
}

function test() {
  for (var i = 0; i < 1000; ++i) {
    findByDOM();
    findByXPath();
  }
}
```

首次
|**函数**|**调用次数**|**总时间**|**平均时间**|**最小时间**|**最大时间**|
|:-----|:-------|:------|:-------|:-------|:-------|
|`findByDOM`|1       |39.127ms|39.127ms|39.127ms|39.127ms|
|`findByXPath`|1       |1.567ms|1.567ms |1.567ms |1.567ms |

1000 轮平均结果
|**函数**|**调用次数**|**总时间**|**平均时间**|**最小时间**|**最大时间**|
|:-----|:-------|:------|:-------|:-------|:-------|
|`findByDOM`|1000    |2424.04ms|2.424ms |2.254ms |39.127ms|
|`findByXPath`|1000    |1665.575ms|1.666ms |1.476ms |2.46ms  |

可以看见，两者在多次调用时差距并不明显，但在首次调用时的差距十分巨大。然而这类插件需要在页面装载后运行，而且只运行一次，所以第一个表格内的数据更具参考价值。

<sub>* 测试时页面共有2297个链接，并不存在任何迅雷专用链接，测试基于 Firefox 3.6，在 Chrome 上二者性能接近，DOM略微占优，但慢于 Firefox 的 XPath</sub>

#### 修复 ####

此步骤的主要目的在于去除相关连的事件，并且将 `thunderhref` 属性或 `qhref` 属性的值复制到 `href` 属性。处理的对象是 `HTMLAnchorElement`。

但是对于 Flashget 和其他的一些链接则不具备这样的直接存在于 DOM 内的属性，必须通过在它的 `OnContextMenu` 事件触发后才会赋值 `href` 属性。基于此 Ease Link 仅支持迅雷和 QQ 旋风的直接修复，其他的都需要在鼠标右键点击链接时进行。

右键点击时，Ease Link 会捕获 ContextMenu 的 `onPopupShowing` 事件。对当前 Anchor 元素进行检验，如果确定其是可以被修复的，则进行必要的修复。修复时，Anchor 元素自定义的 `OnContextMenu` 事件已经执行过，所以可以确保 `href` 内的数据已经可用。

修复过的链接会变成如下的样子，这时如果已经安装了对应的软件就可以直接打开了：
```
<a style="color: rgb(0, 51, 153);" thunderrestitle="迅雷(Thunder) V5.9.15.1274"
   thundertype="04" thunderpid="19985" target="_self"
   href="thunder://QUFodHRwOi8vNDYuZHVvdGUub3JnL3RodW5kZXI1LmV4ZVpa">
   迅雷高速下载点1</a>

<a href="Flashget://W0ZMQVNIR0VUXWh0dHA6Ly9kbC1zaC1vY24tMS5wY2hvbWUubmV0LzF3L3RnL2ZnY25fNTIzLnJhcltGTEFTSEdFVF0=&amp;5769">
   Flashget高速下载</a>

<a target="_self" href="http://xiazai.zol.com.cn/down.php?softid=313602&amp;subcatid=33&amp;site=10">
   使用超级旋风下载</a>
```

#### 解码 ####

这一步骤可将 Base64 编码后的私有协议解码为浏览器可以识别的 HTTP 和 FTP 协议链接。当然，由于这些下载软件一样支持普通的 HTTP 和 FTP 协议链接，所以不会影响其下载。这一步骤的处理对象为 `HTMLAnchorElement` 的 `href` 属性。

解码时使用 Firefox 和 Chrome 内置的 Base64 编、解码原生函数进行，以便尽可能小的减小在解码环节的开销。

解码后如下：

```
<a style="color: rgb(0, 51, 153);" thunderrestitle="迅雷(Thunder) V5.9.15.1274"
   thundertype="04" thunderpid="19985" target="_self"
   href="http://46.duote.org/thunder5.exe">
   迅雷高速下载点1</a>

<a href="http://dl-sh-ocn-1.pchome.net/1w/tg/fgcn_523.rar">Flashget高速下载</a>

<a target="_self" href="http://xiazai.zol.com.cn/down.php?softid=313602&amp;subcatid=33&amp;site=10">
   使用超级旋风下载</a>
```

# 扩展阅读 #

  * [添加对新协议的支持](Add_New_Protocol.md)