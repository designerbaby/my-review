// 实现一个双向绑定的过程

function defineReactive (data, key, val) {
  observe(val)   // 递归遍历所有子属性
  let dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true, // 可以被枚举
    configurable: true,
    get: function () {
      if (Dep.target) { // 如果需要添加订阅者
        dep.addSub(Dep.target) // 就添加一个订阅者
      }
      return val
    },
    set: function (newValue) {
      if (val === newValue) {
        return
      }
      val = newValue
      console.log(`${key}属性已经被监听，现在值为${val}`)
      dep.notify()
    }
  })
}
Dep.target = null

function Dep () {
  this.subs = []
}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub)
  },
  notify: function () {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}

function observe (data) {
  if (!data || typeof data !== 'object') {
    return
  }
  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key])
  })
}

var libary = {
  book1: {
    name: 'book1',
  },
  book2: ''
}

observe(libary)
libary.book1.name = 'test'
libary.book2 = 'ss'

function Watcher(vm, exp, cb) {
  this.cb = cb
  this.vm = vm
  this.exp = exp
  this.value = this.get() // 将自己添加到订阅器的操作
}

Watcher.prototype = {
  update: function () {
    this.run()
  },
  run: function () {
    var value = this.vm.data[this.exp]
    var oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
  },
  get: function () {
    Dep.target = this // 缓存自己
    var value = this.vm.data[this.exp] // 强制执行监听器里的get函数
    Dep.target = null // 释放自己
    return value
  }
}

function SelfVue (data, el, exp) {
  this.data = data
  observe(data)
  el.innerHTML = this.data[exp]
  new Watcher(this, exp, function(value) {
    el.innerHTML = value
  })
  return this
}