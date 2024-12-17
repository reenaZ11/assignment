
import { ArtWorkTypes, PaginationTypes } from "../types/types";

export const fetchArtWorks = async (page: number): Promise<{ data: ArtWorkTypes[]; pagination: PaginationTypes }> => {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=12`);
    const data = await response.json();
  
    return {
      data: data.data, // Artwork list
      pagination: {
        total: data.pagination.total,
        limit: data.pagination.limit,
        offset: data.pagination.offset,
        total_pages: data.pagination.total_pages,
        current_page: data.pagination.current_page,
      },
    };
  };
  

