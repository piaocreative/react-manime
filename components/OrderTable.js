import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { connect } from 'react-redux';
import log from '../utils/logging'
import Box from './styled/Box';
import { StyledStandardButton, StandardOutlinedButton, StandardInput } from '../components/styled/StyledComponents';
import  LoadingAnimation from '../components/LoadingAnimation';
import { retrieveUsersWithEmail } from 'api/user';
import {getGroupOrders, getShopifyOrderByGroupOrderId,} from 'api/order'
;
import { pageLinks } from '../utils/links';

// get identity id , connect or pass
// get group orders from identity id
// use getShopifyOrderByGroupOrderId to get every shopify order for the list of group orders
// display associated information

const data = [
  {date: '06/02/2019', total: 50, status: '', details: ''},
  {date: '06/02/2019', total: 50, status: '', details: ''},
  {date: '06/02/2019', total: 50, status: '', details: ''},
  {date: '06/02/2019', total: 50, status: '', details: ''},
  {date: '06/02/2019', total: 50, status: '', details: ''},
];

const Container = styled(Box)`
  min-width: 100%;
  background: #fff;
  border: none;
  padding: 30px;
`;

const Row = styled(Box)`
  border-top: ${props => props.isHeader? 'none' : '1px solid #C0C0C0'};
  display: flex;
  width: 100%;
  height: 54px;
`;

const DetailRow = styled(Box)`
  border-top: ${props => props.isHeader? 'none' : '1px solid #C0C0C0'};
  display: flex;
  width: 100%;
`;

const Cell = styled(Box)`
  width: 25%;
  display: flex;
  align-items: center;
  min-width:120px;
  letter-spacing: 2px;
`;

const UnderlineLink = styled(Box)`
  font-family: avenirBook;
  font-size: 15px;
  text-decoration: underline;
  letter-spacing: 2px;
  cursor: pointer;
`;

class OrderTable extends React.Component {
  state = {
    data: [],
    line_items: [],
    sub_total_price: '',
    total_line_items_price: '',
    total_tax: '',
    shipping_lines: [],
    order: {},
    ordersLoading: true,
    selectedIndex: 0,
    showDetail: false,

    groupOrders: [],
  };

  componentDidMount() {
    // const identityId = (((this || {}).props || {}).userData || {}).identityId || '';
    // if (identityId && identityId != '')
    //   this.retrieveShopifyData(identityId);

    const email = (((this || {}).props || {}).userData || {}).email || '';
    if (email && email != '')
      this.retrieveShopifyData(email);
  }

  componentDidUpdate(prevProps) {
    // const identityId = (((this || {}).props || {}).userData || {}).identityId || '';
    // const prevIdentityId = ((prevProps || {}).userData || {}).identityId || '';
    // if (identityId && identityId != '' && prevIdentityId != identityId)
    //   this.retrieveShopifyData(identityId);

    const email = (((this || {}).props || {}).userData || {}).email || '';
    const prevEmail = ((prevProps || {}).userData || {}).email || '';
    if (email && email != '' && prevEmail != email)
      this.retrieveShopifyData(email);
  }

  retrieveShopifyData = async email => {
    let shopifyOrderArray = [];
    // first get group orders
    try {
      const users = await retrieveUsersWithEmail(email);
      log.info(users);

      let groupOrderPromises = [];
      users.map(async user => {
        const identityId = user.userId;
        groupOrderPromises.push(getGroupOrders(identityId));
      })

      let groupOrders = [];
      Promise.all(groupOrderPromises).then(groupOrdersArray => {
        log.verbose(groupOrdersArray);
        groupOrdersArray.map(groupOrderArray => {
          groupOrders = [...groupOrders, ...groupOrderArray];
          const groupOrdersMapShopify = new Array(groupOrders.length);

          this.setState({
            groupOrders,
            groupOrdersMapShopify,
            ordersLoading: false
          })
        })
      })

    } catch (err) {
      log.error('[OrderTable][retrieveShopifyData] ' + err, {
        email, err
      });
    }
  }


  showDetail = async (groupOrderId, index) => {
    const groupOrder = await getShopifyOrderByGroupOrderId(groupOrderId);

    let groupOrdersMapShopify = [...this.state.groupOrdersMapShopify];
    groupOrdersMapShopify[index] = groupOrder.order;

    this.setState({
      showDetail: !this.state.showDetail,
      selectedIndex: index,
      groupOrdersMapShopify
    })
  }

