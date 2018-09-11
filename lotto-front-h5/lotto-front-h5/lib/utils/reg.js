/*
 * @Author: yubei
 * @Date: 2017-04-17 21:32:54
 * @Desc: 正则
 */

export default {
    //隐藏手机号
    phoneNumberHide(phone){
        return phone.toString().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    },

    //隐藏邮箱地址
    mailHide(mail){
        return mail.toString().replace(/^([a-zA-Z\d]{3})[^@]+/, '$1*****');
    },
    //隐藏中文名字，只显示第一个字符（英文也支持）
    nameHide(name){
        return name.toString().replace(/^([a-zA-Z\u2E80-\u9FFF]{1})[a-zA-Z\u2E80-\u9FFF]+/, '$1*');
    },
    //隐藏身份证号码
    idcardHide(idcard){
        return idcard.toString().replace(/^([\d]{2})[\d]{11,14}([\dxX]{2})/, '$1**************$2');
    },
    //隐藏银行卡号 6228*****6587
    bankCardHide(bankCard){
        return bankCard.toString().replace(/^(\d{4})\d+(\d{4})$/, '$1*******$2');
    },
    //隐藏银行卡号样式 *****6587
    bankCardHide2(bankCard){
        return bankCard.toString().replace(/^\d+(\d{4})$/, '*****$1');
    },

    //中文名称校验
    checkChinese(str){
        return /^[\u4e00-\u9fa5]+$/.test(str);
    },

    //身份证号校验
    checkID(str){
        return /\d{17}[\d|x]|\d{15}/.test(str);
    },

    //手机号码校验
    checkPhone(phone){
        return /^1[34578]\d{9}$/.test(phone);
    },

    //验证是否为浮点数字
    checkFloat(num){
        return /^\d+(\.\d+)?$/.test(num);
    },

    //手机号码替换成xxx xxxx xxxx格式
    phoneChange(phone){
        if(phone && phone.length > 3){
            return phone.toString().replace(/(^\d{3}|\d{4}\B)/g,"$1 ");
        }

        return phone;
    },

    //移除所有空格
    trim(str){
        return str.replace(/\s/g,'');
    },

    checkIdcard(value) { //身份证号码
        //15位和18位身份证号码的正则表达式
        let regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

        //如果通过该验证，说明身份证格式正确，但准确性还需计算
        if (regIdCard.test(value)) {
          if (value.length == 18) {
            let idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
            let idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            let idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
            for (let i = 0; i < 17; i++) {
              idCardWiSum += value.substring(i, i + 1) * idCardWi[i];
            }

            let idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
            let idCardLast = value.substring(17); //得到最后一位身份证号码

            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod == 2) {
              if (idCardLast == "X" || idCardLast == "x") {
                return true;
              } else {
                return false;
              }
            } else {
              //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
              if (idCardLast == idCardY[idCardMod]) {
                return true;
              } else {
                return false;
              }
            }
          }
        } else {
          return false;
        }
    },

    pswStrength(v) { 
        //密码强度校验，0.不通过 1.较低（数字+字母） 2.强（符号+数字或字母） 3.很强（数字+字母+符号）
        let lv = 0;
        let reg1 = /[a-zA-Z]+/; //字母
        let reg2 = /[0-9]+/; //数字
        let reg3 = /[\^ \$ \. \* \+  \- \? \= \! \: \| \\ \/ \( \) \[ \] \{ \}]+/; //特殊符号
        let reg4 = /\s+/; //空字符
        let reg5 = /[\u4e00-\u9fa5]+/; //中文
        if (v.toString().length < 6 || v.toString().length > 20 || reg4.test(v) || reg5.test(v)) {
        return 0;
        }
        if (reg1.test(v) && reg2.test(v)) {
        lv = 1;
        }
        if ((reg1.test(v) && reg3.test(v)) || (reg2.test(v) && reg3.test(v))) {
        lv = 2;
        }
        if (reg1.test(v) && reg2.test(v) && reg3.test(v)) {
        lv = 3;
        }
        return lv;
    },
}
