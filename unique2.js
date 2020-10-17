// 使用indexOf去重
let arr = [1,2,3,4,5,2,3,4,5]
let unique = (arr) => {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index
  })
}

console.log(unique(arr))