  onClick = e => {
    this.setState({ showDetail: false });
  }

  render () {

    // const order = this.state.order || {};
    // const {
    //   line_items,
    //   sub_total_price,
    //   total_line_items_price,
    //   total_tax,
    //   shipping_lines,
    //   order_status_url,
    // } = order;
    // const shipping_line_cost = Array.isArray(shipping_lines) && shipping_lines.length > 0 ? shipping_lines[0].price : '0.00';
    const ordersLoading = this.state.ordersLoading;

    // log.info(order);
    return (
      <>
      {ordersLoading ?
        <LoadingAnimation isLoading={ordersLoading} />
       :
       <Container >
        <Row isHeader>
          <Cell>DATE</Cell>
          <Cell>TOTAL</Cell>
          <Cell>STATUS</Cell>
          <Cell>DETAILS</Cell>
          <Cell>REVIEW FIT</Cell>
        </Row>
        {this.state.groupOrders.map((groupOrder, index) => {
          const groupOrderId = groupOrder.groupOrderId;
          if (!groupOrderId) return;

          // const order = item.order;
          // if (!order) return;
          let date = '';
          try {
            let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            date = new Date(groupOrder.dateCreated.toString());
            let day = date.getDate();
            let monthIndex = date.getMonth();
            let year = date.getFullYear();
            date = monthNames[monthIndex] + ' ' + day + ' ' + year;
            // log.info(groupOrder.dateCreated);
            // log.info(1, date);
          } catch (err) {
            log.error(`[OrderTable][map in render] ${err}`, { err });
          }

          // group order data
          const shopifyTrackingUrl = groupOrder.shopifyTrackingUrl;//Array.isArray(order.fulfillments) && order.fulfillments.length > 0 ? order.fulfillments[0].tracking_url : null;
          const shopifyOrderStatusUrl = groupOrder.shopifyOrderStatusUrl;
          const shopifyTotalPrice = groupOrder.shopifyTotalPrice || '';




          let line_items = [];
          const groupOrdersMapShopify = this.state.groupOrdersMapShopify;
          if (groupOrdersMapShopify && typeof groupOrdersMapShopify[index] !== 'undefined')
            line_items = this.state.groupOrdersMapShopify[index].line_items;
          return (
            <>
              <Row key={index}>
                <Cell>{date}</Cell>
                <Cell letterSpacing='2px'>${shopifyTotalPrice}</Cell>
                <Cell>
                  { shopifyTrackingUrl ?
                    <UnderlineLink><a href={shopifyTrackingUrl}>Track Status</a></UnderlineLink>
                    :
                    <div>Not shipped</div>
                  }
                </Cell>
                <Cell>
                  <UnderlineLink><a onClick={() => this.showDetail(groupOrderId, index)}>{this.state.selectedIndex === index && this.state.showDetail ? "Hide Details" : "Show Details"}</a></UnderlineLink>
                </Cell>
                <Cell>
                  <Link href={`${pageLinks.Refit.url}?groupOrderId=${groupOrderId}`}>
                    <StyledStandardButton>Review</StyledStandardButton>
                  </Link>
                </Cell>
              </Row>
              {this.state.showDetail && index === this.state.selectedIndex &&
              <Box width='100%' height='100%' bg='#FCF9F7' alignItems='center' onClick={this.onClick} style={{ pointerEvents: 'all' }}>
                <Box mt={2} mb={2} width='50%' textAlign="left" pl={3}>Order Summary</Box>

                {
                  line_items && Array.isArray(line_items) && line_items.map(line_item => (
                    <Box pt={3} display='flex' flexDirection='column'>
                      <Box pl={4} display='flex' flexDirection='row' justifyContent='space-between' width='50%'>
                        <Box>{line_item.title}</Box>
                        <Box display='flex' justifyContent='space-between'>
                          <Box>${line_item.price} x{line_item.quantity}</Box>
                        </Box>
                      </Box>
                    </Box>
                  ))
                }
                <Box mt={3} mb={2} width='50%' textAlign="left" pl={4}><a href={shopifyOrderStatusUrl}>More details</a></Box>
              </Box>}
            </>
          );

        })}
        {this.state.groupOrders.length === 0 && <>
          You have not placed any order yet
        </>}
      </Container>}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  userData: state.userData
})

export default connect(
  mapStateToProps,
  null
)(OrderTable);
