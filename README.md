
## 一款框选页面任意DOM元素的插件

<br><br>

### 插件功能

- 平台：浏览器pc端插件，不支持移动端
- 功能：鼠标框选一个范围，插件返回框选范围内的dom元素

- 支持自定义可选dom
- 支持自定义选择框样式
- 支持设置开启框选功能的条件
- 支持设置关闭框选功能的条件
- 支持返回dom节点上绑定的数据

<br><br>

### 上代码

``` html
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>框选页面任意DOM元素</title>
  <style>
    html, body, #app {
      width: 100%;
      height: 100%;
      margin: 0;
      position: relative;
      overflow: auto;
    }
    table{
      margin: 25%;
    }
    th,td{
      padding: 4px 10px;
      text-align: center;
    }
  </style>
</head>

<body>
  <div id="app">
    <div style="position: absolute;top: 30%;">
      <button onclick="startSelectBox()" >点击开始框选功能</button></button>
      <ul>
        <li data-key="{a:1,b:2}" data-name="小明">test text</li>
        <li data-key="1212" data-age="22">test text2</li>
      </ul>
    </div>
    <table id="table" border="1" cellspacing="0" width="50%">
      <thead><tr><th>test1</th><th>test2</th><th>test3</th><th>test4</th></tr></thead>
      <tbody id="tbody"></tbody>
    </table>
  </div>
</body>
<script src="./src/element-select.js" ></script>
<script >
  // 循环模拟table数据
  for (let index = 1; index < 31; index++) {
    const tr = document.createElement('tr')
    tr.setAttribute("data-key", index)
    tr.setAttribute("data-txt", '@'+index)
    for (let v = 1; v < 5; v++) {
      const td = document.createElement('td')
      td.innerText = `test-${index}-${v}`
      tr.append(td)
    }
    document.querySelector('#tbody').append(tr)
  }
  // 构建ElementSelect实例
  const es = new ElementSelect({
    el: "#table tbody tr, li", // 鼠标框选范围内可以选择的标签，String，不同选择器用,分隔
    boxStyle: "border: 1px solid red;",  // 范围框自定义样式,position、top、left、width、height不支持
    startMode: "ctrl", // 控制开启框选功能的模式，【ctrl,shift,alt,handle】
    endMode: "ctrl", // 控制关闭框选功能的模式，【auto,ctrl,shift,alt,handle】
    dataset: ["age", "name"],
    // dataset: {
    //   "#table tbody tr": ["key", "txt"],
    //   "li": ["name", "age", "key"]
    // }  // 如果需要返回数据，首先得把数据绑定到dom上，例如：<div data-name="小明" data-age="18"></div>
  })

  const startSelectBox = es.start.bind(es) // 或者 const startSelectBox = () => es.start()

</script>

</html>
```

<br><br>

### CONFIG配置

| 配置项 |  <div style="width:50px;">必填</div> | 数据类型 | <div style="width:60px;">默认值</div> |  说明  | 示例 |
| -------- | :------: | :----- | ---- | :---- | :---- | 
| el | 是 | String| "" | Dom选择器，框选操作后返回的可选dom，多个选择器用,分隔 | "#table tbody tr, li" |
| boxStyle | 否 | String | "" | 选择框自定义样式，【position、top、left、width、height】为内部支撑样式，不支持修改，规则跟写行内style一样需要用;分隔 | "border: 1px solid red;opacity: 0.2;" |
| startMode | 否 | String | "ctrl" | 开始框选功能的条件，支撑【ctrl,shift,alt,handle】| 示例：startMode: "ctrl"，设置ctrl后，在需要做框选的页面按下键盘Ctrl键，开启框选功能 |
| endMode | 否 | String | "ctrl" | 关闭框选功能的条件，支撑【auto,ctrl,shift,alt,handle】| 示例：endMode: "ctrl"，设置ctrl后，在需要做框选的页面松开键盘Ctrl键，关闭框选功能 |
| dataset | 否 | String、Array、Object| null | 如果需要返回数据，你会用到它 | ["age", "name"] |

