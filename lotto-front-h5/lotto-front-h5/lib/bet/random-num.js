/**
 * Created by wangzhiyong
 * date:2017/2/28.
 * desc:产生随机数
 */
let func = require("../libs/func");
import func from '../libs/func';
/**
 *
 * @param {最小值,number, required} min
 * @param {最大值,number, required } max
 * @param {随机个数,number,required} num
 * @param {必须除去的数字,array} remove
 * @param {必须有的数字,array} bravery
 * @returns [] 数组
 * @constructor
 */
let RandomNum = function (min, max, num, remove = [], bravery = []) {
  try {
    if (typeof  min !== "number" || typeof  max !== "number" || typeof  num !== "number") {
      throw  new Error("min,max,num参数必须为数字");
    }
    if (!(remove instanceof Array) || !(bravery instanceof Array)) {
      throw new Error("排除号码/必出号码必须为数组");
      
    }
    
    let newSet = func.outRepeat(remove.concat(bravery));//合并除去重复的,因为要兼容IE8，所以不能使用Set
    let range = max - min;
    let count = 0;
    let whileMax = 0;//最大次数
    let result = [].concat(bravery);//复制
    num = num - bravery.length;//真正随机的个数
    while (whileMax < 10000 && count < num && (range - newSet.length + 1) >= num) {
      //能够生成的数字必须要超过需要随机的个数，否则陷入死循环
      let rand = Math.random();
      let rnum = (min + Math.round(rand * range));
      if (result.indexOf(rnum) > -1 || (remove && remove.indexOf(rnum)) > -1 || (bravery && bravery.indexOf(rnum) > -1)) {//已经产生，或者被排除了
      }
      else {
        result.push(rnum);
        count++;
      }
      whileMax++;
    }
    
    return result;
  } catch (e) {
    throw new Error(e.message);
    return [];
  }
  
}
export default RandomNum;