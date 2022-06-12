import { builder, BuilderComponent } from '@builder.io/react';
import PageWrapper, {
  ManimeStandardContainer,
  getGlobalProps,
} from 'components/core/hoc/PageWrapper';
import React, { useState, useEffect } from 'react';
import BottomCart from 'components/gift/group/bottom-cart/BottomCart';
import AuthWallHOC from 'components/AuthWallHOC';
import { createCart, GROUPGIFT_CART } from 'api/cart';
import { useSelector } from 'react-redux';
import { getStore } from 'lib/redux';
import { SetCart, AvailableCarts } from 'actions/cart';
import log from 'utils/logging';
import { Case, Switch } from 'components/switch';
import { StepSequence } from 'types';
import { scrollToTop } from 'utils/scroll';
import ShopBody from 'components/core/gallery/ShopBody';
import { withRouter } from 'next/router';
import NavBar from 'components/core/gallery/NavBar';
import StepsHeader from 'components/gift/group/StepsHeader';
import Members from 'components/gift/group/members/Members';
import Message from 'components/gift/group/Message';
import Payment from 'components/gift/group/payment/Payment';
import Confirmation from 'components/gift/group/Confirmation';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import { track, FlowLabels } from 'utils/track';
import style from '@styles/gift/group/styles.module.css';
import { calculateGroupGiftTotals } from 'api/order';
import { getProductCounts } from 'utils/cartUtils';
import { pageLinks } from 'utils/links';

builder.init(BUILDER_API_KEY);

type RecipientInput = {
  fullName: string;
  email: string;
  isSelf: boolean;
};

export enum StepEnum {
  WELCOME = 'welcome',
  SHOP = 'shop',
  GUESTS = 'guests',
  MESSAGE = 'message',
  PAYMENT = 'payment',
  SUCCESS = 'congratulations',
  ERROR = 'error',
}

type GroupGiftSequence = StepSequence & {
  action: Function;
  label: string;
};
const GroupGiftSequence: StepSequence = {
  start: StepEnum.SHOP,
  steps: {
    [StepEnum.SHOP]: {
      next: StepEnum.GUESTS,
      meta: {},
    },
    [StepEnum.GUESTS]: {
      previous: StepEnum.SHOP,
      next: StepEnum.MESSAGE,
      meta: {},
    },
    [StepEnum.MESSAGE]: {
      previous: StepEnum.GUESTS,
      next: StepEnum.PAYMENT,
      meta: {},
    },
    [StepEnum.PAYMENT]: {
      previous: StepEnum.MESSAGE,
      next: StepEnum.SUCCESS,
      meta: {},
    },
    [StepEnum.SUCCESS]: {
      previous: StepEnum.PAYMENT,
      meta: {},
    },
    [StepEnum.ERROR]: {
      previous: StepEnum.PAYMENT,
      meta: {},
    },
  },
  meta: {},
};

type Props = {
  router: any;
  globalProps: any;
  pageInfo: any;
};

const Instructions = () => (
  <div className={`${style.galleryRow} ${style.galleryHeader}`}>
    Fill the gift kit with your favorite products. <br />
    <span className={style.smallHeader}>Each recipient will receive 1 gift kit</span>
  </div>
);

function _track(message, data?) {
  track(`${FlowLabels.GroupGiftBuy}${message}`, data);
}

