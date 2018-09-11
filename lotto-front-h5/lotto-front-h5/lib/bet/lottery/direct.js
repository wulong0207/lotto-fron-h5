/**
 * Created by wangzhiyong
 * date:2017/3/1.
 * desc N直选
 */

class Direct {
  constructor(option, noRepeat = true, bravery = [], sort = true) {
    this.option = option * 1;
    this.noRepeat = noRepeat;
    this.bravery = bravery;
    this.sort = sort;
  }
  
  /***
   * 计算并返回每注数组
   * @param betInfo 二维数组
   * @param noRepeat 默认不允许重复
   * @param bravery 必须有的项
   * @param sort 默认有先后顺序
   * @return {*}
   */
  calc(betInfo, noRepeat = this.noRepeat, bravery = this.bravery, sort = this.sort) {
    let result = this.vaid(betInfo);
    if (result) {
      return result;
    }
    result = this.doExchange(betInfo, noRepeat, bravery);
    // 不区分顺序，去重
    if (!sort) {
      result = this.outRepeat(result);
    }
    return result;
  }
  
  /***
   * 二维数组组合排序
   * @param doubleArrays
   * @param noRepeat
   * @param bravery
   * @param sort
   * @return {*}
   */
  doExchange(doubleArrays, noRepeat, bravery, sort) {
    var len = doubleArrays.length;
    if (len >= 2) {
      var len1 = doubleArrays[0].length;
      var len2 = doubleArrays[1].length;
      var temp = [];
      for (var i = 0; i < len1; i++) {
        for (var j = 0; j < len2; j++) {
          // 判断不重复
          if (!(noRepeat && new RegExp(`(^|,)${doubleArrays[1][j]}($|,)`, 'g').test(doubleArrays[0][i]))) {
            // 判断胆码
            if (bravery && bravery.length > 0) {
              let bool = true;
              bravery.map(item => {
                if (!new RegExp(`(^|,)${item}($|,)`, 'g').test(doubleArrays[0][i] + ',' + doubleArrays[1][j])) {
                  bool = false;
                  return;
                }
              });
              if (bool) {
                temp.push(doubleArrays[0][i] + ',' + doubleArrays[1][j]);
              }
            } else {
              temp.push(doubleArrays[0][i] + ',' + doubleArrays[1][j]);
            }
          }
        }
      }
      var newArray = new Array(len - 1);
      for (var i = 2; i < len; i++) {
        newArray[i - 1] = doubleArrays[i];
      }
      newArray[0] = temp;
      return this.doExchange(newArray, noRepeat, bravery, sort);
    } else {
      return doubleArrays[0];
    }
  }
  
  /***
   * 验证参数
   * @param betInfo
   * @return {*}
   */
  vaid(betInfo) {
    let reg = new RegExp("^[+]?[0-9]+$", "i");
    if (!reg.test(this.option)) {
      return ("直选个数必须为数字")
    }
    
    if (!betInfo || (betInfo && !betInfo instanceof Array)) {
      return ("直选信息参数格式不对,必须是数组");
    }
    
    if (betInfo.length != this.option) {
      return ("直选数组必须长度必须直选个数相同");
    }
    for (let i = 0; i < betInfo.length; i++) {
      if (!betInfo[i] instanceof Array) {
        return ("每个直选位的的选号信息必须是数组")
      }
    }
    return null;
  }
  
  /***
   * 去重['1,2,3','3,2,1']=>['1,2,3']
   * @param arr
   * @return {[]}
   */
  outRepeat(arr) {
    let result = [], temp = [];
    arr.map(item => {
      let t = item.split(',').sort().join(',');
      if (temp.indexOf(t) === -1) {
        temp.push(t);
        result.push(item);
      }
    });
    return result;
  }
}
export default Direct;