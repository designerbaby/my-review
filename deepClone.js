// 深度克隆，使用递归算法
function deepClone(source) {
  const targetObj = source.constructor === Array ? [] : {}  // 判断复制的目标是对象还是数组
  for (let keys in source) { // 遍历数组
    if (source.hasOwnProperty(keys)) { // 判断有这个属性
      if (source[keys] && source[keys] === 'object') { // 如果有这个属性，并且这个属性是对象
        // targetObj[keys] = source[keys].constructor === Array ? [] : {} 
        targetObj[keys] = deepClone(source[keys]) // 如果是对象，就再递归拿到这个值
      } else {
        targetObj[keys] = source[keys]
      }
      console.log(`keys: ${keys}, targetObj[keys]: ${targetObj[keys]}`)
    }
  }
  return targetObj
}

const s = {
  a: 1,
  b: [1,2,3,4,5],
  c: {
    d: 1,
    e: [2,4]
  }
}

console.log('deepClone result:', deepClone(s))
