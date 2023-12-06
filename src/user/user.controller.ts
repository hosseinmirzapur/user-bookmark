import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { JwtGuard } from '../auth/guard'
import { GetUser } from '../auth/decorator'
import { User } from '@prisma/client'
import { UserService } from './user.service'
import { EditUserDto } from './dto'

@Controller('user')
export class UserController {
   constructor(private readonly service: UserService) {}

   @UseGuards(JwtGuard)
   @Get('me')
   getMe(@GetUser() user: User) {
      return {
         user,
      }
   }

   @UseGuards(JwtGuard)
   @Patch('edit')
   async editUser(@Body() dto: EditUserDto, @GetUser('id') id: number) {
      return this.service.editUser(dto, id)
   }
}
