import React, {Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '@/services/message';
import { isEmpty } from 'lodash';
import "../css/pages/mix.scss";

import VsInfo from "../components/vs-info.jsx";
import BoxView from "../components/box-view.jsx";
import SFC from "../components/sfc.jsx"; //胜分差
import {getGameAreaTitle} from "../utils.js";
import {getSelected} from "../utils/bet.js";
import {renderGames} from "./common/gameHelper.jsx";

import {selectSFC,calcBet} from "../redux/actions/bet.js";
import { toggle } from '../redux/actions/sphistory.js';
import { connect } from 'react-redux';

class SFCPage extends Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount () {

    }

    componentWillReceiveProps (nextProps) {

    }

    //胜分差选择
    onSelectSFCPage(data, selectMark, add){
        this.props.onSelectSFCPage(data, selectMark, add);
    }

    //生成比赛
    renderGame(game, i){
        let {onSelectSF, bets} = this.props;
        let selection = getSelected(bets, game, "sfc");

        return <div className="game" key={i}>
            <VsInfo data={game}/>

            <div className="bet-select">
                <SFC sellMark={2} select={selection} onSelect={this.onSelectSFCPage.bind(this)} data={game}/>
            </div>
        </div>
    }

    render () {
        let {data} = this.props;

        return (
            <div className="yc-mix">
                {renderGames("sfc", data, this.renderGame.bind(this))}
            </div>
      );
    }
}

SFCPage.propTypes = {

};



const mapStateToProps = state => {
    return {
        bets: state.betSelected.bets, //投注选择
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleSP(data, betKind){
            dispatch(toggle(data, betKind));
        },
        onSelectSFCPage(data, selectMark, add){
            dispatch(selectSFC(data, selectMark, "sfc"));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SFCPage)
