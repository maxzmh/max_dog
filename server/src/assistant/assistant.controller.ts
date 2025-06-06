import { Controller, Get, Post, Body, Param, Res, HttpStatus, HttpException, Sse, Query } from '@nestjs/common';
import { from, map, Observable, tap } from 'rxjs';
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
    // 修改会话名称
    @Post('conversations/:id')
    @ApiOperation({ summary: '修改会话名称' })
    async updateConversationTitle(@Param('id') id: string, @Query('title') title: string) {
        return await this.assistantService.updateConversationTitle(id, title);
    }

    @Post('conversations/:id/delete')
    @ApiOperation({ summary: '删除会话' })
    async deleteConversation(@Param('id') id: string) {
        return await this.assistantService.deleteConversation(id);
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
    @Sse()
    @ApiOperation({ summary: '流式输出' })
    async streamResponse(
        @Param('id') id: string,
        @Body('content') content: string,
    ) {
        try {
            // 保存用户消息
            await this.assistantService.addMessage(id, MessageRole.USER, content);

            // 获取当前活跃的模型配置
            const modelConfig = await this.assistantService.getActiveModelConfig();

            // 获取流式输出
            let fullResponse = '';
            const stream = await this.assistantService.getStreamResponseGenerator(id, content, modelConfig);
            // const res: string[] = [];
            return from(stream).pipe(
                map((part, i) => {
                    const content = part.choices[0].delta?.content || '';
                    // res.push(content);
                    fullResponse += content;
                    return { content };
                }),
                tap({
                    complete: async () => {
                        if (fullResponse) {
                            await this.assistantService.addMessage(id, MessageRole.ASSISTANT, fullResponse);
                        }
                    }
                })
            );
        } catch (error) {
            console.error('Failed to process message:', error);
        }
    }
}