// 手写call/apply/bind函数
Function.prototype.myCall = function(context) {
  // 判断调用对象
  if (typeof this !== 'function') {
    console.log('type error')
  }

   // 获取参数
  let args = [...arguments].slice(1),result = null

  context = context || window
  context.fn = this
  result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.myApply = function (context) {
  if (typeof this !== 'function') {
    console.log('type error')
  }
  let result = null
  context = context || window
  context.fn = this
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new Error('type error')
  }

  let args = [...arguments].slice(1),fn = this
  return function Fn() {
    return fn.apply(this instanceof Fn ? this : context, args.concat(...arguments))
  }
}