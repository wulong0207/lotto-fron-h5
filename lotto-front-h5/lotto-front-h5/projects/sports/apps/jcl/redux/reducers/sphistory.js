import {
    SP_HISTORY_MODE,
    SP_HISTORY_DATA,
    SP_PANKOU, SP_PANKOU_DATA
} from '../actions/sphistory.js';

import {
    updateField
} from "../../utils/basketball.js";

const defaultState = {
    showMode: false,
    selectData: {},
    betKind: "", //0胜负,1让分胜负，2大小分
    data: [],
    showPanKou: false,
    pankou: []
}

export const spHistory = (state=defaultState, action) => {
    switch (action.type) {
        case SP_HISTORY_MODE:
            return Object.assign({} , state, {
                        showMode: !state.showMode,
                        selectData: action.selectData,
                        betKind: action.betKind
                    });
        case SP_HISTORY_DATA:
            return Object.assign({} , state, {
                        data: action.data
                    });
        case SP_PANKOU:
            state.showPanKou = !state.showPanKou;
            return updateField(state);
        case SP_PANKOU_DATA:
            state.pankou = action.data;
            return updateField(state);
        default:
            return state;
    }
}
