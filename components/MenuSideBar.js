import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Sidebar from 'react-sidebar';
import Box from './styled/Box';
import MenuContent from './MenuContent';

import { SET_MENU_SIDEBAR } from '../actions';


const styles = {
  sidebar: {
    background: 'white',
    zIndex: 200,
    width: 'calc(100% - 40px)',
    height: 'calc(var(--vh, 1vh) * 100)',
    maxWidth: '340px',
    position: 'fixed',
    minHeight: '-webkit-fill-available'
  },
  overlay: {
    zIndex: 150
  }
}

const MenuSideBar = props => {
  useEffect(() => {
    props.dispatchSetMenuSideBar(false);
  }, []);

  const onSetSidebarOpen = () => {
    props.dispatchSetMenuSideBar(false);
  }

  return (
    <Sidebar
      sidebar={<MenuContent globalProps={props.globalProps}/>}
      open={props.isMenuOpen}
      onSetOpen={onSetSidebarOpen}
      styles={styles}
      dragToggleDistance={40}
      pullRight
      shadow >
      <Box />
    </Sidebar>
  );
}

const mapStateToProps = (state) => ({
  isMenuOpen: state.uiData.isMenuOpen,
  userData: state.userData
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetMenuSideBar: isOpen => dispatch(SET_MENU_SIDEBAR(isOpen))
});


export default connect(mapStateToProps, mapDispatchToProps)(MenuSideBar);
