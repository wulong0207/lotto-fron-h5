/**
 * Created by wangzhiyong
 * date:2017-02-23
 * desc:排列算法,暂时不用不到
 */
/**
 *
 * @param arr 排列的数组
 * @param size 排列数
 * @returns {Array}
 */
let queue= (arr, size,)=> {
        /*
         来源网上，这里的排列和组合一样 也是运用循环和递归的思想，比如arr=[1,2,3] ,size=3
         第一次循环curItem=1 第一次递归newArr=3,result=[1,2] 所以结果是[1,2,3]
         第一次循环curItem=1 第二次递归newArr=2,result=[1,3] 所以结果是[1,3,2]
         第二次循环curItem=2 第一次递归newArr=3,result=[2,1] 所以结果是[2,1,3]
         第二次循环curItem=2 第二次递归newArr=1,result=[2,3] 所以结果是[2,3,1]
           以此类推出
         */
        if (size > arr.length) { return; }
        var allResult = [];
      var func=    (arr, size, result) =>{
            if (result.length == size) {
                allResult.push(result);
            } else {
                for (var i = 0, len = arr.length; i < len; i++) {
                    var newArr = [].concat(arr),
                        curItem = newArr.splice(i, 1);
                    func(newArr, size, [].concat(result, curItem));
                }
            }
        };
      func(arr, size, []);

        return allResult;
    }

export default queue;



