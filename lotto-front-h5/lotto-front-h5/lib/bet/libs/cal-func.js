/**
 * @author wangzhiyong
 * @createTime 2017/4/5
 * @description
 * 组合计算公式
 */

let calFunc = {
  /**
   *
   * @param {阶乘基数,number,required}n
   * @param {小于时不再递归,number} limit 为了减少组合计算时的递归次数，当小于这个数的时候不再继续计算
   * @returns {number}
   */
  factorial: function(n, limit = null) {
    return n <= 1
      ? 1
      : limit !== null
        ? n - 1 >= limit ? n * calFunc.factorial(n - 1, limit) : 1
        : n * calFunc.factorial(n - 1, limit);
  },
  /**
   *
   * @param {组合基数,number,required} M
   * @param {组合数,number,required} N
   */
  combin(M, N) {
    if (isNaN(M) || isNaN(N) || M < 0 || N < 0 || M < N) {
      // TODO 此值有疑问
      return 1;
    } else {
      return this.factorial(M, M - N) / this.factorial(N);
    }
  },
  /**
   *
   * @param {基数,number,required} M
   * @param {排列数,number,required}N
   */
  queue(M, N) {
    if (
      typeof M !== 'number' ||
      typeof N !== 'number' ||
      M < 0 ||
      N < 0 ||
      M < N
    ) {
      return 0;
    } else {
      return this.factorial(M) / this.factorial(M - N);
    }
  },
  quickSort(arr) {
    // 如果数组<=1,则直接返回
    if (arr.length <= 1) {
      return arr;
    }
    var pivotIndex = Math.floor(arr.length / 2);
    // 找基准，并把基准从原数组删除
    var pivot = arr.splice(pivotIndex, 1)[0];
    // 定义左右数组
    var left = [];
    var right = [];

    // 比基准小的放在left，比基准大的放在right
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] <= pivot) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    // 递归
    return this.quickSort(left).concat([pivot], this.quickSort(right));
  },
  get(obj, key) {
    let result = obj;
    let list = key.split('.');
    key = list.pop();
    list.map(item => {
      result = result[item];
    });
    return result[key];
  },
  add() {
    let args = arguments,
      powList = [],
      pow,
      result = 0;
    for (let i = 0; i < args.length; i++) {
      let arr = args[i].toString().split('.');
      powList.push(arr[1] ? arr[1].length : 0);
    }
    pow = Math.pow(10, Math.max(...powList));
    for (let i = 0; i < args.length; i++) {
      result += args[i] * pow;
    }
    return Math.round(result) / pow;
  },
  arrayAdd: function(a, f) {
    var n = 0;
    if (f) {
      for (var i = 0, l = a.length; i < l; i++) {
        n += f(a[i]);
      }
    } else {
      for (var i = 0, l = a.length; i < l; i++) {
        n += a[i];
      }
    }
    return n;
  },
  arrayMultiple: function(a, f) {
    var n = 1;
    if (f) {
      for (var i = 0, l = a.length; i < l; i++) {
        n *= f(a[i]);
      }
    } else {
      for (var i = 0, l = a.length; i < l; i++) {
        n *= a[i];
      }
    }
    return n;
  },
  mathCR(arr, num) {
    var r = [];
    (function f(t, a, n) {
      if (n == 0) return r.push(t);
      for (var i = 0, l = a.length - n; i <= l; i++) {
        f(t.concat(a[i]), a.slice(i + 1), n - 1);
      }
    })([], arr, num);
    return r;
  }
};

export default calFunc;
