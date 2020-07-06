 function isPalindrome(x) {
     if (x < 0) return false;
     let str = '' + x;
     return Array.from(str).reverse().join('') === str;
 }

 console.log(isPalindrome(123));