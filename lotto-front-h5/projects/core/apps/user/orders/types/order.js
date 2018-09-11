import PropTypes from 'prop-types';

function validDateStr(props, propName, componentName) {
  const value = props[propName];
  let valid = true;
  if (typeof value !== 'string' || isNaN(Date.parse(value))) {
    valid = false;
  }
  if (!valid) return new Error(`错误的时间格式, ${propName}, ${componentName}`);
}

const Order = {
  account: PropTypes.string.isRequired,
  sysDate: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  orderBaseInfoBO: PropTypes.shape({
    // betNum: PropTypes.number,
    // buyType: PropTypes.number,
    // contentType: PropTypes.number,
    // endSaleTime: validDateStr,
    // // endTicketTime: validDateStr,
    // id: PropTypes.number,
    // isDltAdd: PropTypes.oneOf([0, 1]),
    // lotteryChildCode: PropTypes.number,
    // lotteryCode: PropTypes.number,
    // lotteryIssue: PropTypes.string,
    // lotteryLogoUrl: PropTypes.string,
    // lotteryName: PropTypes.string,
    // // lotteryTime: validDateStr,
    // multipleNum: PropTypes.number,
    // orderAmount: PropTypes.number,
    // orderBuyTime: validDateStr,
    // orderCode: PropTypes.string,
    // orderCreateTime: validDateStr,
    // orderFlowInfoBO: PropTypes.shape({
    //   buyType: PropTypes.number,
    //   createTime: validDateStr,
    //   message: PropTypes.string,
    //   status: PropTypes.number
    // }),
    // orderFlowUnionStatus: PropTypes.number,
    // orderFlowUnionStatusText: PropTypes.string,
    // orderStatus: PropTypes.number,
    // orderUnionStatus: PropTypes.number,
    // orderUnionStatusText: PropTypes.string,
    // orderUpdateTime: validDateStr,
    // payStatus: PropTypes.number,
    // platform: PropTypes.number,
    // showDate: validDateStr,
    // // throwTime: validDateStr,
    // winningStatus: PropTypes.number,
    // winningText: PropTypes.string
  }),
  userNumPage: PropTypes.shape({
    // code: PropTypes.string,
    // total: PropTypes.number,
    // data: PropTypes.arrayOf(PropTypes.shape({
    //   amount: PropTypes.number,
    //   buyNumber: PropTypes.number,
    //   childName: PropTypes.string,
    //   contentType: PropTypes.number,
    //   lotteryChildCode: PropTypes.number,
    //   multiple: PropTypes.number,
    //   planContent: PropTypes.string
    // }))
  })
};

export default Order;
