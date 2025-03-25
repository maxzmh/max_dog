import { Injectable } from '@nestjs/common';
import OpenAI from "openai";
import { ConfigService } from '@nestjs/config';
import { from, map, mergeMap, Observable } from 'rxjs';

@Injectable()
export class DeepSeekService {
    private openai: OpenAI;
    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: this.configService.get('DEEPSEEK_API_KEY')
        });
    }

    async createChatCompletion(message: string): Promise<string> {
        const completion = await this.openai.chat.completions.create({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: message }],
        });

        return completion.choices[0].message.content;
    }

    async streamChatCompletion(message: string) {
        const response = await this.openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }], // 消息数组，包含一个用户角色和内容
            model: 'deepseek-chat', // 使用的模型名称
            stream: true, // 开启流式响应
        });
        return from(response).pipe(
            map((part) => part),
        );
    }
}
