let arr = [1,2,3,4,5,2,3,4,5]
let unique = (arr) => {
  let seen = new Map()
  return arr.filter((item) => {
    return !seen.has(item) && seen.set(item, 1)
  })
}

console.log(unique(arr))