function GroupGiftPage(props: Props) {
  const [currentStep, setCurrentStep] = useState('');

  const store = getStore();
  const userData = useSelector((state: any) => state.userData);
  const groupGiftCartData = useSelector((state: any) => state[AvailableCarts.GroupGiftCart]);
  const [orderTotals, setOrderTotals] = useState<any>();

  const [isMounted, setIsMounted] = useState(false);

  const [recipients, setRecipients] = useState<RecipientInput[]>([]);
  const [message, setMessage] = useState<string>();
  const step = props.router.query?.step?.[0] || StepEnum.SHOP;

  const selfRecipient: RecipientInput = {
    fullName: `${userData?.name?.firstName} ${userData?.name?.lastName}`,
    email: userData?.email,
    isSelf: true,
  };

  async function mount() {
    if (!groupGiftCartData || !userData.isReady || isMounted) {
      return;
    }
    setIsMounted(true);

    track(`[mount]`);
    setRecipients([selfRecipient]);

    const root = props.router.route.substring(0, props.router.route.lastIndexOf('/'));
    let start = GroupGiftSequence.start;
    if (step === StepEnum.SHOP) {
      start = step;
    }
    props.router.replace(
      {
        pathname: `${root}/${start}`,
      },
      {
        pathname: `${root}/${start}`,
      },
      { shallow: true }
    );
    let _groupGiftCart = groupGiftCartData.cart;
    if (!groupGiftCartData.isReady) {
      _groupGiftCart = await createCart({
        firstName: userData?.name?.firstName,
        lastName: userData?.name?.lastName,
        email: userData?.email,
        baseCart: GROUPGIFT_CART,
      });

      //   const result = await updateUserColumn(mainCartData.userId, "description", _groupGiftCart.id)
      store.dispatch(SetCart(_groupGiftCart, AvailableCarts.GroupGiftCart));
    }

    const _totals = await calculateGroupGiftTotals(_groupGiftCart, 1);
    setOrderTotals(_totals);
  }

  async function refreshOrderTotal() {
    try {
      const _totals = await calculateGroupGiftTotals(groupGiftCartData?.cart, recipients.length);
      setOrderTotals(_totals);
    } catch (err) {
      log.error(`[group][[...step]][refreshOrderTotal]  caught error ${err}`, { err });
    }
  }

  useEffect(() => {
    refreshOrderTotal();
  }, [groupGiftCartData?.cart?.subtotalPrice, recipients.length]);

  useEffect(() => {
    mount();
  }, [userData, groupGiftCartData]);

  useEffect(() => {}, [groupGiftCartData]);

  useEffect(() => {
    if (currentStep !== step) {
      setCurrentStep(step);
    }
  }, [step]);

  async function onShopClickNext() {
    if (getProductCounts(groupGiftCartData.cart) == 0) {
      return;
    }
    scrollToTop();

    setTimeout(() => {
      const root = props.router.route.substring(0, props.router.route.lastIndexOf('/'));
      props.router.push(
        {
          pathname: `${root}/${GroupGiftSequence.steps[StepEnum.SHOP].next}`,
        },
        {
          pathname: `${root}/${GroupGiftSequence.steps[StepEnum.SHOP].next}`,
        }
      );
    }, 100);

    const _totals = await calculateGroupGiftTotals(groupGiftCartData.cart, recipients.length);
    setOrderTotals(_totals);
  }

  async function onMembersNext() {
    if (recipients.length == 0) {
      return;
    }
    scrollToTop();

    const root = props.router.route.substring(0, props.router.route.lastIndexOf('/'));
    props.router.push(
      {
        pathname: `${root}/${GroupGiftSequence.steps[StepEnum.GUESTS].next}`,
      },
      {
        pathname: `${root}/${GroupGiftSequence.steps[StepEnum.GUESTS].next}`,
      }
    );

    const _totals = await calculateGroupGiftTotals(groupGiftCartData.cart, recipients.length);
    setOrderTotals(_totals);
  }

  function onMessageClickNext() {
    scrollToTop();
    const root = props.router.route.substring(0, props.router.route.lastIndexOf('/'));
    props.router.push(
      {
        pathname: `${root}/${GroupGiftSequence.steps[StepEnum.MESSAGE].next}`,
      },
      {
        pathname: `${root}/${GroupGiftSequence.steps[StepEnum.MESSAGE].next}`,
      },
      { shallow: true }
    );
  }

  function placeOrder() {
    scrollToTop();
    const root = props.router.route.substring(0, props.router.route.lastIndexOf('/'));
    props.router.push(
      {
        pathname: `${root}/${StepEnum.SUCCESS}`,
      },
      {
        pathname: `${root}/${StepEnum.SUCCESS}`,
      },
      { shallow: true }
    );
  }

  GroupGiftSequence.steps[StepEnum.SHOP].meta.action = onShopClickNext;
  GroupGiftSequence.steps[StepEnum.SHOP].meta.label = 'Next';
  GroupGiftSequence.steps[StepEnum.GUESTS].meta.action = onMembersNext;
  GroupGiftSequence.steps[StepEnum.GUESTS].meta.label = 'Continue';
  GroupGiftSequence.steps[StepEnum.MESSAGE].meta.action = onMessageClickNext;
  GroupGiftSequence.steps[StepEnum.MESSAGE].meta.label = 'Continue';

  const bottomCartJsx = (
    <BottomCart
      onShopClickNext={GroupGiftSequence.steps[currentStep]?.meta.action}
      step={currentStep}
      label={GroupGiftSequence.steps[currentStep]?.meta.label}
      cartName={AvailableCarts.GroupGiftCart}
    />
  );

  return (
    <div className={style.groupGiftContainer}>
      <BuilderComponent model="page" content={props.pageInfo} />
      <NavBar navTitle={'ManiMe Friends Gift Kit'} />

      <Switch active={currentStep} isMounted={isMounted}>
        <Case name={StepEnum.SHOP}>
          <div style={{ marginTop: '50px' }}>
            <StepsHeader step={currentStep} />
            <Instructions />
            <ShopBody
              menuBaseUrl={pageLinks.GroupGiftShop.url}
              cartName={AvailableCarts.GroupGiftCart}
              addCtaLabel={'Add To Gift'}
              productFilter={product => !product.tags || !product.tags.includes('Not Shop All')}
            />
            {bottomCartJsx}
          </div>
        </Case>
        <Case name={StepEnum.GUESTS}>
          <StepsHeader step={currentStep} />
          <Members
            track={_track}
            selfRecipient={selfRecipient}
            recipients={recipients}
            setRecipients={setRecipients}
            orderTotals={orderTotals}
            setOrderTotals={setOrderTotals}
          />
          {/* </div> */}
          {bottomCartJsx}
        </Case>
        <Case name={StepEnum.MESSAGE}>
          <StepsHeader step={currentStep} />
          <Message
            message={message}
            setMessage={setMessage}
            orderTotals={orderTotals}
            recipients={recipients}
          />
          {bottomCartJsx}
        </Case>
        <Case name={StepEnum.PAYMENT}>
          <StepsHeader step={currentStep} />
          <Payment
            placeOrderCallback={placeOrder}
            recipients={recipients}
            message={message}
            userData={userData}
            groupGiftCart={groupGiftCartData.cart}
            orderTotals={orderTotals}
            refreshOrderTotal={refreshOrderTotal}
            track={_track}
          />
        </Case>
        <Case name={StepEnum.SUCCESS}>
          <Confirmation
            userData={userData}
            recipients={recipients}
            message={message}
            groupGiftCart={groupGiftCartData.cart}
            orderTotals={orderTotals}
            track={_track}
          />
        </Case>
      </Switch>
    </div>
  );
}

export default ManimeStandardContainer(AuthWallHOC(withRouter(GroupGiftPage)), true);

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

// export const getStaticProps = async (props) => await getGlobalProps();
export const getStaticProps = async ctx => {
  const url = '/gift/group/steps';
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  try {
    const globalProps = await getGlobalProps({
      propsToMerge: { url, pageInfo: pageInfo || null },
    });
    return globalProps;
  } catch (err) {
    log.error(url, err);
    return {
      notFound: true,
    };
  }
};
