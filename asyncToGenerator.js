// async await 的实现
function asyncToGenerator(generatoFunc) {
  return function () {
    const gen = generatoFunc.apply(this, arguments)
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatoResult
        try {
          generatoResult = gen[key](arg)
        } catch (err) {
          return reject(err)
        }
        const { value, done } = genatoResult
        if (done) {
          return resolve(value)
        } else {
          return Promise.resolve(value).then(
            function onResolve(value) {
              step('next', value)
            },
            function onReject(err) {
              step('throw', err)
            }
          )
        }
      }
      step('next')
    })
  }
}