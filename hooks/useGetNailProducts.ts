import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getNailProducts } from 'api/product'
import { Product } from 'types'
import log from 'utils/logging'
import { SET_PRODUCTS_DATA, } from '../actions';
import { compareBySortOrderShopPage, sortByList } from '../utils/galleryUtils';

type GetProductResult = {
    isLoading: boolean,
    error: any,
    result: Product[],
}

/**
 * This is not a sorted list by category. For that please run the results of this through utils/galleryUtils.getProducts
 */

export default function useGetNailProducts(productFilter=undefined as any, 
    defaultSortOrder=compareBySortOrderShopPage): GetProductResult {

    const productsData: Product[] = useSelector((state : any) => {
        log.verbose("should see product data change")
        return state.productsData.products
    })
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const dispatch = useDispatch();

    const [state, setState] = useState({
        isLoading: false,
        error: undefined
    })

    useEffect(()=>{
        if(productsData?.length !== 0 ){
            if(productFilter){
                const filtered = productsData.filter(productFilter);
                filtered.sort(defaultSortOrder)
                setFilteredProducts([...filtered])
            } else {
                setFilteredProducts([...productsData])
            }
            log.verbose("loading product data", { productsData, isLoading:  state.isLoading })
        }else{
            log.verbose('product data changed, but should get automatically reloaded')
        }

    }, [productsData, productFilter])

    return { isLoading: state.isLoading, error: state.error, result: filteredProducts }
}