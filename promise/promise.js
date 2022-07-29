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

          }
        }
      } catch (e) {
        
      }
    })
  }
}