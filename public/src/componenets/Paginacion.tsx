import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;

    onPageChange: (page: number) => void;
}

const getPaginationPages = (currentPage: number, totalPages: number): (number | string)[] => {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,

    onPageChange,
}) => {
    const pages = getPaginationPages(currentPage, totalPages);

    return (
        <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 py-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="hidden sm:inline">Anterior</span>
                <span className="sm:hidden">‹</span>
            </button>

            {pages.map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`px-2.5 sm:px-4 py-2 text-sm font-medium rounded-md border ${page === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : page === '...'
                                ? 'bg-white border-transparent text-gray-700 cursor-default'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
                className="px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="hidden sm:inline">Siguiente</span>
                <span className="sm:hidden">›</span>
            </button>
        </nav>
    );
};
