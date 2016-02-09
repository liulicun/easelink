#labels Featured,Phase-Implementation
#summary 添加一个新协议。
# 添加一个新协议 #

在 Ease Link 添加一个新协议非常简单，只需要添加其对应的符合 IProtocol 接口或 IAutomaticProtocol 接口的对象即可。

```
IProtocol {
  string xpath;                         //required
  void fix(HTMLAnchorElement node);     //optional
  void decode(HTMLAnchorElement node);  //optional
}
```

用于普通协议，不支持自动处理。其中：
  * xpath 表示其所表示对象的匹配用 XPath。
  * fix 函数，修复给定 node。
  * decode 函数，解码给定 node。

实例：
```
const IProtocolRayFile = {
  xpath: "[@href and starts-with(translate(@href, 'FSYOU', 'fsyou'), 'fs2you:')]",
  decode: function(node) {
    var url = node.getAttribute('href');
    var match;
    if (matches = base64Pattern.exec(url)) {
      url = atob(matches[2]).toString();
      node.setAttribute('href', 'http://' + url.substring(0, url.lastIndexOf('|')));
    }
  }
};
```

此为处理 RayFile 的 `IProtocol` 对象。由于不需要修复，所以不设定 `fix`。

```
IAutomaticProtocol extends IProtocol {
  string name;                         //required
}
```

用于自动处理协议，具有 name 字段。其中：
  * name 表示该协议的名称，使用 l10n\_PROTOCOL\_name 的方式命名，以便可以进行本地化。

实例：
```
const IAutomaticProtocolThunder = {
  name: 'l10n-thunder-name',
  xpath: '[@thunderhref]',
  fix: defaultFixer('thunderhref'),
  decode: defaultDecoder(2, 2)
};
```

最后需要将 `IProtocol` 注册到 `Protocols`。`IAutomaticProtocol` 注册到 `AutomaticProtocols`。

```
const Protocols = {
  ...
  'PROTOCOL': IProtocol,
  ...
};

const AutomaticProtocols = {
  ...
  'PREFNAME': IAutomaticProtocol,
  ...
};
```

其中：
  * PROTOCOL 表示自定义 URL 协议名，为其完整形式（含有“:”）作为 `IProtocol` 注册名，字母需要全部小写，虚拟协议需要在协议名前加#。
  * PREFNAME 表示支持自动处理协议的配置字段名，需要符合 `defaults/preferences/prefs.js` 中的定义。

实例：
```
const Protocols = {
  'thunder:': IAutomaticProtocolThunder,
  'fs2you:': IProtocolRayFile,
  '#namipan:': IProtocolNamipan,
};

const AutomaticProtocols = {
  'thunder': IAutomaticProtocolThunder,
};
```

其中：
  * fs2you 为 RayFile 的自定义 URL 协议。
  * #namipan 为纳米盘的虚拟协议，也就是说此类地址可以处理，但并非一个自定义的 URL 协议，所以在它的名字前加注 #。

# 扩展阅读 #

  * [常量和变量](Consts_and_Variables.md)
  * [函数](Functions.md)