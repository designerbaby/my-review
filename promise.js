// Promise源码

function Promise(fn) {
  let state = 'pending'
  let value = null
  const callbacks = []
  this.then = function (onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
      handle({
        onFulfilled,
        resolve,
        onRejected,
        reject
      })
    })
  }

  this.catch = function(onError) { // 捕获异常的方法
    return this.then(null, onError)
  }

  this.finally = function(onDone) { // 结束的方法
    return this.then(onDone, onError)
  }

  this.resolve = function (value) { // resolve执行
    if (value && value instanceof Promise) {
      return value
    } else if (value && typeof value === 'object' && typeof value.then === 'function') {
      let then = value.then
      return new Promise(resolve => {
        then(resolve)
      })
    } else if (value) {
      return new Promise(resolve => resolve(value))
    } else {
      return new Promise(resolve => resolve())
    }
  }

  this.reject = function (value) { // reject抛出异常的方法
    return new Promise(function(resolve, reject) {
      reject(value)
    })
  }

  this.all = function (arr) { // all方法的使用，所有方法都执行
    let args = Array.prototype.slice.call(arr)
    return new Promise(function(resolve, reject) {
      if (args.length === 0) return resolve([])

      const remaining = args.length

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            const then = val.then
            if (typeof then === 'function') {
              then.call(val, function(val) {
                res(i, val)
              }, reject)
              return
            }
          }
          args[i] = val
          if (--remaining === 0) {
            resolve(args)
          }
        } catch (e) {
          reject(e)
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i])
      }
    })
  }

  this.race = function(values) { // race方法的使用,只执行一次
    return new Promise(function(resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    })
  }

  function handle (callback) { // 处理函数
    if (state === 'pending') { // 如果是等待状态
      callbacks.push(callback)
      return
    } 

    const cb = state === 'fulfilled' ? callback.onFulfilled : callback.onRejected
    const next = state === 'fulfilled' ? callback.resolve : callback.reject

    if (!cb) {  // 执行态或拒绝态
      next(value)
      return
    }

    let ret
    try {
      ret = cb(value)
      next(ret)
    } catch (err) {
      callback.reject(err)
    }
    callback.resolve(ret)
  }

  function resolve(newValue) { // 执行下去
    const fn = () => {
      if (state !== 'pending') return

      if (newValue && (typeof newValue === 'object') || typeof newValue === 'function') {
        const { then } = newValue
        if (typeof then === 'function') {
          // newValue 为新产生的 Promise,此时resolve为上个 promise 的resolve
          //相当于调用了新产生 Promise 的then方法，注入了上个 promise 的resolve 为其回调
        then.call(newValue, resolve, reject)
          return
        }
      }

      state = 'fulfilled'
      value = newValue
      handleCb()   
    }

    setTimeout(fn, 0) 
  }

  function reject(error) { // 抛出错误
    const fn = () => {
      if (state !== 'pending') return // 等待执行

      if (error && (typeof error === 'object') || (typeof error === 'function')) {
        const { then } = error
        if (typeof then === 'function') {
          then.call(error, resolve, reject)
          return
        }
      }

      state = 'rejected'
      value = error
      handleCb()
    }
    setTimeout(fn, 0)
  }

  function handleCb() {
    while(callbacks.length) {
      const fn = callbacks.shift()
      handle(fn)
    }
  }
  try {
    fn(resolve, reject)
  } catch(err) {
    reject(err)
  }
}

// 测试代码
new Promise((resolve, reject) => {
  console.log('111')
  setTimeout(() => {
    resolve({ test: 1})
  }, 1000)
}).then(data => {
  console.log('result1:', data)
  return test()
}).then(data => {
  console.log('result2', data)
})

function test(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ test: 2})
    }, 5000)
  })
}
