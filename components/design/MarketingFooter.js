import Box from 'components/styled/Box';
import React, { useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';

const MarketingFooter = props => {
  const [isOpen, setIsOpen] = useState(false);
  const pageData = props.pageInfo?.pageData;
  const title = pageData?.marketingFooterTitle || props.title;
  const content = pageData?.marketingFooterTitle
    ? ReactHtmlParser(pageData?.marketingFooterTitle)
    : props.children;

  return title ? (
    <>
      <MarketingContentHeader
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span>{title}</span>
        <span
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <svg
            isopen={isOpen}
            height="20"
            width="20"
            className="icon icon--arrow-bottom"
            viewBox="0 0 12 8"
            role="presentation"
          >
            <path
              stroke="black"
              strokeWidth="2"
              d="M10 2L6 6 2 2"
              fill="none"
              strokeLinecap="square"
            ></path>
          </svg>
        </span>
      </MarketingContentHeader>
      <MarketingContentBox
        isopen={isOpen}
        style={{
          display: isOpen ? 'block' : 'none',
          height: isOpen ? 'auto' : '0px',
          padding: '12px 18px',
        }}
      >
        {content}
      </MarketingContentBox>
    </>
  ) : null;
};

const MarketingContentHeader = styled.h2`
  border-bottom: 1px solid #333333;
  margin: 1em;
  width: calc(100% - 2em);
  padding: 0 1em;
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
`;

const MarketingContentBox = styled(Box)`
  background-color: ${props => (props.bg ? props.bg : '#e1e1df')};
  // width: calc(100% - 2em);
  padding: 0 1em;
  // background-size: cover;
  // background-image: ${props =>
    props.mobileURL
      ? `url('${props.mobileURL}')`
      : `url('https://d1b527uqd0dzcu.cloudfront.net/web/design/design-intheair-desktop.jpg')`};
  // background-repeat: no-repeat;
  // margin-bottom: -30px;
  // background-position: 86% 0%;
  margin: 16px;
  @media (min-width: 768px) {
    // background-size: cover;
    // background-image: ${props =>
      props.desktopURL
        ? `url('${props.desktopURL}')`
        : `url('https://d1b527uqd0dzcu.cloudfront.net/web/design/design-intheair-desktop.jpg')`};
    // margin-bottom: -40px;
    // margin: 16px;
  }
`;

export default MarketingFooter;
