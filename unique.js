// 使用for嵌套for,然后splice去重
function unique (arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j += 1) {
      if (arr[i].t === arr[j].t) { // 后面的和前面的相同。那就说明有重复的。然后就去掉他
        arr.splice(j, 1)
        j--
      }
    }
  }
  console.log(arr)
}

unique([1,3,5,6,7,8,8,8,1,2,3,10])