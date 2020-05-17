import { Image } from 'src/shared/image';

export interface Album {}

export interface AlbumSearch {
  name: string;
  artist: string;
  image: Image[];
  mbid: string;
}
