// types/product.ts
interface Size {
    id: number;
    name: string;
}
export interface ProductColor {
    itemColor: number;
    colorName: string;
    colorHex: string;
    images: string[];
    sizesCode: Size[];
}

export interface Product {
    id: string;
    itemCode: string;
    barCode: string | null;
    itemName: string;
    itemDesc: string;
    itemNameA: string;
    itemNameE: string;
    searchA: string;
    searchE: string;
    categoryCode: number;
    subCategoryCode: number;
    originalPrice: number;
    discount: number;
    price: number;
    mainPic: string;
    mainPicAltText: string | null;
    twoImages: string[];
    productRate: number;
    isFavorite: boolean;
    isWishList: boolean | null;
    hasDeal: boolean;
    dealPrice: number;
    quantity: number;
    isHotColor: boolean;
    createdDate: string;
    colors: ProductColor[];
}

export interface ProductsResponse {
    data: Product[];
    success: boolean;
}