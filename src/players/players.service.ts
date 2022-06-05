import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDto } from './dtos/updatePlayer.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async updatePlayer(
    id: string,
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    const player = await this.playerModel.findById(id).exec();

    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    return await this.update(player, createPlayerDto);
  }

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = await this.getPlayerByEmail(createPlayerDto.email);

    if (player) {
      throw new BadRequestException(
        `Player with email ${createPlayerDto.email} already exists`,
      );
    }

    return await this.create(createPlayerDto);
  }

  async getPlayers(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();

    return player;
  }

  async getPlayerById(id: string): Promise<Player> {
    const player = await this.playerModel.findById(id).exec();
    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }

    return player;
  }

  async deletePlayerByEmail(email: string): Promise<void> {
    const player = await this.getPlayerByEmail(email);
    if (!player) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }

    return await this.delete(email);
  }

  private async update(
    player: Player,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const updated = await this.playerModel
      .findOneAndUpdate({ _id: player._id }, updatePlayerDto, { new: true })
      .exec();

    return updated;
  }

  private async delete(email: string): Promise<void> {
    const player = await this.getPlayerByEmail(email);

    if (!player) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }

    await this.playerModel.deleteOne({ email });
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = await this.playerModel.create(createPlayerDto);
    await player.save();

    return player;
  }
}
