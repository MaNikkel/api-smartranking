import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { UpdatePlayerDto } from './dtos/updatePlayer.dto';
import { Player } from './interfaces/player.interface';
import { ParamsValidationPipe } from '../common/pipes/paramsValidation.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    const player = await this.playersService.createPlayer(createPlayerDto);
    return player;
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('id', ParamsValidationPipe) id: string,
  ) {
    const player = await this.playersService.updatePlayer(id, updatePlayerDto);
    return player;
  }

  @Get()
  async getPlayers(): Promise<Player[]> {
    return await this.playersService.getPlayers();
  }

  @Get(':id')
  async getPlayerById(
    @Param('id', ParamsValidationPipe) id: string,
  ): Promise<Player> {
    return await this.playersService.getPlayerById(id);
  }

  @Delete()
  async deletePlayer(
    @Query('email', ParamsValidationPipe) email: string,
  ): Promise<void> {
    this.playersService.deletePlayerByEmail(email);
  }
}
