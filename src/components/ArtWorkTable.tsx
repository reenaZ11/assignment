import { useState, useEffect, useRef } from "react";
import { fetchArtWorks } from "../services/api";
import { ArtWorkTypes, PaginationTypes } from "../types/types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { FaChevronDown } from "react-icons/fa";

const ArtWorkTable = () => {
  const [artWorks, setArtWorks] = useState<ArtWorkTypes[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationTypes | null>(null);
  const [inputValue, setInputValue] = useState("");
  const overlayRef = useRef<OverlayPanel | null>(null);
  const [selectedArtWorks, setSelectedArtWorks] = useState<ArtWorkTypes[]>([]); 

  const fetchPageData = async (page: number) => {
    try {
      const response = await fetchArtWorks(page);
      setArtWorks(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  useEffect(() => {
    fetchPageData(page);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (pagination && page < Math.ceil(pagination.total / pagination.limit)) {
      setPage(page + 1);
    }
  };

  const showOverlay = (event: React.MouseEvent) => {
    overlayRef.current?.toggle(event);
  };

  const handleSubmit = () => {
    const numberOfRows = parseInt(inputValue, 10);
    const totalAvailableRows = pagination ? pagination.total : 0;

    if (numberOfRows && numberOfRows <= totalAvailableRows) {
      let rowsToSelect: ArtWorkTypes[] = [];
      let currentPage = page;
      let selectedCount = 0;

      while (selectedCount < numberOfRows && currentPage <= Math.ceil(totalAvailableRows / pagination!.limit)) {
        const remainingToSelect = numberOfRows - selectedCount;
        const currentPageData = artWorks.slice(0, remainingToSelect);
        rowsToSelect = [...rowsToSelect, ...currentPageData];
        selectedCount += currentPageData.length;
        currentPage++;
      }

      setSelectedArtWorks((prevSelected) => [...prevSelected, ...rowsToSelect]);
      overlayRef.current?.hide();
    } else {
      alert(`Please enter a valid number of rows (maximum: ${totalAvailableRows}).`);
    }
  };

  const handleSelectionChange = (e: { value: ArtWorkTypes[] }) => {
    setSelectedArtWorks(e.value); 
  };

  return (
    <div className="md:p-20">
      <DataTable
        value={artWorks}
        selectionMode="checkbox"
        selection={selectedArtWorks} 
        onSelectionChange={handleSelectionChange}
        dataKey="id"
        tableStyle={{ minWidth: "40rem" }}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
          header={<FaChevronDown onClick={showOverlay} />}
        ></Column>

        <Column field="title" header="Title" className="w-[18%]" />
        <Column field="place_of_origin" header="Place of Origin" className="w-[12%]" />
        <Column field="artist_display" header="Artist" className="w-[26%]" />
        <Column field="inscriptions" header="Inscriptions" className="w-[26%] overflow-hidden" />
        <Column field="date_start" header="Start Date" className="w-[9%]" />
        <Column field="date_end" header="End Date" className="w-[9%]" />
      </DataTable>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Previous
        </button>

        <span>
          Page {page} of {pagination ? Math.ceil(pagination.total / pagination.limit) : 1}
        </span>

        <button
          onClick={handleNextPage}
          disabled={pagination ? page >= Math.ceil(pagination.total / pagination.limit) : false}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            pagination && page >= Math.ceil(pagination.total / pagination.limit) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>

      <OverlayPanel ref={overlayRef}>
        <div className="p-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Select rows..."
            className="p-2 border rounded w-full"
          />
          <button onClick={handleSubmit} className="px-4 py-2 mt-3 bg-blue-500 text-white rounded">
            Submit
          </button>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default ArtWorkTable;
