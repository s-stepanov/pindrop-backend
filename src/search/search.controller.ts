import { Controller, Get, Query, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('search')
@ApiBearerAuth()
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('artists')
  public async getArtists(
    @Query('term') term: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.searchService.searchArtists(term, page, limit);
  }

  @Get('albums')
  public async getAlbums(
    @Query('term') term: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ) {
    return this.searchService.searchAlbums(term, page, limit);
  }

  @Get('artists/:mbid')
  public async getArtistByMbid(@Param('mbid') mbid: string) {
    return this.searchService.searchArtistInfo(mbid);
  }

  @Get('albums/:mbid')
  public async getAlbumByMbid(@Param('mbid') mbid: string) {
    return this.searchService.searchAlbumInfo(mbid);
  }
}
