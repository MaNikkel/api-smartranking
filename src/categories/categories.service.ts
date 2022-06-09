import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from 'src/players/interfaces/player.interface';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryByName(createCategoryDto.category);

    if (category) {
      throw new BadRequestException(
        `Category ${createCategoryDto.category} already exists`,
      );
    }
    return await this.create(createCategoryDto);
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryById(id);

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return await this.update(category, updateCategoryDto);
  }

  async addPlayerToCategory(
    categoryId: string,
    playerId: string,
  ): Promise<Category> {
    const category = await this.getCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(`Category with id ${categoryId} not found`);
    }

    const player = await this.playersService.getPlayerById(playerId);

    const playerIsInCategory = await this.verifyIfPlayerIsInCategory(
      category,
      player,
    );

    if (playerIsInCategory) {
      throw new BadRequestException(
        `Player with id ${playerId} is already in category with id ${category._id}`,
      );
    }

    category.players.push(player);

    await this.categoryModel
      .findOneAndUpdate({ _id: category._id }, { $set: category })
      .populate('players')
      .exec();

    return category;
  }

  async getCategories(): Promise<Category[]> {
    const categories = await this.categoryModel.find().exec();

    return categories;
  }

  async getCategory(id: string): Promise<Category> {
    const category = await this.getCategoryById(id);

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async deleteCategory(id: string) {
    return await this.categoryModel.findByIdAndRemove(id).exec();
  }

  private async verifyIfPlayerIsInCategory(category: Category, player: Player) {
    const isInCategory = category.players.find(
      (p) => p._id.toString() === player._id.toString(),
    );

    if (!isInCategory) {
      return false;
    }

    return true;
  }

  private async create(createCategoryDto: CreateCategoryDto) {
    const category = await (
      await this.categoryModel.create(createCategoryDto)
    ).save();

    return category;
  }

  private async getCategoryById(id: string): Promise<Category> {
    return await this.categoryModel.findById(id).exec();
  }

  private async update(
    category: Category,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updated = await this.categoryModel
      .findOneAndUpdate({ _id: category._id }, updateCategoryDto, { new: true })
      .exec();

    return updated;
  }

  private async getCategoryByName(name: string) {
    const category = await this.categoryModel
      .findOne({ category: name })
      .exec();

    return category;
  }
}
