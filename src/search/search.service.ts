import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { SearchResponse } from './models/search-response';
import { Artist, ArtistSearch } from './models/artist';
import { Album, AlbumSearch } from './models/album';

@Injectable()
export class SearchService {
  private readonly apiKey: string;
  private readonly apiURLBase = 'http://ws.audioscrobbler.com/2.0/';

  constructor(private readonly configService: ConfigService, private readonly httpClient: HttpService) {
    this.apiKey = this.configService.get('LASTFM_API_KEY');
  }

  public searchArtists(term: string, page: number, limit: number): Observable<SearchResponse<ArtistSearch>> {
    const searchURL = `${this.apiURLBase}?method=artist.search&artist=${term}&api_key=${this.apiKey}&format=json&page=${page}&limit=${limit}`;
    return this.httpClient.get(searchURL).pipe(map(data => this.transformArtists(data?.data.results)));
  }

  public searchAlbums(term: string, page: number, limit: number): Observable<SearchResponse<AlbumSearch>> {
    const searchURL = `${this.apiURLBase}?method=album.search&album=${term}&api_key=${this.apiKey}&format=json&page=${page}&limit=${limit}`;
    return this.httpClient.get(searchURL).pipe(map(data => this.transformAlbums(data?.data.results)));
  }

  public searchArtistInfo(mbid: string): Observable<Artist> {
    const artistURL = `${this.apiURLBase}?method=artist.getinfo&mbid=${mbid}&api_key=${this.apiKey}&format=json`;
    const artistReleasesUrl = `${this.apiURLBase}?method=artist.getTopAlbums&mbid=${mbid}&api_key=${this.apiKey}&format=json`;

    return forkJoin([this.httpClient.get(artistURL), this.httpClient.get(artistReleasesUrl)]).pipe(
      map(data => {
        const mergedResponse = {
          ...data[0]?.data.artist,
          ...data[1]?.data.topalbums,
        };
        return this.transformArtist(mergedResponse);
      }),
    );
  }

  public searchAlbumInfo(mbid: string): Observable<Album> {
    const albumURL = `${this.apiURLBase}?method=album.getinfo&mbid=${mbid}&api_key=${this.apiKey}&format=json`;
    return this.httpClient.get(albumURL).pipe(map(data => this.transformAlbum(data?.data.album)));
  }

  public transformArtists(apiResponse: any): SearchResponse<ArtistSearch> {
    if (!apiResponse) {
      throw Error('Unable to get response from LastFM');
    }
    const artists: ArtistSearch[] = apiResponse?.artistmatches.artist
      .map(artist => ({
        name: artist.name,
        mbid: artist.mbid,
        image: artist.image.map(img => ({
          url: img['#text'],
          size: img.size,
        })),
        listeners: artist.listeners,
      }))
      .filter(artist => !!artist.mbid);
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
    const albums: AlbumSearch[] = apiResponse?.albummatches.album
      .map(album => ({
        name: album.name,
        mbid: album.mbid,
        image: album.image.map(img => ({
          url: img['#text'],
          size: img.size,
        })),
        artist: album.artist,
      }))
      .filter(album => !!album.mbid);
    return {
      totalResults: apiResponse['opensearch:totalResults'],
      itemsPerPage: apiResponse['opensearch:itemsPerPage'],
      startIndex: apiResponse['opensearch:startIndex'],
      matches: albums,
    };
  }

  public transformArtist(apiResponse: any): Artist {
    const { name, mbid, image, bio, listeners, album } = apiResponse;

    return {
      name,
      mbid,
      image,
      bio,
      listeners,
      albums: album
        .map(a => ({
          name: a.name,
          playCount: a.playCount,
          mbid: a.mbid,
          image: a.image.map(img => ({
            url: img['#text'],
            size: img.size,
          })),
        }))
        .filter(a => Boolean(a.mbid)),
    };
  }

  public transformAlbum(apiResponse: any): Album {
    const { name, artist, mbid, releaseDate, playCount, topTags, tracks, wiki, listeners } = apiResponse;

    return {
      name,
      artist,
      mbid,
      image: apiResponse.image.map(img => ({
        url: img['#text'],
        size: img.size,
      })),
      releaseDate,
      playCount,
      topTags,
      wiki,
      tracks,
      listeners,
    };
  }
}
