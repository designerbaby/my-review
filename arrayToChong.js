// 数组去重
function arrayToChong () {
  let arr = [1,3,4,6,3,7,8]
  let result = []
  for (let i = 0; i < arr.length; i++) {
    let j = 0
    for (j; j < result.length; j++) {
      if (arr[i] === result[j]) { // result数组中有原数组中的元素，break
        break
      }
    }
    if (j === result.length) { // result走完了，j等于result的长度
      result.push(arr[i]) // 说明这个元素不在result里面，那放到result里面吧
    }
  }
  console.log(result)
}

// test
arrayToChong()



