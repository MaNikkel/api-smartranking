import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017', {
      useNewUrlParser: true,
      dbName: 'smartranking',
      auth: {
        username: 'root',
        password: 'mongo',
      },
    }),
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
