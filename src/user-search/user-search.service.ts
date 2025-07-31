import { Injectable } from '@nestjs/common';
import { CreateUserSearchDto } from './dto/create-user-search.dto';
import { UpdateUserSearchDto } from './dto/update-user-search.dto';

@Injectable()
export class UserSearchService {
  create(createUserSearchDto: CreateUserSearchDto) {
    return 'This action adds a new userSearch';
  }

  findAll() {
    return `This action returns all userSearch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSearch`;
  }

  update(id: number, updateUserSearchDto: UpdateUserSearchDto) {
    return `This action updates a #${id} userSearch`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSearch`;
  }
}
