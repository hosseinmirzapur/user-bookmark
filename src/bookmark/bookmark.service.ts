import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto'

@Injectable()
export class BookmarkService {
   constructor(private prisma: PrismaService) {}

   async getBookmarks(userId: number) {
      return this.prisma.bookmark.findMany({
         where: { userId },
      })
   }

   async createBookmark(dto: CreateBookmarkDto, userId: number) {
      const bookmark = await this.prisma.bookmark.create({
         data: { userId, ...dto },
      })
      return bookmark
   }

   async getBookmarkById(id: number) {
      return this.prisma.bookmark.findUnique({
         where: { id },
      })
   }

   async updateBookmarkById(id: number, dto: UpdateBookmarkDto) {
      return this.prisma.bookmark.update({
         where: { id },
         data: { ...dto },
      })
   }

   async deleteBookmarkById(id: number) {
      try {
         const bookmark = await this.prisma.bookmark.findUnique({
            where: {
               id,
            },
         })

         return this.prisma.bookmark.delete({
            where: { id: bookmark.id },
         })
      } catch (error) {
         throw new BadRequestException('bookmark was not found/deleted')
      }
   }
}
