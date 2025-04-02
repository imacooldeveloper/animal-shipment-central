
import ImportsHeader from '@/components/imports/ImportsHeader';
import ImportsContent from '@/components/imports/ImportsContent';
import { useImports } from '@/hooks/useImports';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PAGINATION_CONSTANTS } from "@/lib/constants";

const Imports = () => {
  const isMobile = useIsMobile();
  const {
    imports,
    allFilteredImports,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    viewMode,
    toggleViewMode,
    currentPage,
    totalPages,
    handlePageChange,
    ITEMS_PER_PAGE,
    handleDateRangeChange
  } = useImports();
  
  return (
    <div className="space-y-4 md:space-y-6 container mx-auto px-0 md:px-2">
      <ImportsHeader />
      
      <ImportsContent 
        imports={imports}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
        onDateRangeChange={handleDateRangeChange}
      />
      
      {/* Pagination for imports */}
      {allFilteredImports.length > ITEMS_PER_PAGE && (
        <div className="mt-4 bg-white p-4 rounded-md shadow-sm border">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* First page */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                </PaginationItem>
              )}
              
              {/* Ellipsis for many pages */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {/* Previous page if not on page 1 */}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Current page */}
              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>
              
              {/* Next page if not on last page */}
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              {/* Ellipsis for many pages */}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              {/* Last page */}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-center text-sm text-muted-foreground mt-2">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, allFilteredImports.length)} of {allFilteredImports.length} imports
          </div>
        </div>
      )}
    </div>
  );
};

export default Imports;
