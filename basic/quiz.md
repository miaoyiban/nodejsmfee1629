1.Q:
console.log("start");

(function () {
  console.log("IIFE");
  setTimeout(function () {
    console.log("Timeout");
  }, 1000);
})();

console.log("end");

 A:
 依序印出 
 start
 IIFE
 end
 Timeout
 
 執行第一行的console印出start
 再立刻呼叫一個函式，進到函式裏頭依序console出IIFE
 然而setTimeout需要等待
 接著跳出函式console出end
2.Q:
console.log("start");

(function () {
  console.log("IIFE");
  setTimeout(function () {
    console.log("Timeout");
  }, 0);
})();

console.log("end");

A:結果同1，由於JS是單線程所以會由後面的先執行


3.Q:
const bar = () => console.log("bar");

const baz = () => console.log("baz");

const foo = () => {
  console.log("foo");
  bar();
  baz();
};

foo();

A:依序印出
foo
bar
baz

4.
Q:
const bar = () => console.log("bar");

const baz = () => console.log("baz");

const foo = () => {
  console.log("foo");
  setTimeout(bar, 0);
  baz();
};

foo();

A:bar會報出尚未宣告，由於是單線程，在呼叫foo的函式的時候，setTimeout讓bar的函式暫停而直接續去下去，使得foo()的呼叫會比bar的宣告還早