<br><br>

### startMode和endMode设置handle说明

``` js

  // 构建ElementSelect实例
  const es = new ElementSelect({
    el: "#app li",
    startMode: "handle", // 如果键盘按下开启框选不能满足你的需求，可以设置成handle，启动框选功能变成手动模式，需要用实例调用start函数开启框选。
    endMode: "auto", // endMode设置为auto，当框选动作完成后，插件会自动关闭框选功能，如果不能满足需求，也可以设置成handle，用法同startMode。
  })

  // es实例调用start函数，启动框选功能，需要注意调用start函数的指向
  const startSelectBox = es.start.bind(es) 
  // 或者 const startSelectBox = () => es.start()

```

<br><br>

### dataset说明
当你需要插件返回数据的时候，dataset整好可以帮你
- String：
  ```html
    <!-- 使用dataset的条件是需要在dom上绑定data-*格式数据 -->
    <ul>
      <li data-key="xiaoming" data-name="小明">小明</li>
      <li data-key="1212" data-age="22" data-name="小白">小白</li>
    </ul>
  ```
  ```js
    new ElementSelect({
      el: "#app li",
      dataset: "name" 
    })
    // 如果框选了2个li标签，数据将返回以下数据
    {
      "#app li": ["小明", "小白"]
    }
    // 如果框选了第2个li标签，数据将返回以下数据
    {
      "#app li": ["", "小白"]
    }
    // 如果框选了第1个li标签，数据将返回以下数据
    {
      "#app li": ["小明", ""]
    }
    // 作者：大家想个问题，li上的data-key和data-age为什么不返回呢？
    --------------------------->
    // 小明：因为dataset只设置了值为"name"啊
  ```
- Array：
  ```html
    <!-- 使用dataset的条件是需要在dom上绑定data-*格式数据 -->
    <ul>
      <li data-key="xiaoming" data-name="小明">小明</li>
      <li data-key="1212" data-age="22" data-name="小白">小白</li>
    </ul>
  ```

  ```js
    new ElementSelect({
      el: "#app li",
      dataset: ["name", "age", "key"]
    })
    // 如果框选了2个li标签，数据将返回以下数据
    {
      "#app li": [
        {name: "小明", age: "", key: "xiaoming"}, 
        {name: "小白", age: "22", key: "1212"}
      ]
    }
    // 如果框选了第2个li标签，数据将返回以下数据
    {
      "#app li": [{name: "小白", age: "22", key: "1212"}]
    }
    // 如果框选了第1个li标签，数据将返回以下数据
    {
      "#app li": [{name: "小明", age: "", key: "xiaoming"}]
    }
    // 吃瓜群众：卧槽，下面的Object返回格式我已经知道了，跟这差不多，悟了！
  ```

- Object：
  ```html
    <!-- 使用dataset的条件是需要在dom上绑定data-*格式数据 -->
    <ul>
      <li data-key="xiaoming" data-name="小明">小明</li>
      <li data-key="1212" data-age="22" data-name="小白">小白</li>
    </ul>
    <p>这一段废话</p>
    <p data-tel="12345" >联系方式：18679850773@163.com</p>
  ```

  ```js
    new ElementSelect({
      el: "#app li, p",
      dataset: {
        "#app li": ["name", "age", "key"],
        "p": "tel"
      }
    })
    // 如果框选了2个li标签和第1个p标签，数据将返回以下数据
    {
      "#app li": [
        {name: "小明", age: "", key: "xiaoming"}, 
        {name: "小白", age: "22", key: "1212"}
      ]
      "P": [""]
    }
    // 如果框选了2个li标签和2个p标签，数据将返回以下数据
    {
      "#app li": [
        {name: "小明", age: "", key: "xiaoming"}, 
        {name: "小白", age: "22", key: "1212"}
      ]
      "P": ["", "12345"]
    }
    // 如果只框选了2个p标签，数据将返回以下数据
    {
      "P": ["", "12345"]
    }
    // 完结！！！
  ```
  