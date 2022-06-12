import { getReferralLink } from 'api/referral';
import { getGlobalProps } from 'components/core/hoc/PageWrapper';
import { PageContainer } from 'components/styled/StyledComponents';
import Router from 'next/router';
import { Component } from 'react';
import { connect } from 'react-redux';
import { pageLinks } from 'utils/links';
import { setItemToLocalStorage } from 'utils/localStorageHelpers';

/**
 * Simply pulls off the referral details and puts it into local storage then sends to sign in/sign up
 */
class Verify extends Component {
  async componentDidMount() {
    const url = new URL(window.location.href);
    const referralId = url.searchParams.get('referral');
    if (this.props.userData.isAuth) {
      Router.push(pageLinks.SetupDesign.url);
      return;
    }
    try {
      const result = await getReferralLink(referralId);
      if (typeof window !== 'undefined') {
        // setItemToLocalStorage('sourceId', result.sourceId);
        setItemToLocalStorage('referralId2', referralId);
        setItemToLocalStorage('promotionId', result.length && result[0].promotionId);
        setItemToLocalStorage('sourceId', result.length && result[0].sourceId);
      }

      Router.push(`${pageLinks.SignUp.url}`);
    } catch (err) {}
  }

  render() {
    return <PageContainer></PageContainer>;
  }
}

const mapStateToProps = state => ({
  userData: state.userData,
});

export const getStaticProps = async ({ res, req }) => await getGlobalProps();

export default connect(mapStateToProps)(Verify);
