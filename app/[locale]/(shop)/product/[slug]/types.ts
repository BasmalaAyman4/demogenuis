// app/[locale]/(shop)/product/[slug]/types.ts

export interface ProductImage {
  productPic: string;
  picAltText: string | null;
  isDefualtPic: boolean | null;
}

export interface ColorVariant {
  itemCode: string;
  itemColor: number;
  colorName: string;
  colorHex: string;
  itemSize: number;
  sizeName: string;
  itemBarCode: string;
  quantity: number;
  discount: number;
  price: number;
  productPic: string[];
  isHotColor: boolean;
  imageWithAlts: ProductImage[];
  productVedio: string[];
}

export interface ProductData {
  itemCode: string;
  barCode: string;
  itemName: string;
  itemColor: number;
  itemSize: number;
  categoryId: number;
  categoryName: string;
  itemPayedCount: number;
  originalPrice: number;
  discount: number;
  price: number;
  createdDate: string;
  mainPic: string;
  mainPicAltText: string;
  productRate: number;
  isFavorite: boolean | null;
  isWishList: boolean | null;
  sizeChartPic: string;
  sizeChart: any[];
  hasDeal: boolean;
  dealPrice: number;
  itemDesc: string;
  watchedNow: number;
  watchedDesc: string;
  itemAlt: string;
  itemUrl: string;
  reacentlyAddedDetails: ColorVariant[];
}

export interface Color {
  id: number;
  name: string;
  hex: string;
  images: string[];
}

export interface Size {
  id: number;
  name: string;
}

export interface ProductSelection {
  color: number;
  size: number;
  quantity: number;
}