// app/[locale]/(shop)/category/[slug]/components/FilterBar.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Plus } from 'lucide-react';

interface FilterOption {
    id: number;
    name: string;
    colorHex?: string;
}

interface FilterBarProps {
    basicData: {
        subCategories: FilterOption[];
        colors: FilterOption[];
        sizes: FilterOption[];
        priceRange: { minPrice: number; maxPrice: number };
    };
    filters: {
        subCategoryIds: number[];
        colorIds: number[];
        sizeIds: number[];
        sortByPrice: boolean;
        maxPrice: number;
    };
    onFilterChange: (filters: any) => void;
    onClearFilters: () => void;
    activeFiltersCount: number;
    locale:string
}

type FilterType = 'price' | 'subCategory' | 'colors' | 'sizes';

interface DropdownPosition {
    top: number;
    left: number;
    width: number;
}

export default function FilterBar({
    basicData,
    filters,
    onFilterChange,
    onClearFilters,
    activeFiltersCount,
    locale
}: FilterBarProps) {
    const [openDropdown, setOpenDropdown] = useState<FilterType | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
    const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    const updateDropdownPosition = (filterType: FilterType) => {
        const button = buttonRefs.current[filterType];
        if (button) {
            const rect = button.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    };

    useEffect(() => {
        if (openDropdown) {
            updateDropdownPosition(openDropdown);
            const handleResize = () => updateDropdownPosition(openDropdown);
            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('scroll', handleResize);
            };
        }
    }, [openDropdown]);

    const toggleDropdown = (filterType: FilterType) => {
        if (openDropdown === filterType) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(filterType);
            updateDropdownPosition(filterType);
        }
    };

    const handleToggleItem = (
        key: 'subCategoryIds' | 'colorIds' | 'sizeIds',
        id: number
    ) => {
        const currentIds = filters[key];
        const newIds = currentIds.includes(id)
            ? currentIds.filter((i) => i !== id)
            : [...currentIds, id];
        onFilterChange({ [key]: newIds });
    };

    const removeFilter = (
        key: 'subCategoryIds' | 'colorIds' | 'sizeIds',
        id: number
    ) => {
        const newIds = filters[key].filter((i) => i !== id);
        onFilterChange({ [key]: newIds });
    };

    const getSelectedCount = (filterType: FilterType): number => {
        switch (filterType) {
            case 'price':
                return filters.maxPrice < basicData.priceRange.maxPrice ? 1 : 0;
            case 'subCategory':
                return filters.subCategoryIds.length;
            case 'colors':
                return filters.colorIds.length;
            case 'sizes':
                return filters.sizeIds.length;
            default:
                return 0;
        }
    };

    const getFilterLabel = (filterType: FilterType): string => {
        const labels = {
            price: `${locale == 'en' ? 'Price' : 'السعر'}`,
            subCategory: `${locale == 'en' ? 'Sub Category' : 'تصنيف فرعي'}`,
            colors: `${locale == 'en' ? 'Colors' : 'الالوان'}`,
            sizes: `${locale == 'en' ? 'Sizes' : 'المقاسات'}`,
        };
        return labels[filterType];
    };

    const renderActiveFilters = () => {
        const activeFilters: JSX.Element[] = [];

        // Sub categories
        filters.subCategoryIds.forEach((id) => {
            const item = basicData.subCategories.find((s) => s.id === id);
            if (item) {
                activeFilters.push(
                    <FilterChip
                        key={`sub-${id}`}
                        label={item.name}
                        onRemove={() => removeFilter('subCategoryIds', id)}
                    />
                );
            }
        });

        // Colors
        filters.colorIds.forEach((id) => {
            const item = basicData.colors.find((c) => c.id === id);
            if (item) {
                activeFilters.push(
                    <FilterChip
                        key={`color-${id}`}
                        label={item.name}
                        color={item.hexCode}
                        onRemove={() => removeFilter('colorIds', id)}
                    />
                );
            }
        });

        // Sizes
        filters.sizeIds.forEach((id) => {
            const item = basicData.sizes.find((s) => s.id === id);
            if (item) {
                activeFilters.push(
                    <FilterChip
                        key={`size-${id}`}
                        label={item.name}
                        onRemove={() => removeFilter('sizeIds', id)}
                    />
                );
            }
        });

        return activeFilters;
    };

    return (
        <>
            <div className="bg-white border-y border-gray-200 sticky top-26 z-30">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                            {locale == 'en' ? 'Filter By' : 'تصفية حسب'} :
                        </span>

                        <FilterButton
                            ref={(el) => (buttonRefs.current.price = el)}
                            label={getFilterLabel('price')}
                            count={getSelectedCount('price')}
                            isOpen={openDropdown === 'price'}
                            onClick={() => toggleDropdown('price')}
                        />

                        <FilterButton
                            ref={(el) => (buttonRefs.current.subCategory = el)}
                            label={getFilterLabel('subCategory')}
                            count={getSelectedCount('subCategory')}
                            isOpen={openDropdown === 'subCategory'}
                            onClick={() => toggleDropdown('subCategory')}
                        />

                        <FilterButton
                            ref={(el) => (buttonRefs.current.colors = el)}
                            label={getFilterLabel('colors')}
                            count={getSelectedCount('colors')}
                            isOpen={openDropdown === 'colors'}
                            onClick={() => toggleDropdown('colors')}
                        />

                        <FilterButton
                            ref={(el) => (buttonRefs.current.sizes = el)}
                            label={getFilterLabel('sizes')}
                            count={getSelectedCount('sizes')}
                            isOpen={openDropdown === 'sizes'}
                            onClick={() => toggleDropdown('sizes')}
                        />

                       
                    </div>

                    {/* Active Filters */}
                    {activeFiltersCount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 mt-3 flex-wrap"
                        >
                            <button
                                onClick={onClearFilters}
                                className="px-3 py-1.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                {locale == 'en' ?'Clear All':'مسح الكل'}
                            </button>
                            {renderActiveFilters()}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Dropdown Overlay */}
            <AnimatePresence>
                {openDropdown && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenDropdown(null)}
                            className="fixed inset-0 z-40"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={
                                dropdownPosition
                                    ? {
                                        position: 'absolute',
                                        top: dropdownPosition.top,
                                        left: dropdownPosition.left,
                                        minWidth: dropdownPosition.width,
                                    }
                                    : undefined
                            }
                            className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 max-h-96 overflow-y-auto"
                        >
                            {openDropdown === 'price' && (
                                <PriceFilter
                                    priceRange={basicData.priceRange}
                                    maxPrice={filters.maxPrice}
                                    sortByPrice={filters.sortByPrice}
                                    onChange={onFilterChange}
                                    locale={locale}
                                />
                            )}
                            {openDropdown === 'subCategory' && (
                                <CheckboxFilter
                                    items={basicData.subCategories}
                                    selectedIds={filters.subCategoryIds}
                                    onToggle={(id) => handleToggleItem('subCategoryIds', id)}
                                />
                            )}
                            {openDropdown === 'colors' && (
                                <ColorFilter
                                    colors={basicData.colors}
                                    selectedIds={filters.colorIds}
                                    onToggle={(id) => handleToggleItem('colorIds', id)}
                                />
                            )}
                            {openDropdown === 'sizes' && (
                                <SizeFilter
                                    sizes={basicData.sizes}
                                    selectedIds={filters.sizeIds}
                                    onToggle={(id) => handleToggleItem('sizeIds', id)}
                                />
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// Sub-components
const FilterButton = React.forwardRef<
    HTMLButtonElement,
    {
        label: string;
        count: number;
        isOpen: boolean;
        onClick: () => void;
    }
>(({ label, count, isOpen, onClick }, ref) => (
    <button
        ref={ref}
        onClick={onClick}
        className={`px-4 py-2 w-65 rounded-lg  text-sm font-medium transition-all flex justify-between items-center gap-2 ${isOpen
                ? 'bg-gray-900 text-white'
                : count > 0
                    ? 'bg-gray-100 text-gray-900 border border-gray-300'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
    >
        <span className='flex items-center gap-2'>
        <span>
        {label}
        </span>
        {count > 0 && (
            <span className="bg-white text-gray-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {count}
            </span>
        )}
        </span>
        <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
    </button>
));

FilterButton.displayName = 'FilterButton';

const FilterChip = ({
    label,
    color,
    onRemove,
}: {
    label: string;
    color?: string;
    onRemove: () => void;
}) => (
    <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium text-gray-900 flex items-center gap-2"
    >
        {color && (
            <span
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
            />
        )}
        {label}
        <button
            onClick={onRemove}
            className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
        >
            <X className="w-3 h-3" />
        </button>
    </motion.div>
);

const PriceFilter = ({
    priceRange,
    maxPrice,
    sortByPrice,
    onChange,
    locale
}: {
    priceRange: { minPrice: number; maxPrice: number };
    maxPrice: number;
    sortByPrice: boolean;
    onChange: (filters: any) => void;
        locale:string
}) => (
    <div className="w-64 space-y-4">
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={sortByPrice}
                onChange={(e) => onChange({ sortByPrice: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <span className="text-sm font-medium text-gray-700">{locale == 'en' ? 'Sort by price' : 'الترتيب حسب السعر'} </span>
        </label>
        <div className="space-y-2">
            <input
                type="range"
                min={priceRange.minPrice}
                max={priceRange.maxPrice}
                value={maxPrice}
                onChange={(e) => onChange({ maxPrice: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
            />
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">EGP {priceRange.minPrice}</span>
                <span className="font-semibold text-gray-900">EGP {maxPrice}</span>
            </div>
        </div>
    </div>
);

const CheckboxFilter = ({
    items,
    selectedIds,
    onToggle,
}: {
    items: FilterOption[];
    selectedIds: number[];
    onToggle: (id: number) => void;
}) => (
    <div className="w-64 max-h-80 overflow-y-auto space-y-2">
        {items.map((item) => (
            <label
                key={item.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
                <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700">{item.name}</span>
            </label>
        ))}
    </div>
);

const ColorFilter = ({
    colors,
    selectedIds,
    onToggle,
}: {
    colors: FilterOption[];
    selectedIds: number[];
    onToggle: (id: number) => void;
}) => (
    
    <div className="w-64">
        <div className="grid grid-cols-6 gap-3">
            {colors.map((color) => {
                const isSelected = selectedIds.includes(color.id);
                return (
                    <button
                        key={color.id}
                        onClick={() => onToggle(color.id)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${isSelected
                                ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                        style={{
                            backgroundColor: color.colorHex
                                ? color.colorHex.startsWith('#')
                                    ? color.colorHex
                                    : `#${color.colorHex}`
                                : '#ccc', }}
                        title={color.name}
                    />
                );
            })}
        </div>
    </div>
);

const SizeFilter = ({
    sizes,
    selectedIds,
    onToggle,
}: {
    sizes: FilterOption[];
    selectedIds: number[];
    onToggle: (id: number) => void;
}) => (
    <div className="w-70">
        <div className="grid grid-cols-4 gap-2">
            {sizes.map((size) => {
                const isSelected = selectedIds.includes(size.id);
                return (
                    <button
                        key={size.id}
                        onClick={() => onToggle(size.id)}
                        className={`px-2 py-2 w-17 rounded-lg border-2 text-sm font-medium transition-all ${isSelected
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                    >
                        {size.name}
                    </button>
                );
            })}
        </div>
    </div>
);