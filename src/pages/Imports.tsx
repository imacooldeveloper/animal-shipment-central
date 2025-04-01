
import ImportsHeader from '@/components/imports/ImportsHeader';
import ImportsContent from '@/components/imports/ImportsContent';
import { useImports } from '@/hooks/useImports';
import { useIsMobile } from '@/hooks/use-mobile';

const Imports = () => {
  const isMobile = useIsMobile();
  const {
    imports,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    viewMode,
    toggleViewMode
  } = useImports();
  
  return (
    <div className={`space-y-4 md:space-y-6 container mx-auto ${isMobile ? 'px-2' : 'px-2 md:p-0'} py-4`}>
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
      />
    </div>
  );
};

export default Imports;
