import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { ModelConfig } from './entities/model-config.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Conversation, Message, ModelConfig])],
    controllers: [AssistantController],
    providers: [AssistantService],
    exports: [AssistantService],
})
export class AssistantModule { }