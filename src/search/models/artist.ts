import { Image } from 'src/shared/image';

export interface Artist {}

export interface ArtistSearch {
  mbid: string;
  name: string;
  image: Image[];
  listeners: number;
}
