import { Injectable } from '@nestjs/common';
import { CreateUserSearchDto } from './dto/create-user-search.dto';
import { UpdateUserSearchDto } from './dto/update-user-search.dto';
import { PrismaService } from '../core/services/prisma.service';

@Injectable()
export class UserSearchService {
  constructor(private readonly prisma: PrismaService) {}
}
