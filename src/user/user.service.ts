import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EditUserDto } from './dto'

@Injectable()
export class UserService {
   constructor(private prisma: PrismaService) {}

   async editUser(dto: EditUserDto, userid: number) {
      const user = await this.prisma.user.update({
         where: { id: userid },
         data: { ...dto },
      })

      delete user.passwordHash

      return user
   }
}
