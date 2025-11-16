import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateExampleValidationDto,
  UpdateExampleValidationDto,
  ExampleQueryParamsValidationDto,
} from './example.validation';
import { ExampleServiceImpl } from './example.service-impl';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleServiceImpl) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDto: CreateExampleValidationDto) {
    return this.exampleService.create(createDto);
  }

  @Get()
  async findAll(@Query() query: ExampleQueryParamsValidationDto) {
    return this.exampleService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.exampleService.findById(id);
    if (!result) {
      throw new NotFoundException(`Example with ID ${id} not found`);
    }
    return result;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExampleValidationDto,
  ) {
    return this.exampleService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.exampleService.delete(id);
  }
}
