// 异步任务调度
class Scheduler {
  list = [] // 承接还未执行的异步
  count = 0 // 用来计数
  constructor (num) {
    this.num = num  // 允许同时运行的异步函数的最大个数
  }
  async add (fn) {
    this.count >= this.num ? await new Promise(resolve => this.list.push(resolve)) : '' // 如果数量大于最大数，往里面压入函数
    this.count++ // 数组里的数量push进去就加1
    const result = await fn()
    this.count-- // 执行完后，数量就减1
    if (this.list.length > 0) {
      this.list.shift()() // 如果数组中还有未执行的函数，就把他拿出来执行。
    }
    return result
  }
}

const scheduler = new Scheduler(3)

const asyncFactory = (n, time) => {
  return () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(n)
      }, time)
    })
  }
}

scheduler.add(asyncFactory(1, 1000)).then((n) => { console.log(`异步任务${n}`)})
scheduler.add(asyncFactory(2, 5000)).then((n) => { console.log(`异步任务${n}`)})
scheduler.add(asyncFactory(3, 3000)).then((n) => { console.log(`异步任务${n}`)})