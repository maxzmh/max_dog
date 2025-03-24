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

    streamChatCompletion(message: string): Observable<string> {
        return from(
            this.openai.chat.completions.create({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: message }],
                stream: true
            })
        ).pipe(
            mergeMap(stream => stream),
            map(chunk => chunk.choices[0]?.delta?.content || '')
        );
    }
}
