/**
 * userNameReg:账号名正则
 * phoneReg:手机号正则
 * mailReg:邮箱正则
 * realnameReg:真实姓名正则
 * bankCardReg:银行卡号正则
 */
export default {
    // userNameReg:/^[a-z0-9A-Z\u4E00-\u9FA5\d\_]{4,20}$/g,
    userNameReg:/^[a-zA-Z\u2E80-\u9FFF\d\-_]{4,20}$/,
    phoneReg:/^1[34578]\d{9}$/,
    mailReg:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    realnameReg:/^[\u2E80-\u9FFF\·]{2,6}$/,
    idcardReg:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    bankCardReg:/^\d{16,19}$/,
}
