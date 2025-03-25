import { Controller, Get, Post, Body, Param, Sse, HttpStatus, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AssistantService } from './assistant.service';
import { MessageRole } from './entities/message.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Assistant')
@Controller('assistant')
export class AssistantController {
    constructor(private readonly assistantService: AssistantService) { }

    @Post('conversations')
    @ApiOperation({ summary: '创建会话' })
    async createConversation(@Body('title') title: string) {
        return await this.assistantService.createConversation(title);
    }

    @Get('conversations')
    @ApiOperation({ summary: '获取会话列表' })
    async listConversations() {
        return await this.assistantService.listConversations();
    }

    @Get('conversations/:id')
    @ApiOperation({ summary: '根据id获取会话消息' })
    async getConversation(@Param('id') id: string) {
        const conversation = await this.assistantService.getConversation(id);
        if (!conversation) {
            throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);
        }
        return conversation;
    }

    @Post('conversations/:id/messages')
    @ApiOperation({ summary: '添加会话消息' })
    async addMessage(
        @Param('id') id: string,
        @Body('content') content: string,
    ) {
        try {
            // 保存用户消息
            await this.assistantService.addMessage(id, MessageRole.USER, content);

            // 获取当前活跃的模型配置
            const modelConfig = await this.assistantService.getActiveModelConfig();
            if (!modelConfig) {
                throw new HttpException('No active model configuration found', HttpStatus.NOT_FOUND);
            }
            const aiResponse = await this.assistantService.getStreamResponse(content, modelConfig);
            return await this.assistantService.addMessage(id, MessageRole.ASSISTANT, aiResponse);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to process message', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Sse('conversations/:id/stream')
    @ApiOperation({ summary: '流式输出' })
    streamResponse(@Param('id') id: string): Observable<MessageEvent> {
        // TODO: 实现 SSE 流式输出
        return new Observable((subscriber) => {
            // 示例：每秒发送一条消息
            const interval = setInterval(() => {
                subscriber.next({ data: { message: 'Streaming response...' } } as MessageEvent);
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        });
    }
}