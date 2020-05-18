import { Module, HttpModule } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
