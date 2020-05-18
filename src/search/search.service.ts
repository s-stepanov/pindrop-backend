import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SearchResponse } from './models/search-response';
import { Artist, ArtistSearch } from './models/artist';
import { Album, AlbumSearch } from './models/album';

@Injectable()
export class SearchService {
  private readonly apiKey: string;
  private readonly apiURLBase = 'http://ws.audioscrobbler.com/2.0/';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpClient: HttpService,
  ) {
    this.apiKey = this.configService.get('LASTFM_API_KEY');
  }

  public searchArtists(
    term: string,
    page: number,
    limit: number,
  ): Observable<SearchResponse<ArtistSearch>> {
    const searchURL = `${this.apiURLBase}?method=artist.search&artist=${term}&api_key=${this.apiKey}&format=json&page=${page}&limit=${limit}`;
    return this.httpClient
      .get(searchURL)
      .pipe(map(data => this.transformArtists(data?.data.results)));
  }

  public searchAlbums(
    term: string,
    page: number,
    limit: number,
  ): Observable<SearchResponse<AlbumSearch>> {
    const searchURL = `${this.apiURLBase}?method=album.search&album=${term}&api_key=${this.apiKey}&format=json&page=${page}&limit=${limit}`;
    return this.httpClient
      .get(searchURL)
      .pipe(map(data => this.transformAlbums(data?.data.results)));
  }

  public searchArtistInfo(mbid: string): Observable<Artist> {
    const artistURL = `${this.apiURLBase}?method=artist.getinfo&mbid=${mbid}&api_key=${this.apiKey}&format=json`;
    return this.httpClient
      .get(artistURL)
      .pipe(map(data => this.transformArtist(data?.data.artist)));
  }

  public searchAlbumInfo(mbid: string): Observable<any> {
    const albumURL = `${this.apiURLBase}?method=album.getinfo&mbid=${mbid}&api_key=${this.apiKey}&format=json`;
    return this.httpClient
      .get(albumURL)
      .pipe(map(data => this.transformAlbum(data?.data.album)));
  }

  public transformArtists(apiResponse: any): SearchResponse<ArtistSearch> {
    if (!apiResponse) {
      throw Error('Unable to get response from LastFM');
    }
    const artists: ArtistSearch[] = apiResponse?.artistmatches.artist.map(
      artist => ({
        name: artist.name,
        mbid: artist.mbid,
        image: artist.image.map(img => ({
          url: img['#text'],
          size: img.size,
        })),
        listeners: artist.listeners,
      }),
    );
    return {
      totalResults: apiResponse['opensearch:totalResults'],
      itemsPerPage: apiResponse['opensearch:itemsPerPage'],
      startIndex: apiResponse['opensearch:startIndex'],
      matches: artists,
    };
  }

  public transformAlbums(apiResponse: any): SearchResponse<AlbumSearch> {
    if (!apiResponse) {
      throw Error('Unable to get response from LastFM');
    }
    const artists: AlbumSearch[] = apiResponse?.albummatches.album.map(
      album => ({
        name: album.name,
        mbid: album.mbid,
        image: album.image.map(img => ({
          url: img['#text'],
          size: img.size,
        })),
        artist: album.artist,
      }),
    );
    return {
      totalResults: apiResponse['opensearch:totalResults'],
      itemsPerPage: apiResponse['opensearch:itemsPerPage'],
      startIndex: apiResponse['opensearch:startIndex'],
      matches: artists,
    };
  }

  public transformArtist(apiResponse: any): Artist {
    const { name, mbid, image, bio, listeners } = apiResponse;

    return {
      name,
      mbid,
      image,
      bio,
      listeners,
    };
  }

  public transformAlbum(apiResponse: any): Album {
    const {
      name,
      artist,
      mbid,
      releaseDate,
      playCount,
      topTags,
      tracks,
    } = apiResponse;

    return {
      name,
      artist,
      mbid,
      releaseDate,
      playCount,
      topTags,
      tracks,
    };
  }
}
