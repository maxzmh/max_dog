import { Controller, Get, Post, Body, Param, Res, HttpStatus, HttpException } from '@nestjs/common';
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
            const aiResponse = await this.assistantService.getStreamResponse(id, content, modelConfig);
            return await this.assistantService.addMessage(id, MessageRole.ASSISTANT, aiResponse);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException('Failed to process message', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @Post('/conversations/:id/stream')
    @ApiOperation({ summary: '流式输出' })
    async streamResponse(
        @Param('id') id: string,
        @Body('content') content: string,
        @Res() response: any,
    ) {
        // 设置 SSE 响应头
        response.setHeader('Content-Type', 'text/event-stream');
        response.setHeader('Cache-Control', 'no-cache');
        response.setHeader('Connection', 'keep-alive');
        
        try {
            // 保存用户消息
            await this.assistantService.addMessage(id, MessageRole.USER, content);
                    
            // 获取当前活跃的模型配置
            const modelConfig = await this.assistantService.getActiveModelConfig();
            if (!modelConfig) {
                response.status(HttpStatus.NOT_FOUND).send({ message: 'No active model configuration found' });
                return;
            }
                    
            // 获取流式输出
            let fullResponse = '';
            const stream = await this.assistantService.getStreamResponseGenerator(id, content, modelConfig);
            
            for await (const chunk of stream) {
                fullResponse += chunk;
                // 手动写入 SSE 格式数据
                response.write(`data: ${JSON.stringify({ message: chunk })}\n\n`);
            }
            
            // 保存AI完整消息
            await this.assistantService.addMessage(id, MessageRole.ASSISTANT, fullResponse);
            
            // 结束响应
            response.end();
        } catch (error) {
            console.error('Failed to process message:', error);
            if (error instanceof HttpException) {
                response.status(error.getStatus()).send({ message: error.message });
            } else {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: 'Failed to process message' });
            }
        }
    }
}