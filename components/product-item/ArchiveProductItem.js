import { OutlinedDarkButton } from 'components/basic/buttons';
import useGetNailProducts from 'hooks/useGetNailProducts';
import Link from 'next/link';
import React, { useState } from 'react';
import style from 'static/components/design/archive-product-item.module.css';
import { pageLinks } from 'utils/links';
import RequestProductPanel from './RequestProductPanel';

const productHandle = ({ products, productId }) => {
  const product = products?.filter(p => p.nailProductId === productId);
  return product.length === 1 ? product[0].shopifyHandle : '';
};

const ArchiveProductItem = ({ productItemData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, error, result: products } = useGetNailProducts();

  const openRequestPanelHandler = () => setIsOpen(true);

  const closeHandler = () => setIsOpen(false);

  return (
    <div className={style.container}>
      <div className={style.dateBox}>{productItemData.releaseDateAsText}</div>
      <Link
        href={`${pageLinks.ProductDetail.url}${productHandle({
          products,
          productId: productItemData.nailProductId,
        })}`}
      >
        <a>
          <img
            className={style.archiveImage}
            src={productItemData.archivedImageUrl}
            alt="archived-products"
          />
        </a>
      </Link>
      <div className={style.productName}>{productItemData.name}</div>
      <div className={style.collectionTitle}>{productItemData.collectionTitle}</div>
      <div className={style.soldOut}>Sold Out</div>
      <OutlinedDarkButton
        data-testid="archived-product-cta"
        isSmall
        passedClass={style.actionButton}
        onClick={openRequestPanelHandler}
      >
        Bring It Back
      </OutlinedDarkButton>
      {isOpen && <RequestProductPanel productItemData={productItemData} onClose={closeHandler} />}
    </div>
  );
};

export default ArchiveProductItem;
