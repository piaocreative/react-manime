import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Sidebar from 'react-sidebar';
import Box from './styled/Box';
import CartContent from './CartContent';
import { SET_CART_SIDEBAR } from '../actions';

const styles = {
  sidebar: {
    background: 'white',
    zIndex: 200,
    width: 'calc(100% - 40px)',
    maxWidth: '400px',
    position: 'fixed',
    minHeight: '-webkit-fill-available'
  },
  overlay: {
    zIndex: 150
  }
}

const CartSideBar = props => {
  useEffect(() => {
    props.dispatchSetCartSideBar(false);
  }, []);

  const onSetSidebarOpen = open => {
    props.dispatchSetCartSideBar(open);
  }

  return (
    <Sidebar
      sidebar={<CartContent />}
      open={props.isCartOpen}
      onSetOpen={() => onSetSidebarOpen(false)}
      styles={styles}
      dragToggleDistance={40}
      pullRight
      shadow >
      <Box />
    </Sidebar>
  );
}

const mapStateToProps = (state) => ({
  isCartOpen: state.uiData.isCartOpen,
  userData: state.userData
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetCartSideBar: isOpen => dispatch(SET_CART_SIDEBAR(isOpen))
});


export default connect(mapStateToProps, mapDispatchToProps)(CartSideBar);
