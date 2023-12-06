import {
   BadRequestException,
   Body,
   Controller,
   Delete,
   Get,
   Param,
   ParseIntPipe,
   Patch,
   Post,
   UseGuards,
} from '@nestjs/common'
import { JwtGuard } from '../auth/guard'
import { BookmarkService } from './bookmark.service'
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto'
import { GetUser } from '../auth/decorator'
import { User } from '@prisma/client'

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
   constructor(private readonly service: BookmarkService) {}

   @Get()
   async getBookmarks(@GetUser('id') userId: number) {
      return this.service.getBookmarks(userId)
   }

   @Post()
   async createBookmark(
      @GetUser('id') userId: number,
      @Body() dto: CreateBookmarkDto,
   ) {
      return this.service.createBookmark(dto, userId)
   }

   @Get(':id')
   async getBookmarkById(@Param('id', ParseIntPipe) id: number) {
      return this.service.getBookmarkById(id)
   }

   @Patch(':id')
   async updateBookmarkById(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateBookmarkDto,
   ) {
      return this.service.updateBookmarkById(id, dto)
   }

   @Delete(':id')
   async deleteBookmarkById(@Param('id', ParseIntPipe) id: number) {
      return this.service.deleteBookmarkById(id)
   }
}
