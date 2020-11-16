async function async1 () {
  console.log('async1 start') // 2 同步任务
  await async2()
  console.log('async1 end') // 8 等async2中执行完就执行，这里也是微观任务，可以改写成.then(() => { console.log('async1 end') })
}

function async2 () {
  console.log('async2 start') // 3 同步任务
  return new Promise(function(resolve) {
    resolve()
    console.log('async2 resolve') // 4 同步任务
  }).then(() => {
    console.log('async2 then') // 7 微观任务，等同步任务完了就执行微观任务。
  })
}
console.log('scirpt start') // 1 同步任务
async1()
// 最后，因为是宏观任务
setTimeout(() => {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('promise1') // 5 同步任务 下面的都不会执行了，因为resolve没有执行
}).then(() => {
  console.log('promise2')
}).then(() => {
  console.log('promise3')
})
console.log('scirpt end') // 6 同步任务
