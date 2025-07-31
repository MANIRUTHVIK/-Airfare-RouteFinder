import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSearchDto } from './create-user-search.dto';

export class UpdateUserSearchDto extends PartialType(CreateUserSearchDto) {}
