import { Image } from 'src/shared/models/image';
import { Track } from 'src/shared/models/track';
import { Tag } from 'src/shared/models/tag';

export interface Album {
  name: string;
  artist: string;
  mbid: string;
  releaseDate: string;
  playCount: number;
  topTags: Array<Tag>;
  tracks: Array<Track>;
}

export interface AlbumSearch {
  name: string;
  artist: string;
  image: Image[];
  mbid: string;
}
