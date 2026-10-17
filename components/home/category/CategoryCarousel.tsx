'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
    typeId: number;
    typeName: string;
    typePic: string;
    productNo: number;
}

interface CategoryCarouselProps {
    categories: Category[];
    locale?: string;
}

export function CategoryCarousel({ categories, locale = 'ar' }: CategoryCarouselProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;

        const scrollAmount = 300;
        const newScrollLeft = scrollContainerRef.current.scrollLeft +
            (direction === 'right' ? scrollAmount : -scrollAmount);

        scrollContainerRef.current.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };

    return (
        <section className="w-full py-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">
                        {
                            locale == 'en' ?
                                ` Shop By Collections`
                                :
                                `تسوق حسب المجموعات`
                        }
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {
                            locale == 'en' ?
                                `                        Express Your Style With Our Standout Collection - Fashion Meets Sophistication`
                                :
                                `عبّر عن أسلوبك مع مجموعتنا المميزة - الموضة تلتقي بالرقي`
                        }
                    </p>
                </div>

                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Navigation Arrows */}
                    <AnimatePresence>
                        {isHovered && (
                            <>
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => scroll('left')}
                                    className="absolute left-[-80px] top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-3 transition-colors"
                                    aria-label="Previous categories"
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                                </motion.button>

                                <motion.button
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => scroll('right')}
                                    className="absolute right-[-80px] top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-3 transition-colors"
                                    aria-label="Next categories"
                                >
                                    <ChevronRight className="w-6 h-6 text-gray-800" />
                                </motion.button>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Categories Container */}
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 py-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.typeId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="flex-shrink-0"
                            >
                                <Link
                                    href={`/${locale}/category/${category.typeId}`}
                                    className="block"
                                >
                                    <motion.div
                                        className="relative w-56 h-70 bg-gray-100 overflow-hidden rounded-t-[200px] hover:rounded-b-[200px] transition-all duration-300 ease-in-out"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: hoveredIndex === index ? 1.1 : 1,
                                            }}
                                            transition={{ duration: 0.4 }}
                                            className="w-full h-full relative"
                                        >
                                            <Image
                                                src={category.typePic}
                                                alt={category.typeName}
                                                fill
                                                className="object-cover "
                                                sizes="(max-width: 768px) 224px, 224px"
                                            />
                                        </motion.div>

                                        {/* Overlay on hover */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0 bg-black/10 flex items-center justify-center"
                                        >
                                            <motion.div
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{
                                                    y: hoveredIndex === index ? 0 : 10,
                                                    opacity: hoveredIndex === index ? 1 : 0
                                                }}
                                                transition={{ duration: 0.3, delay: 0.1 }}
                                                className="bg-white/95 px-4 py-2 rounded-full text-sm font-medium"
                                            >
                                                {category.productNo} {locale == 'en' ?`Products`:`منتج`}
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        className="text-center mt-4"
                                        animate={{
                                            y: hoveredIndex === index ? -4 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {category.typeName}
                                        </h3>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

