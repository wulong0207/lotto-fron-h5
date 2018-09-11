export default {
  phone: /^1[3456789]\d{9}$/, // 验证手机号码
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, // 验证邮箱
  pwd_num: /^[0-9]*$/g, // 纯数字密码
  pwd_abc: /^([a-zA-Z]+)$/, // 纯字母密码
  pwd_space: /\s+/g, // 密码包含空格
  pwd_china: /[\u4E00-\u9FA5\uF900-\uFA2D]/, // 密码包含中文
  nickName: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, // 昵称规则
  userName: /^[\u4e00-\u9fa5][?·\u4e00-\u9fa5]{0,5}[\u4e00-\u9fa5]$/, // 实名姓名规则
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ // 身份证规则
};
