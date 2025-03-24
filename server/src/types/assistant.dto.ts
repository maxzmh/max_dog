export type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export interface ChatCompletionRequest {
    model: string;
    messages: Message[];
    temperature?: number;
    max_tokens?: number;
}

export interface ChatCompletionResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}