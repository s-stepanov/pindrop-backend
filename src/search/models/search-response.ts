export interface SearchResponse<T> {
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  matches: T[];
}
