// extends原理
// 体现使用es6的extends实现继承
// 继承的最大问题在于：无法决定继承哪些属性，所有属性都得继承。
// 如何解决：使用组合的形式
function _possibleConstructorReturn(self, call) {
  return call && (typeof call === 'object' || typeof call === 'function') ? call : self
}

function _inherits(subClass, superClass) {
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  })
  if (subClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass
}

var Parent = function Parent() {
  _classCallCheck(this, Parent)
}

var Child = (function (_Parent) {
  _inherits(Child, _Parent)
  function Child() {
    _classCallCheck(this, Child)
    return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments))
  }
  return Child
}(Parent))