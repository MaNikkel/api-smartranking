import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { Category } from './interfaces/category.interface';
import { CategoriesIdParamValidationPipe } from './pipes/categoriesParamsValidation.pipe';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoriesService.createCategory(
      createCategoryDto,
    );

    return category;
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Param('id', CategoriesIdParamValidationPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Get()
  async getCategories(): Promise<Category[]> {
    return await this.categoriesService.getCategories();
  }

  @Get(':id')
  async getCategoryById(
    @Param('id', CategoriesIdParamValidationPipe) id: string,
  ): Promise<Category> {
    return await this.categoriesService.getCategory(id);
  }

  @Delete(':id')
  async deleteCategory(
    @Param('id', CategoriesIdParamValidationPipe) id: string,
  ): Promise<void> {
    await this.categoriesService.deleteCategory(id);
  }

  @Post('/:categoryId/player/:playerId')
  async addPlayerToCategory(
    @Param('categoryId', CategoriesIdParamValidationPipe) categoryId: string,
    @Param('playerId', CategoriesIdParamValidationPipe) playerId: string,
  ) {
    return await this.categoriesService.addPlayerToCategory(
      categoryId,
      playerId,
    );
  }
}
