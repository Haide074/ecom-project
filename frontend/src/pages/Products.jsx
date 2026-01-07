import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        sortBy: 'createdAt',
        order: 'desc',
    });
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Sync state with URL search param
    useEffect(() => {
        const querySearch = searchParams.get('search');
        if (querySearch !== null && querySearch !== searchQuery) {
            setSearchQuery(querySearch);
        }
    }, [searchParams]);

    // Build query params
    const queryParams = {
        page,
        limit: 12,
        search: searchQuery || undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        minRating: filters.minRating || undefined,
        sortBy: filters.sortBy,
        order: filters.order,
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['products', queryParams],
        queryFn: () => productsAPI.getAll(queryParams),
    });

    const products = data?.data?.data?.products || [];
    const pagination = data?.data?.data?.pagination || {};

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (searchQuery) {
                newParams.set('search', searchQuery);
            } else {
                newParams.delete('search');
            }
            return newParams;
        });
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1); // Reset to first page on filter change
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            minRating: '',
            sortBy: 'createdAt',
            order: 'desc',
        });
        setSearchQuery('');
        setSearchParams({});
        setPage(1);
    };

    const hasActiveFilters =
        filters.category ||
        filters.minPrice ||
        filters.maxPrice ||
        filters.minRating ||
        searchQuery;

    return (
        <div className="products-page">
            <div className="container">
                {/* Page Header */}
                <div className="products-header">
                    <div className="header-content">
                        <h1 className="page-title">Our Products</h1>
                        <p className="page-subtitle">
                            Discover our curated collection of premium skincare products
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSearchParams(prev => {
                                            const newParams = new URLSearchParams(prev);
                                            newParams.delete('search');
                                            return newParams;
                                        });
                                    }}
                                    className="clear-search"
                                    aria-label="Clear search"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>
                    </form>
                </div>

                {/* Filter Toggle Button (Mobile) */}
                <button
                    className="filter-toggle-btn"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal size={20} />
                    Filters
                    {hasActiveFilters && <span className="filter-badge">•</span>}
                </button>

                <div className="products-content">
                    {/* Filters Sidebar */}
                    <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                        <div className="filters-header">
                            <h3>Filters</h3>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="clear-filters-btn">
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Sort By */}
                        <div className="filter-group">
                            <label className="filter-label">Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                className="filter-select"
                            >
                                <option value="createdAt">Newest</option>
                                <option value="price">Price</option>
                                <option value="averageRating">Rating</option>
                                <option value="name">Name</option>
                            </select>
                        </div>

                        {/* Order */}
                        <div className="filter-group">
                            <label className="filter-label">Order</label>
                            <select
                                value={filters.order}
                                onChange={(e) => handleFilterChange('order', e.target.value)}
                                className="filter-select"
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="filter-group">
                            <label className="filter-label">Price Range</label>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    className="filter-input"
                                    min="0"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    className="filter-input"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Minimum Rating */}
                        <div className="filter-group">
                            <label className="filter-label">Minimum Rating</label>
                            <select
                                value={filters.minRating}
                                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Ratings</option>
                                <option value="4">4+ Stars</option>
                                <option value="3">3+ Stars</option>
                                <option value="2">2+ Stars</option>
                            </select>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="products-main">
                        {/* Results Info */}
                        <div className="results-info">
                            <p className="results-count">
                                {isLoading
                                    ? 'Loading...'
                                    : `Showing ${products.length} of ${pagination.total || 0} products`}
                            </p>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="error-state">
                                <p>Failed to load products. Please try again.</p>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="products-grid">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="skeleton-card">
                                        <div className="skeleton skeleton-image"></div>
                                        <div className="skeleton skeleton-text"></div>
                                        <div className="skeleton skeleton-text short"></div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Products Grid */}
                        {!isLoading && !error && products.length > 0 && (
                            <div className="products-grid">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && !error && products.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3>No products found</h3>
                                <p>Try adjusting your filters or search query</p>
                                {hasActiveFilters && (
                                    <button onClick={clearFilters} className="btn btn-primary">
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {!isLoading && products.length > 0 && pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="pagination-btn"
                                >
                                    Previous
                                </button>

                                <div className="pagination-pages">
                                    {[...Array(pagination.totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        // Show first, last, current, and adjacent pages
                                        if (
                                            pageNum === 1 ||
                                            pageNum === pagination.totalPages ||
                                            Math.abs(pageNum - page) <= 1
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                    className={`pagination-btn ${page === pageNum ? 'active' : ''
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === page - 2 ||
                                            pageNum === page + 2
                                        ) {
                                            return <span key={pageNum}>...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                    disabled={page === pagination.totalPages}
                                    className="pagination-btn"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
