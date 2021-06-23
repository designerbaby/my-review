// js经典面试题
// for (var i = 0; i < 5; i ++) { // 01234
//   console.log(i)
// }

// for (var i = 0; i < 5; i ++) { // 55555
//   setTimeout(() => {
//     console.log(i)
//   }, 100*i)
// }

// for (var i = 0; i < 5; i ++) { // 01234
//   (function(i){
//     setTimeout(() => {
//       console.log(i)
//     }, 100*i)
//   })(i)
// }


// for (var i = 0; i < 5; i++) { // 55555
//   (function() {
//     setTimeout(function() {
//       console.log(i);
//     }, i * 1000);
//   })(i);
// }

// for (var i = 0; i < 5; i++) { // 0 throw error
//   setTimeout((function(i) {
//     console.log(i);
//   })(i), i * 1000);
// }

setTimeout(function() {
  console.log(1)
}, 0);
new Promise(function executor(resolve) {
  console.log(2);
  for( var i=0 ; i<10000 ; i++ ) {
    i == 9999 && resolve();
  }
  console.log(3);
}).then(function() {
  console.log(4);
});
console.log(5);

// var a = function () {
//   this.b = 3
// }
// var c = new a()
// a.prototype.b = 9
// var b = 7
// a()
// console.log(b)
// console.log(c.b)