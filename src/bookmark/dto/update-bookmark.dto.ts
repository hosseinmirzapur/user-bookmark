import { CreateBookmarkDto } from './create-bookmark.dto'
import { PartialType } from '@nestjs/mapped-types'

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {}
