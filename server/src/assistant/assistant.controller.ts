import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { DeepSeekService } from './deepseek.service';
import { Sse, MessageEvent } from '@nestjs/common';
import { map } from 'rxjs';

@Controller('assistant')
export class AssistantController {
  constructor(
    private readonly deepSeekService: DeepSeekService,
  ) { }

  @Post('/deepseek')
  async chat(@Body('message') message: string) {
    const response = await this.deepSeekService.createChatCompletion(message);
    return { content: response };
  }
  @Post('/stream')
  @Sse()
  stream(@Body('message') message: string) {
    return this.deepSeekService.streamChatCompletion(message)
  }
}
