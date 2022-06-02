import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { Player } from './interfaces/player.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  async createOrUpdatePlayer(
    createPlayerDto: CreatePlayerDto,
  ): Promise<Player> {
    const { email } = createPlayerDto;

    const player = this.players.find((p) => p.email === email);

    if (player) {
      const updatedPlayer = await this.update(player, createPlayerDto);

      Object.assign(player, updatedPlayer);

      return player;
    }

    const newPlayer = await this.create(createPlayerDto);

    return newPlayer;
  }

  async getPlayers(): Promise<Player[]> {
    return this.players;
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const player = this.players.find((p) => p.email === email);
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
    return { ...player, ...createPlayerDto };
  }

  private async delete(email: string): Promise<void> {
    this.players = this.players.filter((p) => p.email !== email);
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email, name, phoneNumber } = createPlayerDto;

    const player: Player = {
      _id: uuid(),
      name,
      phoneNumber,
      email,
      ranking: 'A',
      rankingPosition: 0,
      imageUrl: '',
    };

    this.players.push(player);

    return player;
  }
}
