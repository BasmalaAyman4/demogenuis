// types/cart.ts
export interface CartItem {
    userId: number;
    itemCode: string;
    itemColor: number;
    itemSize: number 
    quantity: number;
    price: number;
}

export interface AddToCartParams {
    itemCode: string;
    itemColor: number;
    itemSize: number | undefined;
    quantity?: number;
    price: number;
}

export interface CartResponse {
    success: boolean;
    data?: any;
    message?: string;
    error?: string;
}