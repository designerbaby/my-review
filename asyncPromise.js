async function async1 () {
  console.log('async1 start')
  await async2()
  console.log('async1 end')
}

function async2 () {
  console.log('async2 start')
  return new Promise(function(resolve) {
    resolve()
    console.log('async2 resolve')
  }).then(() => {
    console.log('async2 then')
  })
}
console.log('scirpt start')
async1()
setTimeout(() => {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('promise1')
}).then(() => {
  console.log('promise2')
}).then(() => {
  console.log('promise3')
})
console.log('scirpt end')
