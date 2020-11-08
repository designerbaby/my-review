// arguments不能调用数组方法，是另一种对象类型，为类数组

// function sum(a, b) {
//   let args = Array.prototype.slice.call(arguments)
//   console.log(args.reduce((sum, cur) => sum + cur))
// }

// console.log('sum:', sum(1, 2))

// function sum(a, b) {
//   // let args = Array.from(arguments) // 使用Array.from
//   let args = [...arguments] // 使用es6展开符 
//   console.log(args.reduce((sum, cur) => sum + cur))
// }

// console.log('from:', sum(2, 3))

function sum(a, b) {
  let args = Array.prototype.concat.apply([], arguments)
  console.log(args.reduce((sum, cur) => sum + cur))
}

console.log('from:', sum(2, 5))
