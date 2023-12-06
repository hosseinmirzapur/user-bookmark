import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { PrismaService } from '../prisma/prisma.service'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import { AuthDto } from './dto'
import * as argon from 'argon2'

@Injectable()
export class AuthService {
   constructor(
      private prisma: PrismaService,
      private jwt: JwtService,
      private config: ConfigService,
   ) {}

   async signup(dto: AuthDto) {
      const hash = await argon.hash(dto.password)

      try {
         const user = await this.prisma.user.create({
            data: {
               email: dto.email,
               passwordHash: hash,
            },
         })

         return {
            token: await this.signToken(user.id, user.email),
         }
      } catch (error) {
         if (error instanceof PrismaClientKnownRequestError) {
            throw new ForbiddenException(
               'cannot create a user which already exists',
            )
         }
      }
   }

   async signin(dto: AuthDto) {
      const user = await this.prisma.user.findUnique({
         where: {
            email: dto.email,
         },
      })
      if (!user) {
         throw new ForbiddenException('wrong credentials')
      }

      const hashMatches = await argon.verify(user.passwordHash, dto.password)
      if (!hashMatches) {
         throw new ForbiddenException('wrong credentials')
      }

      return {
         token: await this.signToken(user.id, user.email),
      }
   }

   signToken(userId: number, email: string): Promise<string> {
      const payload = {
         sub: userId,
         email,
      }
      return this.jwt.signAsync(payload, {
         expiresIn: '15m',
         secret: this.config.get('JWT_SECRET'),
      })
   }
}
