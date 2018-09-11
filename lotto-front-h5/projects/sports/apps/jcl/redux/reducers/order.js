import {
    Add_ORDER, TOGGLE_ORDER,
    NEW_ORDER_REQUEST, NEW_ORDER_REQUEST_SUCCESS, NEW_ORDER_REQUEST_FAIL
} from '../actions/order';

import {
    updateField
} from "../../utils/basketball.js";

import {addOrder} from "../../utils/order.js";

const defaultState = {
    show: false,
    data: [],
    currentOrderId: "",
    endTime: new Date(),
    status: 'ide'
};

export const order = (state=defaultState, action) => {
    switch (action.type) {
        case Add_ORDER:
            return updateField(state);
        //显示未支付订单详情
        case TOGGLE_ORDER:{
            state.show = !state.show;
            state.data = action.data || [];
            state.currentOrderId = action.currentOrderId || "";

            return updateField(state);
        }
        case NEW_ORDER_REQUEST:
            return { ...state, status: 'pending' };
        case NEW_ORDER_REQUEST_SUCCESS:
            return { ...state, status: 'success' };
        case NEW_ORDER_REQUEST_FAIL:
            return { ...state, status: 'fail' };
        default:
            return state;
    }
}
