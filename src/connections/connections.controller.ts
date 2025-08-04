import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Connections')
@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @ApiOperation({ summary: 'Create a new connection' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateConnectionDto })
  @ApiResponse({ status: 201, description: 'Connection created successfully' })
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createConnectionDto: CreateConnectionDto) {
    return this.connectionsService.create(createConnectionDto);
  }

  @ApiOperation({ summary: 'Get all connections' })
  @ApiResponse({ status: 200, description: 'List of all connections' })
  @Get()
  findAll() {
    return this.connectionsService.findAll();
  }

  @ApiOperation({ summary: 'Update a connection by ID' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateConnectionDto })
  @ApiResponse({ status: 200, description: 'Connection updated successfully' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateConnectionDto: UpdateConnectionDto,
  ) {
    return this.connectionsService.update(id, updateConnectionDto);
  }

  @ApiOperation({ summary: 'Delete a connection by ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Connection deleted successfully' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.connectionsService.remove(id);
  }
}
