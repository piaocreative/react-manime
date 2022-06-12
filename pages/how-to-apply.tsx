import { builder } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import HowToApplyBanner from 'components/howto/apply/HowToApplyBanner';
import HowToApplyFixedHeader from 'components/howto/apply/HowToApplyFixedHeader';
import HowToApplyIGSection from 'components/howto/apply/HowToApplyIGSection';
import HowToApplyRedirectBanners from 'components/howto/apply/HowToApplyRedirectBanners';
import HowToApplyVideoList from 'components/howto/apply/HowToApplyVideoList';
import HowToFAQSection from 'components/howto/apply/HowToFAQSection';
import HowToRemoveSection from 'components/howto/apply/HowToRemoveSection';
import LoadingAnimation from 'components/LoadingAnimation';
import StandardBuilderPage from 'components/StandardBuilderPage';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import React, { createRef, useEffect, useState } from 'react';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { getDimensions, scrollTo } from 'utils/scroll';

builder.init(BUILDER_API_KEY);

const HowToPage = props => {
  const { loading, isMobileView } = props;
  const pageInfo = JSON.parse(props.pageInfo || null);

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const ref0 = createRef();
  const ref1 = createRef();
  const ref2 = createRef();
  const ref3 = createRef();
  const ref4 = createRef();
  const ref5 = createRef();

  const sectionRefs = [
    { ref: ref0, sectionIndex: 0 },
    { ref: ref1, sectionIndex: 1 },
    { ref: ref2, sectionIndex: 2 },
    { ref: ref3, sectionIndex: 3 },
    { ref: ref4, sectionIndex: 4 },
    { ref: ref5, sectionIndex: 5 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const { offsetTop: headerHeight } = getDimensions(sectionRefs[0].ref.current);
      const scrollPosition = window.scrollY + headerHeight;

      const selected = sectionRefs.find(({ ref, sectionIndex }) => {
        const ele = ref.current;
        if (ele) {
          const { offsetBottom, offsetTop } = getDimensions(ele);
          return scrollPosition > offsetTop && scrollPosition < offsetBottom;
        }
      });

      if (selected && selected.sectionIndex !== activeSectionIndex) {
        setActiveSectionIndex(selected.sectionIndex);
      } else if (!selected && activeSectionIndex >= sectionRefs.length - 1) {
        setActiveSectionIndex(sectionRefs.length - 1);
      } else if (!selected) {
        setActiveSectionIndex(-1);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSectionIndex]);

  const moveToSectionHandler = index => () => {
    try {
      if (index >= 0) scrollTo(sectionRefs[index].ref.current, 'center');
    } catch (err) {
      log.warn(err);
    }
  };

  return (
    <StandardBuilderPage pageInfo={pageInfo}>
      {loading ? (
        <LoadingAnimation isLoading={loading} size={200} height="50vh" />
      ) : (
        <>
          <HowToApplyBanner />
          <HowToApplyFixedHeader
            activeSectionIndex={activeSectionIndex}
            moveToSectionHandler={moveToSectionHandler}
          />
          <HowToApplyVideoList
            sectionRefs={sectionRefs}
            setActiveSectionIndex={setActiveSectionIndex}
          />
          <HowToApplyIGSection />
          <HowToRemoveSection ref={ref5} />
          <HowToFAQSection isLanding={false} />
          <HowToApplyRedirectBanners />
        </>
      )}
    </StandardBuilderPage>
  );
};

export const getStaticProps = async ({ req, res }) => {
  const url = pageLinks.HowToApply.url;
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
      url,
    },
  });
  return props;
};

export default ManimeStandardContainer(HowToPage);
