import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'

import * as pactum from 'pactum'
import { AuthDto } from '../src/auth/dto'
import { EditUserDto } from 'src/user/dto'
import { CreateBookmarkDto } from 'src/bookmark/dto'

describe('App e2e', () => {
   let app: INestApplication
   let prisma: PrismaService

   beforeAll(async () => {
      const moduleRef = await Test.createTestingModule({
         imports: [AppModule],
      }).compile()

      app = moduleRef.createNestApplication()
      app.useGlobalPipes(
         new ValidationPipe({
            whitelist: true,
         }),
      )

      await app.init()
      await app.listen(3333)

      pactum.request.setBaseUrl('http://localhost:3333')

      prisma = app.get(PrismaService)

      await prisma.cleanDb()
   })

   afterAll(async () => {
      await app.close()
   })

   describe('Auth', () => {
      describe('Signup', () => {
         it('should signup', () => {
            const dto: AuthDto = {
               email: 'admin@gmail.com',
               password: '12345678',
            }
            return pactum
               .spec()
               .post('/auth/signup')
               .withBody(dto)
               .expectStatus(201)
         })
      })
      describe('Signin', () => {
         it('should signin', () => {
            const dto: AuthDto = {
               email: 'admin@gmail.com',
               password: '12345678',
            }

            return pactum
               .spec()
               .post('/auth/signin')
               .withBody(dto)
               .expectStatus(200)
               .stores('userAT', 'token')
         })
      })
   })

   describe('User', () => {
      describe('Get me', () => {
         it('should get current user', () => {
            return pactum
               .spec()
               .get('/user/me')
               .withHeaders({
                  Authorization: 'Bearer $S{userAT}',
               })
               .expectStatus(200)
         })
      })
      describe('Edit me', () => {
         it('should edit request user', () => {
            const data: EditUserDto = {
               firstName: 'hossein',
               email: 'hossein@gmail.com',
               lastName: 'mirzayi',
            }
            return pactum
               .spec()
               .patch('/user/edit')
               .withHeaders({
                  Authorization: 'Bearer $S{userAT}',
               })
               .withBody(data)
               .expectStatus(200)
               .expectBodyContains(data.firstName)
               .expectBodyContains(data.lastName)
               .expectBodyContains(data.email)
         })
      })
   })
   describe('Bookmarks', () => {
      describe('Get bookmarks', () => {
         it('should get bookmarks', () => {
            return pactum
               .spec()
               .get('/bookmark')
               .withHeaders({
                  Authorization: 'Bearer $S{userAT}',
               })
               .expectStatus(200)
               .expectBody([])
         })
      })

      // describe('Create bookmark', () => {
      //    it('should create bookmark', () => {
      //       const dto: CreateBookmarkDto = {
      //          link: 'http://something.com',
      //          title: 'something title',
      //          description: 'something description',
      //       }
      //       return pactum
      //          .spec()
      //          .post('/bookmark')
      //          .withHeaders({
      //             Authorization: 'Bearer $S{userAT}',
      //          })
      //          .withBody(dto)
      //          .expectStatus(201)
      //    })
      // })
      // describe('Get bookmark by id', () => {})
      // describe('Edit bookmark', () => {})
      // describe('Delete bookmark', () => {})
   })

   it.todo('should pass')
})
