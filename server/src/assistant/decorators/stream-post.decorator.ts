import { Response } from 'express';
import { Post } from '@nestjs/common';

export const StreamPost = (path: string) => {
    const postDecorator = Post(path);
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        postDecorator(target, propertyKey, descriptor);
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const ctx = args[args.length - 1].switchToHttp();
            const response: Response = ctx.getResponse();

            response.setHeader('Content-Type', 'text/event-stream');
            response.setHeader('Cache-Control', 'no-cache');
            response.setHeader('Connection', 'keep-alive');

            try {
                const stream = await originalMethod.apply(this, args);
                stream.subscribe({
                    next: (data) => {
                        response.write(`data: ${JSON.stringify(data)}\n\n`);
                    },
                    error: (error) => {
                        console.error('Stream error:', error);
                        response.end();
                    },
                    complete: () => {
                        response.end();
                    }
                });
            } catch (error) {
                console.error('Stream error:', error);
                response.end();
            }
        };

        return descriptor;
    };
};