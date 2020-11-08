// 高阶函数
// let nums = [1, 2, 3]
// let obj = { val: 5 }
// let newNums = nums.map(function(item, index, array) {
//   const result = item + index + array[index] + this.val
//   console.log('result:', result)
//   return result
// }, obj)

// console.log('newNums:', newNums)


let nums = [2, 3, 1]
nums.sort(function(a, b) {
  if (a > b) return 1
  else if (a < b) return -1
  else return 0
})
console.log('nums:', nums)