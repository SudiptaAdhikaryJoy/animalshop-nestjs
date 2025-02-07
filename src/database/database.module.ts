import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { initDatabase } from './database.config';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    {
      provide: 'DRIZZLE_DB',
      useFactory: async () => {
        return await initDatabase();
      },
    },
  ],
  exports: ['DRIZZLE_DB'],
})
export class DatabaseModule {}
