import React from 'react';
import { connect } from 'react-redux';
import style from './css/glowup-banner.module.css';
import { UI_SET_KEY_VALUE } from '../../actions';

type PropsType = {
  dispatchSetUIKeyValue: Function
}

const GlowUpBanner = ({ dispatchSetUIKeyValue }: PropsType) => {
  const joinWaitListHandler = () => {
    dispatchSetUIKeyValue('joinWaitList', {productId: '', open: true});
  };

  return (
    <div className={style.container} onClick={joinWaitListHandler}>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  dispatchSetUIKeyValue: (key, value) => dispatch(UI_SET_KEY_VALUE(key, value)),
});

export default connect(
  null,
  mapDispatchToProps
)(GlowUpBanner);
