import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AssistantController } from './assistant.controller';
import { DeepSeekService } from './deepseek.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forFeature(() => ({})),
    HttpModule
  ],
  controllers: [AssistantController],
  providers: [DeepSeekService],
  exports: [DeepSeekService]
})
export class AssistantModule { }
