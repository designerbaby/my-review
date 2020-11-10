// 实现map源码
Array.prototype.map = function(callbackFn, thisArg) {
  // 处理数组异常
  if (this === null || this === undefined) {
    throw new TypeError('Cannot read property map of null or undefined')
  }
  // 处理回调函数异常
  if (Object.prototype.toString.call(callbackFn) != '[object Function') {
    throw new TypeError(callbackFn + 'is not a function')
  }

}