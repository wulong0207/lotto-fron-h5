import React, { PureComponent } from 'react';
import Modal from '../action/jjc/jcz/components/modal.jsx';

class Input extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      type: props.type
    }
  }

  change(value) {
    if (value === this.state.value) return undefined;
    this.setState({ value }, () => {
      this.props.onChange && this.props.onChange(value);
    });
  }

  handleChange(e) {
    this.change(e.target.value.trim());
  }

  clear() {
    this.change('');
  }

  render() {
    const { value, type } = this.state;
     return (
      <div className="login-input-component">
        <input value={ value } onChange={ this.handleChange.bind(this) } />
        <span className="clear" style={{ display: value.trim().length ? '' : 'none'}}>clear</span>
        {
          this.props.type === 'password' ?
            <span className="eye" style={{ display: value.trim().length ? '' : 'none'}}>
              {
                type === 'password' ?
                  <span>eye open</span>
                  :
                  <span>eye close</span>
              }
            </span>
            :
            ''
        }
      </div>
    )
  }
}

class LoginModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      password: ''
    }
  }

  render() {
    return (
      <Modal>
        <div className="login-model">
          <div className="login-inputs">
            <Input />
            <Input />
          </div>
        </div>
      </Modal>
    );
  }
}