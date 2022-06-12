import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Product, KeyValue } from '../types'
import { getNailProducts } from 'api/product'

import { SET_PRODUCTS_DATA, SET_PRODUCTS_MAP, } from '../actions';
import log from '../utils/logging'
type GetProductResult = {
    isLoading: boolean,
    error: any,
    result: KeyValue<Product>,
}

export default function useGetAllNailProductsMap(): GetProductResult {


    const productsMap: KeyValue<Product> = useSelector((state : any) => state.productsData.productsMap)
    const dispatch = useDispatch();

    const [state, setState] = useState({
        isLoading: false,
        error: undefined
    })

    async function loadProductData() {
        let nailProducts: Product[] = undefined
        setState({ error: undefined, isLoading: true })

        try {
            nailProducts = await getNailProducts();
            let products: Product[] = nailProducts;
            const map: KeyValue<Product> = {}
            nailProducts.forEach(entry => {
                map[entry.variantId] = entry
            })


            dispatch(SET_PRODUCTS_MAP(map))
            dispatch(SET_PRODUCTS_DATA(nailProducts))
            setState({ isLoading: true, error: null })
        } catch (err) {
            log.error(
                '[useGetAllNailProductsMap][loadProdcutData] ' + err,
                {

                        err,
 
                },
            );
            setState({ isLoading: false, error: err })
        }


    }
    useEffect(() => {
        if (Object.entries(productsMap).length === 0 && !state.isLoading) {
            loadProductData()
            log.verbose("loading product data", { productsMap, isLoading: state.isLoading })
        } else {
            log.verbose('product data changed, but should get automatically reloaded')
        }
    }, [])


    return { isLoading: state.isLoading, error: state.error, result: productsMap }
}