import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { MODES } from '../constants';
import { toggleMode, changeMode } from '../redux/actions/mix';
import { connect } from 'react-redux';
import { setHistoryState } from '../utils/basketball';

class BasketballPageMode extends PureComponent {
  constructor(props) {
    super(props);
    this.mask = null;
  }

  componentDidMount() {
    this.mask = document.createElement('div');
    this.mask.id = 'mode_filter_mask';
    this.mask.style.display = 'none';
    document.getElementById('app').appendChild(this.mask);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      if (this.props.show) {
        this.props.toggle();
      }
    }
    if (nextProps.show !== this.props.show) {
      this.mask.style.display =
        this.mask.style.display === 'none' ? 'block' : 'none';
    }
  }

  render() {
    const props = this.props;
    const currentFilter = MODES.filter(f => f.name === props.mode)[0];
    const onTap = e => {
      if (props.page !== 'mix') {
        this.props.changePage('mix');
        if (props.mode !== 'mi') {
          setHistoryState(props.mode);
        }
        return undefined;
      }
      props.toggle();
    };
    return (
      <div>
        <div className="filter-mask" />
        <div className="mix-tab" onClick={ onTap }>
          <span>{currentFilter ? currentFilter.label : '混合过关'}</span>
          <span className="arrows" />
        </div>
        <div
          className="menu-small"
          style={ { display: props.show ? '' : 'none' } }
        >
          <ul>
            {MODES.map(f => {
              return (
                <li
                  key={ f.name }
                  onClick={ e => props.change(f.name) }
                  className={ classnames({ active: props.mode === f.name }) }
                >
                  {f.label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

BasketballPageMode.propTypes = {
  mode: PropTypes.oneOf(MODES.map(f => f.name)).isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  page: PropTypes.string,
  changePage: PropTypes.func
};

const mapStateToProps = state => {
  return {
    show: state.basketballMix.showMode,
    mode: state.basketballMix.mode,
    page: state.basketball.page
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggle() {
      dispatch(toggleMode());
    },
    change(mode) {
      setHistoryState(mode);
      dispatch(changeMode(mode));
      dispatch(toggleMode());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BasketballPageMode);
