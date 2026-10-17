

// hooks/useFlyToCart.ts
'use client';

import { useCallback } from 'react';

interface FlyToCartOptions {
    onComplete?: () => void;
    duration?: number;
}

export function useFlyToCart() {
    const flyToCart = useCallback((
        imageElement: HTMLElement | null, // Changed to accept any HTMLElement
        options: FlyToCartOptions = {}
    ) => {
        if (!imageElement) {
            console.warn('No image element provided for fly animation');
            return;
        }

        const { onComplete, duration = 800 } = options;

        // Find cart icon - try multiple selectors
        let cartIcon = document.querySelector('[data-cart-icon="true"]') as HTMLElement;
        
        // Fallback selectors if first one fails
        if (!cartIcon) {
            cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement;
        }
        if (!cartIcon) {
            cartIcon = document.querySelector('a[href*="/cart"]') as HTMLElement;
        }
        
        if (!cartIcon) {
            console.warn('Cart icon not found. Available cart elements:', {
                withTrue: document.querySelector('[data-cart-icon="true"]'),
                withAttr: document.querySelector('[data-cart-icon]'),
                withHref: document.querySelector('a[href*="/cart"]')
            });
            onComplete?.();
            return;
        }
        

        // Get positions
        const imageRect = imageElement.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        // Get the actual image inside the container
        const actualImage = imageElement.querySelector('img');
        const imageSrc = actualImage?.src || '';
        // Create flying clone as img element
        const flyingImage = document.createElement('img');
        flyingImage.src = imageSrc;
        flyingImage.style.cssText = `
            position: fixed;
            top: ${imageRect.top}px;
            left: ${imageRect.left}px;
            width: ${imageRect.width}px;
            height: ${imageRect.height}px;
            z-index: 9999;
            pointer-events: none;
            transition: all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 1;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            object-fit: cover;
        `;

        document.body.appendChild(flyingImage);

        // Force reflow
        flyingImage.offsetHeight;

        // Trigger animation
        requestAnimationFrame(() => {
            flyingImage.style.top = `${cartRect.top + cartRect.height / 2}px`;
            flyingImage.style.left = `${cartRect.left + cartRect.width / 2}px`;
            flyingImage.style.width = '20px';
            flyingImage.style.height = '20px';
            flyingImage.style.opacity = '0';
            flyingImage.style.transform = 'scale(0.1)';
        });

        // Cleanup and callback
        setTimeout(() => {
            if (flyingImage.parentNode) {
                flyingImage.parentNode.removeChild(flyingImage);
            }

            // Add bounce animation to cart icon
            if (cartIcon) {
                cartIcon.style.animation = 'cart-bounce 0.5s ease';
                setTimeout(() => {
                    cartIcon.style.animation = '';
                }, 500);
            }

            onComplete?.();
        }, duration);
    }, []);

    return { flyToCart };
}