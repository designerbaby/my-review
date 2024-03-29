import promiseAplusTests from "promises-aplus-tests";

const Promise_State = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
}

class MyPromise {
  constructor (executerFn) {
    this.state = Promise_State.PENDING;
    this.thenSet = [];
    try {
      executerFn(this._resolveFn.bind(this), this._rejectedFn.bind(this));
    } catch (e) {
      this._rejectedFn.call(this, e);
    }
  }

  _resolveFn(result) {
    const [resolve, reject] = this._runBothOneTimeFunction(
      this._resolveFn.bind(this),
      this._rejectedFn.bind(this)
    );
    if (this._thenableResolve(result, resolve, reject)) {
      return;
    }
    // 2.1.2
    if (this._checkStateCanChange()) {
      this.state = Promise_State.FULFILLED;
      this.result = result;
      this._tryRunThen();
    }
  }

  // get resolve/reject function only run once
  _runBothOneTimeFunction(resolveFn, rejectFn) {
    let isRun = false;

    function getMutuallyExclusiveFn(fn) {
      return function (val) {
        if (!isRun) {
          isRun = true;
          fn(val);
        }
      }
    }
    return [
      getMutuallyExclusiveFn(resolveFn),
      getMutuallyExclusiveFn(rejectFn),
    ]
  }

  _rejectedFn(rejectedReason) {
    // 2.1.3
    if (this._checkStateCanChange()) {
      this.state = Promise_State.REJECTED;
      this.rejectedReason = rejectedReason;
      this._tryRunThen();
    }
  }

  _tryRunThen() {
    if (this.state !== Promise_State.PENDING) {
      // 2.2.6
      while(this.thenSet.length) {
        const thenFn = this.thenSet.shift();
        if (this.state === Promise_State.FULFILLED) {
          this._runThenFulfilled(thenFn);
        } else if (this.state === Promise_State.REJECTED) {
          this._runThenRejected(thenFn);
        }
      }
    }
  }

  _thenableResolve(result, resolve, reject) {
    try {
      if (result instanceof MyPromise) {
        // 2.3.2
        result.then(resolve, reject);
        return true;
      }
      
      if (typeof(result) === "Object" || typeof(result) === "Function") {
        const thenFn = result.then;
        if (typeof(thenFn) === "Function") {
          // 2.3.3.3
          thenFn(resolve, reject);
          return true;
        }
      }
    } catch (e) {
      // 2.3.3.3.4
      reject(e);
      return true;
    }
  }

  _runThenWrap(onFn, fnVal, prevPromise, resolve, reject) {
    this._runMicroTask(() => {
      try {
        const thenResult = onFn(fnVal);
        if (thenResult instanceof MyPromise) {
          if (prevPromise === thenResult) {
            // 2.3.1
            reject(new TypeError());
          } else {
            // 2.3.2
            thenResult.then(resolve, reject);
          }
        } else {
          // 2.3.3
          if (typeof(thenResult) === "Object" || typeof(thenResult) === "Function") {
            // 2.3.3.1
            const thenFunction = thenResult.then;
            if (typeof(thenFunction) === "Function") {
              const [resolvePromise, rejectPromise] = this._runBothOneTimeFunction((result) => {
                if (!this._thenableResolve(result, resolve, reject)) {
                  resolve(result);
                }
              }, (errorReason) => {
                reject(errorReason);
              })

              try {
                thenFunction.call(thenResult, resolvePromise, rejectPromise);
              } catch (e) {
                // 2.3.3.2
                rejectPromise(e);
              }
              return;
            }
          }

          // 2.3.3.4
          // 2.3.4
          resolve(thenResult);
        }
      } catch (e) {
        reject(e);
      }
    })
  }

  _runThenRejected(thenFn) {
    const onFulfilledFn = thenFn[0];
    const [resolve, reject] = this._runBothOneTimeFunction(thenFn[2][1], thenFn[2][2]);
    if (!onFulfilledFn || typeof(onFulfilledFn) !== "Function") {
      // 2.2.73
      resolve(this.result);
    } else {
      this._runThenWrap(onFulfilledFn, this.result, thenFn[2][0], resolve, reject);
    }
  }

  _runMicroTask(fn) {
    // 2.2.4
    queueMicrotask(fn);
  }

  _checkStateCanChange() {
    // 2.1.1
    return this.state === Promise_State.PENDING;
  }

  then(onFulfilled, onRejected) {
    const nextThen = [];
    const nextPromise = new MyPromise((resolve, reject) => {
      nextThen[1] = resolve;
      nextThen[2] = reject;
    });
    nextThen[0] = nextPromise;

    // 2.2.6
    this.thenSet.push([onFulfilled, onRejected, nextThen]);
    this._runMicroTask(() => this._tryRunThen());
    return nextThen[0];
  }
}

function typeOf(check) {
  const type = Object.prototype.toString.call(check);
  return type.match(/\[object\ (.*)\]/)[1];
}

MyPromise.defer = MyPromise.deferred = function () {
  let dtd = {};
  dtd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

export default MyPromise;

describe("Promises/A+ Tests", function () {
  promiseAplusTests.mocha(MyPromise);
})