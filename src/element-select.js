function ElementSelect (config) {
  this.config = this.initConfig(config)

  var start = function () {
    // console.log('start')
    document.body.style.userSelect = "none"
    this.status = "start"
    this.rootDom.style.display = "block"
    this.mousedownbind = this.mousedown.bind(this)
    this.rootDom.addEventListener("mousedown", this.mousedownbind)
  }

  var end = function () {
    // console.log('end')
    document.body.style.userSelect = "auto"
    this.status == "move" && this.mouseup()
    this.status = "end"
    this.rootDom.style.display = "none"
    this.rootDom.removeEventListener("mousedown", this.mousedownbind, false)
  }

  // 创建所需范围框选dom
  if (this.rootDom) this.destroy()
  this.createBox()
  this.handleMode(start, end)
}

ElementSelect.prototype.handleMode = function (start, end) {
  var types = ["ctrl", "shift", "alt"]
  if (this.config.startMode != 'handle' && types.includes(this.config.startMode)) {
    this.keydownbind = function (event) {
      if (((this.config.startMode == "ctrl" && event.key == "Control") || 
        (this.config.startMode == "alt" && event.key == "Alt") ||
        (this.config.startMode == "shift" && event.key == "Shift")) && 
        ["create", "end"].includes(this.status)) {
        start.call(this)
      }
    }.bind(this)
    document.addEventListener("keydown", this.keydownbind)
  } else {
    if (this.config.startMode == 'handle') {
      ElementSelect.prototype.start = start.bind(this)
    } else {
      throw 'config.startMode暂不支持其他模式'
    }
  }

  if (this.config.endMode != 'handle' && types.includes(this.config.endMode)) {
    this.keyupbind = function (event) {
      if (((this.config.startMode == "ctrl" && event.key == "Control") ||
        (this.config.startMode == "alt" && event.key == "Alt") ||
        (this.config.startMode == "shift" && event.key == "Shift"))) {
        end.call(this)
      }
    }.bind(this)
    document.addEventListener("keyup", this.keyupbind)
  } else {
    if (this.config.endMode == 'handle') {
      ElementSelect.prototype.end = end.bind(this)
    } else if (this.config.endMode != 'auto') {
      throw 'config.endMode暂不支持其他模式'
    }
  }
 }

ElementSelect.prototype.initConfig = function (config) {
  var _config = {
    el: "",
    boxStyle: "",
    startMode: "ctrl",
    endMode: "ctrl",
    model: '<div></div>',
    ...config
  }
  // create start down move up end destroy
  this.status = ""

  if (_config.el.constructor == String) {
    if (!_config.el) throw 'config.el为必填项，影响可选标签范围！'
    this.locator = _config.el // 存储选择器
    _config.el = _config.el.split(",").reduce((a, b) => (a[b.trim()] = document.querySelectorAll(b.trim())) && a, Object.create(null)) // .map(e => document.querySelectorAll(e))
    if (!Object.values(_config.el).reduce((a, b) => a + b.length, 0)) throw 'config.el找不到对应的标签'
    // console.log(_config.el)
    return _config
  } else {
    throw 'config.el选择器为必填项，且值为String类型'
  }
}

ElementSelect.prototype.createBox = function () {
  this.status = "create"
  var rootDom = document.createElement('div')
  var selectBox = document.createElement('span')

  rootDom.style = "position:fixed;top:0;left:0;right:0;bottom:0;display:none;"
  selectBox.style = "border:1px solid #409eff;background-color:rgba(255, 255, 255,0.1);" + this.config.boxStyle +";position:absolute;"

  // 处理model结构
  var v = document.createElement('div')
  v.innerHTML = this.config.model

  rootDom.append(selectBox, v.children[0])
  document.body.append(rootDom); v.remove();

  ElementSelect.prototype.rootDom = rootDom
  ElementSelect.prototype.selectBox = selectBox
}

// ElementSelect.prototype.createNode = function (tag, option, children) {
//   if (arguments.length === 2) {

//   }
//   document.createElement
// }

