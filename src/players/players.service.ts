import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async createOrUpdatePlayer(
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    const { email } = createPlayerDto;

    const player = await this.playerModel.findOne({ email });

    if (player) {
      await this.update(player, createPlayerDto);

      return player;
    }

    const newPlayer = await this.create(createPlayerDto);

    return newPlayer;
  }

  async getPlayers(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const player = await this.playerModel.findOne({ email }).exec();
    if (!player) {
      throw new NotFoundException(`Player with email ${email} not found`);
    }

    return player;
  }

  async deletePlayerByEmail(email: string): Promise<void> {
    return await this.delete(email);
  }

  private async update(
    player: Player,
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    await player.update(createPlayerDto);

    return player;
  }

  private async delete(email: string): Promise<void> {
    await this.playerModel.deleteOne({ email });
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = await this.playerModel.create(createPlayerDto);
    await player.save();

    return player;
  }
}
