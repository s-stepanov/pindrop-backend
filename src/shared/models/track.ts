export interface Track {
  name: string;
  duration: number;
  mbid: string;
  artist: {
    name: string;
    mbid: string;
  };
}
