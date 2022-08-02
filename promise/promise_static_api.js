import MyPromise from "./promise";

// 捕获错误。
MyPromise.prototype.catch = function (catchFn) {
  return this.then(null, catchFn);
}

// 执行最后执行的程序
MyPromise.prototype.finally = function (finallyFn) {
  function getFn() {
    return function () {
      finallyFn && finallyFn();
    }
  }
  return this.then(getFn(), getFn());
}

// 所有方法都执行。
MyPromise.all = function (promiseSet) {
  let dfResolve;
  let dfReject;
  let finishCount = 0;
  let resultSet = [];
  let p = new MyPromise((resolve, reject) => {
    dfResolve = resolve;
    dfReject = reject;
  });

  for (let i = 0; i < promiseSet.length; i += 1) {
    let promise = promiseSet[i];
    if (promise instanceof MyPromise) {
      promise.then((val) => {
        ++finishCount;
        resultSet[i] = val;
        if (finishCount === promiseSet.length) {
          dfResolve(resultSet);
        }
      }, (errorReason) => {
        dfReject(errorReason);
      })
    } else {
      ++finishCount;
      resultSet[i] = promise;
      if (finishCount === promiseSet.length) {
        dfResolve(resultSet);
      }
    }
  }

  return p;
}

// 只执行一次
MyPromise.race = function (promiseSet) {
  let dfResolve;
  let dfReject;
  let p = new MyPromise((resolve, reject) => {
    dfResolve = resolve;
    dfReject = reject;
  });

  for (let i = 0; i < promiseSet.length; i += 1) {
    let promise = promiseSet[i];
    if (promise instanceof MyPromise) {
      promise.then(dfResolve, dfReject);
    } else {
      dfResolve(promise);
    }
  } 

  return p;
}

MyPromise.any = function (promiseSet) {
  let dfResolve;
  let dfReject;

  let rejectCount = 0;
  let rejectSet = [];

  let p = new MyPromise((resolve, reject) => {
    dfResolve = resolve;
    dfReject = reject;
  });

  for (let i = 0; i < promiseSet.length; i += 1) {
    let promise = promiseSet[i];
    if (promise instanceof MyPromise) {
      promise.then((val) => {
        dfResolve(val);
      }, (errorReason) => {
        ++rejectCount;
        rejectSet.push(errorReason);
        if (rejectCount === promiseSet.length) {
          dfReject(rejectSet);
        }
      })
    } else {
      dfResolve(promise);
    }
  }

  return p;
}

MyPromise.allSettled = function (promiseSet) {
  let dfResolve;
  let dfReject;
  let finishCount = 0;
  let resultSet = [];
  let p = new MyPromise ((resolve, reject) => {
    dfResolve = resolve;
    dfReject = reject;
  })

  for (let i = 0; i < promiseSet.length; i += 1) {
    let promise = promiseSet[i];
    if (promise instanceof MyPromise) {
      promise.then((val) => {
        ++finishCount;
        resultSet[i] = { status: "fulfilled", value: val };
        if (finishCount === promiseSet.length) {
          dfResolve(resultSet);
        }
      }, (errorReason) => {
        ++finishCount;
        resultSet[i] = { status: "rejected", reason: errorReason };
        if (finishCount === promiseSet.length) {
          dfReject(errorReason);
        }
      })
    } else {
      ++finishCount;
      resultSet[i] = { status: "fulfilled", value: promise };
      if (finishCount === promiseSet.length) {
        dfResolve(resultSet);
      }
    }
  }

  return p;
}

// resolve执行的方法
MyPromise.resolve = function (result) {
  return new MyPromise((resolve) => resolve(result));
}

// reject抛出异常的方法
MyPromise.reject = function (errorReason) {
  return new MyPromise((_, reject) => reject(errorReason));
}