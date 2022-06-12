import React, { Component, useState } from 'react';

import styled from 'styled-components';
import Box from './styled/Box';
import ReactImageMagnify from 'react-image-magnify';
import LoadingAnimation from './LoadingAnimation'
import StandardButton from './styled/StandardButton';
import log from '../utils/logging'
import { Markup } from 'interweave';

import { Product } from '../types'

const Container = styled(Box)`
  display: flex;
  flex-wrap: wrap;

  background: white;
  @media (min-width: 768px) {
    padding: 20px;
    padding-bottom: 0;
  }
`;

const BackButton = styled.div`
  margin-top: 12px;
  cursor: pointer;
  width: 100px;
  font-size: 12px;
  text-align: center;
  margin-left: -12px;
  @media (min-width: 768px) {
    margin-left: auto;
    margin-right: auto;
    padding-right: 20px;
  }
`;

const Gallery = styled(Box)`
  width: 100%;
  @media (min-width: 768px) {
    width: 20%;
  }
`;

const Gallery2 = styled(Box)`
  width: 100%;
  display: block;
  @media (min-width: 768px) {
    display: none;
  }
`;

const GalleryBox = styled(Box)`
  width: 100%;
  overflow: auto;
  display: ${props => props.mobileOnly ? 'flex' : 'none'};
  // display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 16px;
  flex-direction: row;
  @media (min-width: 768px) {
    flex-direction: column;
    justify-content: center;
    display: flex; //${props => props.mobile ? 'none' : 'flex'};
  }
`;

const ProductImage = styled(Box)`
  position: relative;
  width: 100%;
  padding: 16px;
  &>img {
    object-fit: cover;
    height: auto;
  }
  @media (min-width: 768px) {
    width: 40%
  }
`;

const ProductInfo = styled(Box)`
  width: 100%;
  padding: 20px 10px;
  @media (min-width: 768px) {
    width: 40%;
    padding: 20px 40px;
  }
`;

const SmallImg = styled.img`
  display: ${props => props.hide ? 'none' : 'flex'};
  width: 48px;
  height: 60px;
  margin: 10px 10px 10px 0;
  object-fit: cover;
  cursor: pointer;
  opacity: ${props => props.opacity ? props.opacity : 1};
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
  @media (min-width: 768px) {
    width: 70px;
    height: 90px;

  }
`;

const TitleBox = styled(Box)`
  font-family: AvenirLight;
  font-size: 23px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 3.23;
  letter-spacing: 3.83px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
  padding-bottom: 10px;
  height: 195px;
  margin-bottom: -100px;
  background-color: #f3f1ea;
  padding-top: 30px;
  text-transform: uppercase;
`

const DescriptionBox = styled(Box)`
  font-family: AvenirNext;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: italic;
  line-height: normal;
  letter-spacing: 0.97px;
  text-align: center;
  color: #2c4349;
`

const SubtitleBox = styled(Box)` 
  font-family: Avenir-Heavy;
  font-size: 12px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: 4px;
  text-align: center;
  color: #2c4349;
  padding-bottom: 10px;
`

const TypeBox = styled(Box)` 
  color: #f7bfa0;
  font-family: Avenir;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.67;
  letter-spacing: 4px;
  padding-bottom: 10px;
  text-transform: uppercase; 

`

export default function ProductDetail({ productInfo, isShowing, ...props }: { productInfo: Product, isShowing: boolean, props?: any }) {


  log.verbose("rendering product detail breif", productInfo)

    const productImages = productInfo.images || [];
    const [hiddenImages, setHiddenImages] = useState([])
    const [selectedImage, setSelectedImage] = useState<number>(0)
    const isMobileView =  window.innerWidth < 768
    const mobileImageQuery = '?width=600&quality=70';
    const loading = false;
    const imageQuery = isMobileView ? mobileImageQuery: '';

    function hideImage(index) {
      hiddenImages.push[index]
        const temp = [...hiddenImages]
        setHiddenImages(temp)
    }

    function productImageChangeHandler(index){
        const selectedImageIndex  = selectedImage;
        if (selectedImageIndex !== index) {
            setSelectedImage(index );
        }
    }


        return (
            <Container >
                <TitleBox>
                  {productInfo.name}
                </TitleBox>
                <Gallery>

                    <GalleryBox>
                        {productImages.map((each, index) => (
                            <SmallImg
                                hide={hiddenImages.includes(index)}
                                onError={err => hideImage(index)}
                                key={`smallImg${index}`} src={`${each}${imageQuery}`}
                                opacity={index === selectedImage ? 1 : 0.3}
                                alt='nail-product'
                                onClick={() => productImageChangeHandler(index)} />
                        ))}
                    </GalleryBox>
                </Gallery>

                <ProductImage>
                    {!loading && Array.isArray(productImages) && productImages.length > selectedImage && productImages[selectedImage] && productImages[selectedImage] &&
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: productInfo.title,
                                isFluidWidth: true,
                                src: productImages[selectedImage],
                            },
                            largeImage: {
                                src: productImages[selectedImage],
                                width: 1800,
                                height: 1800
                            },
                        }}
                            style={{ zIndex: 1 }} />
                    }
                </ProductImage>

                <Gallery2>
                    <GalleryBox mobileOnly={true}>
                        {productImages.map((each, index) => {
                            // TODO: show all later
                            const src = each || '';
                            return (
                                <SmallImg
                                    hide={hiddenImages.includes(index)}
                                    onError={err => hideImage(index)}
                                    key={`key${index}`} src={`${src}${imageQuery}`}
                                    opacity={index === selectedImage ? 1 : 0.3}
                                    onClick={() => productImageChangeHandler(index)} />)
                        })}
                    </GalleryBox>
                </Gallery2>
                {loading && <LoadingAnimation isLoading={loading} size={200} height='50vh' background='transparent' />}
                <ProductInfo>
                    {!loading &&
                        <Box style={{display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                            <TypeBox>
                              {productInfo.subtitle}
                            </TypeBox>


                            <Box>
                              <Markup content={productInfo.description}  />

                            </Box>

                        </Box>
                    }
                </ProductInfo>
            </Container>
        )
    }