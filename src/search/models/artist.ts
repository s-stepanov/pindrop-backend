import { Image } from 'src/shared/models/image';
import { AlbumSearch } from './album';

export interface Artist {}

export interface ArtistSearch {
  mbid: string;
  name: string;
  image: Image[];
  listeners: number;
  bio: {
    summary: string;
    content: string;
  };
  albums: AlbumSearch[];
}
