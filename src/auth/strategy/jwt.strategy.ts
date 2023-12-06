import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { User } from '@prisma/client'

import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../prisma/prisma.service'

interface JwtUser {
   sub: number
   email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      config: ConfigService,
      private prisma: PrismaService,
   ) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: config.get('JWT_SECRET'),
      })
   }

   // this function is going to fill the request "user" object
   async validate(payload: JwtUser): Promise<User> {
      const user = await this.prisma.user.findUnique({
         where: { id: payload.sub, email: payload.email },
      })

      return user
   }
}
