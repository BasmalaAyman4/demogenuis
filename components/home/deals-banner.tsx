// components/home/deals-banner.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import rightimge from '@/assets/70a93dfa7f4f23008936f118d72225ad.jpg'
import leftimge from '@/assets/8cf3e13174ba9ae1a3af3a587ae03d8f.jpg'
import centerimge from '@/assets/Untitled design (1).png'
interface DealsBannerProps {
    locale: string;
    endDate: string; // ISO date string or timestamp
}

interface CountdownTime {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function DealsBanner({
    locale,
    endDate
}: DealsBannerProps) {
    const [countdown, setCountdown] = useState<CountdownTime>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateCountdown = () => {
            const now = new Date().getTime();
            const end = new Date(endDate).getTime();
            const distance = end - now;

            if (distance < 0) {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });
        };

        calculateCountdown();
        const interval = setInterval(calculateCountdown, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    const isRTL = locale === 'ar';

    return (
        <section className="relative w-full overflow-hidden ">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_8s_linear_infinite]" />
            </div>

            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    {/* Left Image */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group"
                    >
                        <Image
                            src={leftimge}
                            alt="Deal fashion left"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            priority
                        />

                        {/* Shop This Look Button */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute bottom-6 left-6"
                        >
                            <Link
                                href={`/${locale}/dealOfDay`}
                                className="flex items-center gap-2 bg-white px-6 py-3 rounded-full font-semibold text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span>{isRTL ? 'تسوق  الان' : 'Shop Now'}</span>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Center Content */}
                    {/* Center Image with Content Overlay */}
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group"
                    >
                        {/* Background Image */}
                        <Image
                            src={centerimge}
                            alt="Deal fashion center"
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            priority
                        />

                        {/* Dark Overlay for better text readability */}

                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_8s_linear_infinite]" />
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-6 p-6">
                            {/* Title */}
                            <div className="space-y-3">
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-300 text-xs md:text-sm uppercase tracking-wider"
                                >
                                    {isRTL ? 'لا تفوت الفرصة' : "DON'T MISS OUT"}
                                </motion.p>

                                <motion.h2
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                                >
                                    {isRTL ? 'أفضل عروض اليوم' : "Today's Best Deals"}
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6 }}
                                    className="text-gray-300 text-sm md:text-base"
                                >
                                    {isRTL
                                        ? 'تخفيضات تصل إلى 30% على جميع المنتجات'
                                        : 'Sale up to 30% all items. Hurry up!'}
                                </motion.p>
                            </div>

                            {/* Countdown Timer */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.7, duration: 0.5 }}
                                className="flex justify-center gap-2 md:gap-3"
                            >
                                <TimeBox value={countdown.days} label={isRTL ? 'أيام' : 'DAYS'} />
                                <TimeBox value={countdown.hours} label={isRTL ? 'ساعات' : 'HRS'} />
                                <TimeBox value={countdown.minutes} label={isRTL ? 'دقائق' : 'MINS'} />
                                <TimeBox value={countdown.seconds} label={isRTL ? 'ثواني' : 'SECS'} />
                            </motion.div>

                            {/* CTA Button */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.9, duration: 0.4 }}
                            >
                                <Link
                                    href={`/${locale}/dealOfDay`}
                                    className="inline-block bg-white text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
                                >
                                    {isRTL ? 'تسوق المجموعة' : 'Shop Collection'}
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group"
                    >
                        <Image
                            src={rightimge}
                            alt="Deal fashion right"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                            priority
                        />

                        {/* Shop This Look Button */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute bottom-6 right-6"
                        >
                            <Link
                                href={`/${locale}/dealOfDay`}
                                className="flex items-center gap-2 bg-white px-6 py-3 rounded-full font-semibold text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                <span>{isRTL ? 'تسوق  الان' : 'Shop Now'}</span>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Glow Effect */}
        </section>
    );
}

function TimeBox({ value, label }: { value: number; label: string }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center justify-center w-16 h-20 md:w-20 md:h-24 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl"
        >
            <motion.span
                key={value}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-2xl md:text-3xl font-bold text-white tabular-nums"
            >
                {value.toString().padStart(2, '0')}
            </motion.span>
            <span className="text-[10px] md:text-xs text-gray-400 font-semibold mt-1">
                {label}
            </span>
        </motion.div>
    );
}