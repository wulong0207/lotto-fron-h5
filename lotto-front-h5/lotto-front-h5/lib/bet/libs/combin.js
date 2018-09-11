/**
 * Created by wangzhiyong
 * date:2017-02-23
 * desc:组合算法
 * TODO 待优化
 */

/**
 *
 * @param {array,required}arr 组合数组
 * @param {number,required}size 组合数
 * @param {array}required 必选数
 * @returns {Array}
 */
let combin = (arr, size, required) => {
  /*
   来源于网上，增加了必选项功能，每循环后得到一次结果，对结果进行筛选
   举例来说吧combin([1,2,3,4,5,6], 3)
   第一次循环的时候 arr是[1,2,3,4,5,6],size=3,result=[],
   经过一次递归后的结果是什么样的了?递归里面也有循环递归
   经过第一次循环第一次递归变为arr=[3,4,5,6],size=1,result=[1,2],所以结果就出来了[1,2,3][1,2,4][1,2,5][1,2,6]
   那么第一次循环第二次递归arr=[4,5,6],size=1,result=[1,3],所以结果就出来了[1,3,4][1,3,5][1,3,6]
   那么第一次循环第三次递归arr=[5,6],size=1,result=[1,4],所以结果就出来了[1,4,5][1,4,6]
   那么第一次循环第四次递归arr=[6],size=1,result=[1,5],所以结果就出来了[1,5,6]
   那么第二次循环第一次递归变为arr=[4,5,6],size=1,result=[2,3],所以结果就出来了[2,3,4][2,3,5][2,3,6]
   */
  if (!arr || !arr instanceof Array || typeof  size !== "number" || (required && !required instanceof Array)) {
    throw new Error("组合时参数格式不正确");
    return [];
  }
  let allResult = [];//最终结果
  let requiredReg =required&&required.length>0? new RegExp(","+required.join(",") + ",", "g") : null;//必选数转为正则用于筛选,用逗号隔开，防止数字的错判
  let filter = newResult => {
    if (requiredReg) {
      let str = ","+newResult.join(",") + ",";
      let match = str.match(requiredReg);
      let matchTimes = match ? match.length : 0;
      if (matchTimes > 0 && matchTimes < size) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  
  let func = function (arr, size, result) {
    let arrLen = arr.length;
    if (size > arrLen) {
      return;
    }
    if (size == arrLen) { //全选
      let newResult = [].concat(result, arr);
      filter(newResult) ? allResult.push(newResult) : void(0);
    } else {
      for (var i = 0; i < arrLen; i++) {
        var newResult = [].concat(result);//复制
        newResult.push(arr[i]);//得到当前位号
        if (size == 1) { //遍历完成,得到当前循环中的所有组合
          filter(newResult) ? allResult.push(newResult) : void(0);
        } else {
          var newArr = [].concat(arr);//复制
          newArr.splice(0, i + 1);//删除已经遍历的元素
          func(newArr, size - 1, newResult);//递归遍历剩下的元素
        }
      }
    }
  };
  func(arr, size, []);//开始执行
  return allResult;
}
export default combin;