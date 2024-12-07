import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { IS_DEV_ENV } from '@/libs/common/is-dev-env'

@Module({
  imports: [
      ConfigModule.forRoot({

        isGlobal: true,
        ignoreEnvFile: !IS_DEV_ENV
      })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
