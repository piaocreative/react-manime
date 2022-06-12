import React from 'react'
import { isHiddenTitle } from "utils/cartUtils"
import LineItem from 'components/LineItem'
import style from '@styles/checkout/order-summary.module.css';

type Props = {
  edges: any,
  giftProduct?: any,
  title?: string,
  subtotalPrice?: number,
}
export default function BagSummary(props:Props){
  let line_items = props.edges && Array.isArray(props.edges) ?
  props.edges.map((line_item) => {
    if (isHiddenTitle(line_item.node.title))
      return;
    return (
      <LineItem
        notEditable
        key={line_item.node.id.toString()}
        line_item={line_item.node}
      />
    );
  })
  :
  null;
  return (
    <div className={style.root}>
    <div className={style.titleLine}>
      <div>{props.title || 'Bag Summary'}</div>
    </div>
    {props.giftProduct &&
      <LineItem
        notEditable
        freeItem
        key='topCoat2'
        line_item={props.giftProduct}
      />
    }
    {line_items}
  </div>
  )
}