ElementSelect.prototype.mousedown = function (event) {
  if (event.button > 0) return false
  this.status = "down"
  var dombox = this.selectBox
  dombox.style.top = `${event.y}px`
  dombox.style.left = `${event.x}px`
  dombox.style.display = "block"
  // console.log('mousedown')
  this.startXY = {x: event.x , y: event.y}
  this.mousemovebind = this.mousemove.bind(this)
  this.mouseupbind = this.mouseup.bind(this)
  this.rootDom.addEventListener("mousemove", this.mousemovebind)
  this.rootDom.addEventListener("mouseup", this.mouseupbind)
}

ElementSelect.prototype.mousemove = function (event) {
  // console.log("mousemove", event);
  this.status = "move"
  var dombox = this.selectBox
  dombox.style.width = `${Math.abs(event.x - this.startXY.x)}px`
  dombox.style.height = `${Math.abs(event.y - this.startXY.y)}px`
  if (event.x - this.startXY.x < 0) {
    dombox.style.left = `${event.x}px`
  }
  if (event.y - this.startXY.y < 0) {
    dombox.style.top = `${event.y}px`
  }
}

ElementSelect.prototype.mouseup = function () {
  // console.log("mouseup");
  this.status = "up"
  var dombox = this.selectBox
  this.computeSelectElement(dombox.getBoundingClientRect())
  dombox.style.width = 0
  dombox.style.height = 0
  dombox.style.display = "none"
  this.rootDom.removeEventListener("mousemove", this.mousemovebind, false)
  this.rootDom.removeEventListener("mouseup", this.mouseupbind, false)
}

ElementSelect.prototype.start = function () {
  throw 'config.startMode的值应该设置成 handle，才能手动控制start'
}

ElementSelect.prototype.end = function () {
  // console.log('end')
  this.status == "move" && this.mouseup()
  this.status = "end"
  this.rootDom.style.display = "none"
  this.rootDom.removeEventListener("mousedown", this.mousedownbind, false)
}

ElementSelect.prototype._select = function (data) {
  // console.log(data)
  var dataset = {}
  if (this.config.dataset) {
    const dataType = {
      String: (e, f) => {
        dataset[f].push(e.dataset[this.config.dataset] || "")
      },
      Array: (e, f) => {
        dataset[f].push(this.config.dataset.reduce((a, b) => e.dataset[b] ? (a[b] = e.dataset[b]) && a : a, Object.create(null)))
      },
      Object: (e, f) => {
        dataset[f].push(this.config.dataset[f].reduce((a, b) => e.dataset[b] ? (a[b] = e.dataset[b]) && a : a, Object.create(null)))
      }
    }

    if (dataType[this.config.dataset.constructor.name]) {
      Object.keys(data).forEach(f => {
        dataset[f] = []
        data[f].forEach((e) => dataType[this.config.dataset.constructor.name](e,f))
      })
    } else {
      throw 'config.dataset格式不支持！'
    }
  }
  this.select(data, dataset)
}

ElementSelect.prototype.select = function (doms, dataset) {
  // console.log(doms, dataset)
}

ElementSelect.prototype.getFilterDoms = function (locator) {
  return locator.split(",").reduce((a, b) => (a[b.trim()] = []) && a, Object.create(null))
}

ElementSelect.prototype.computeSelectElement = function (scope) {
  var filterDoms = this.getFilterDoms(this.locator)
  Object.keys(filterDoms).forEach(e => {
    this.config.el[e].forEach(f => {
      var itemOffset = f.getBoundingClientRect()
      if (itemOffset.bottom > scope.top && itemOffset.top < scope.bottom && !(itemOffset.right < scope.left || itemOffset.left > scope.right)) {
        filterDoms[e].push(f)
      }
    })
  }); this._select(filterDoms)
}

ElementSelect.prototype.destroy = function() {
  this.status = "destroy"
  document.removeEventListener("keydown", this.keydownbind, false)
  document.removeEventListener("keyup", this.keyupbind, false)
  this.rootDom.remove()
}