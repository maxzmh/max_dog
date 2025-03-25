import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message, MessageRole } from './entities/message.entity';
import { ModelConfig } from './entities/model-config.entity';
import OpenAI from 'openai';

@Injectable()
export class AssistantService {
    constructor(
        @InjectRepository(Conversation)
        private readonly conversationRepository: Repository<Conversation>,
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(ModelConfig)
        private readonly modelConfigRepository: Repository<ModelConfig>,
    ) { }

    async createConversation(title: string) {
        const conversation = this.conversationRepository.create({ title });
        return await this.conversationRepository.save(conversation);
    }

    async getConversation(id: string) {
        return await this.conversationRepository.findOne({
            where: { id },
            relations: ['messages'],
        });
    }

    async listConversations() {
        return await this.conversationRepository.find({
            where: { isActive: true },
            order: { updatedAt: 'DESC' },
        });
    }

    async addMessage(conversationId: string, role: MessageRole, content: string) {
        const conversation = await this.getConversation(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const message = this.messageRepository.create({
            role,
            content,
            conversation,
        });

        return await this.messageRepository.save(message);
    }

    async getActiveModelConfig() {
        return await this.modelConfigRepository.findOne({
            where: { isActive: true },
        });
    }

    async updateModelConfig(id: string, config: Partial<ModelConfig>) {
        await this.modelConfigRepository.update(id, config);
        return await this.modelConfigRepository.findOne({ where: { id } });
    }

    getStreamResponse(content: string, modelConfig: ModelConfig) {
        return 'dafdsa'
    }
}