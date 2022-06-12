import { getAllEntitlements, getSubscription } from 'api/subscription';
import LoadingAnimation from 'components/LoadingAnimation';
import Box from 'components/styled/Box';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { connect } from 'react-redux';
import style from 'static/components/EntitlementList.module.css';
import { externalLinks, pageLinks } from 'utils/links';

const byRedeemedAndDate = (ent1, ent2) =>
  ent1.redeemed === ent2.redeemed
    ? ent1.dateCreated < ent2.dateCreated
      ? 1
      : -1
    : ent1.redeemed < ent2.redeemed
    ? -1
    : 1;

const UnredeemableButton = () => <div className={style.unredeemableButton}>Redeemed</div>;

const RedeemButton = () => (
  <Link href={pageLinks.SubscriptionsRedemptionPick.url}>
    <a>
      <div className={style.redeemButton}>{pageLinks.SubscriptionsRedemptionPick.label}</div>
    </a>
  </Link>

  // <div className={style.redeemButton}>{pageLinks.SubscriptionsRedemptionPick.label}</div>
);

const EntitlementsHeader = () => (
  <div className={style.headerContainer}>
    <div className={style.headerField}>Date</div>
    <div className={style.headerField}>OrderStatus</div>
    <div className={style.headerField}>Order #</div>
    <div className={style.headerField}>Redemption Status</div>
  </div>
);

const EntitlementItem = ({ entitlement }) => {
  console.log({ at: 'EntitlementItem', entitlement });
  const result = {
    date: entitlement?.dateCreated?.slice(0, 10),
    orderStatus: entitlement?.GroupOrder?.shopifyCancelledAt
      ? 'Canceled'
      : entitlement?.GroupOrder?.shopifyFulfillmentStatus || 'N/A',
    orderNumber: entitlement?.GroupOrder?.shopifyOrderNumber || 'N/A',
    redemptionStatus: entitlement.redeemed ? <UnredeemableButton /> : <RedeemButton />,
  };
  return (
    <div className={style.itemContainer}>
      <div className={style.itemField}>{result.date}</div>
      <div className={style.itemField}>{result.orderStatus}</div>
      <div className={style.itemField}>{result.orderNumber}</div>
      <div className={style.itemField}>{result.redemptionStatus}</div>
    </div>
  );
};

const ManageSubscriptionLink = ({ userData }) =>
  userData.recurlyAuthToken ? (
    <Box
      style={{
        // textTransform: 'uppercase',
        fontSize: '10px',
        marginBottom: '4px',
      }}
    >
      Want to pause or cancel? Email <a href="mailto:care@manime.co">care@manime.co.</a>{' '}
      <Link href={`${externalLinks.SubscriptionManage.url}/${userData.recurlyAuthToken}`}>
        <a target="_blank" style={{ fontStyle: 'italic' }}>
          {/* {externalLinks.SubscriptionManage.label} */}
          (click here for billing information)
        </a>
      </Link>
    </Box>
  ) : null;

const EntitlementList = props => {
  const { userData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState({});
  const [entitlements, setEntitlements] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    async function fetchEntitlements(userId) {
      const result = await getAllEntitlements(userId, true);
      setEntitlements(result?.sort(byRedeemedAndDate));
    }
    async function fetchSubscription(userId) {
      const result = await getSubscription(userId);
      setSubscription(result);
    }

    let userid = userData.identityId;
    // userid = 'us-west-2:b93a25ee-69df-46ab-9215-4819f1637bb6';
    // userid = 'us-west-2:c0b39156-6646-4631-af19-b42038727f9a';
    // userid = 'us-west-2:b93a25ee-69df-46ab-9215-4819f1637bb6';

    fetchSubscription(userid);
    fetchEntitlements(userid);
  }, [userData]);

  const pageChangeHandler = ({ selected }) => setStartIndex(selected * pageSize);
  const totalPages = Math.ceil(entitlements?.length / pageSize);

  return (
    <>
      {isLoading && (
        <LoadingAnimation isLoading={isLoading} height="calc(100% - 88px)" background="#FFF9F7" />
      )}
      <div style={{ width: '100%', padding: '1em' }}>
        <ManageSubscriptionLink userData={userData} />
        <EntitlementsHeader />
        <div className={style.entitlementsList}>
          {entitlements?.slice(startIndex, startIndex + pageSize).map(entitlement => (
            <EntitlementItem key={entitlement.entitlementId} entitlement={entitlement} />
          ))}
          {entitlements?.length === 0 && (
            <div className={style.noEntitlements}>No Entitlements</div>
          )}
        </div>
        {totalPages > 1 && (
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            previousLabel="Prev"
            nextLabel="Next"
            onPageChange={pageChangeHandler}
            disableInitialCallback={true}
            containerClassName={style.paginationContainer}
            pageClassName={style.paginationPage}
            pageLinkClassName={style.paginationPageLink}
            previousClassName={style.paginationPrev}
            previousLinkClassName={style.paginationPrevLink}
            nextClassName={style.paginationNext}
            nextLinkClassName={style.paginationNextLink}
            activeClassName={style.paginationActivePage}
            activeLinkClassName={style.paginationActivePageLink}
            disabledClassName={style.paginationDisabled}
          />
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state, ownProps) => ({
  userData: state.userData,
});

export default connect(mapStateToProps, null)(EntitlementList);
