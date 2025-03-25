import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitModelConfig1703731200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO model_config (
                id,
                name,
                provider,
                model_name,
                config,
                is_active,
                description,
                created_at,
                updated_at
            ) VALUES (
                uuid(),
                'OpenAI GPT-3.5',
                'openai',
                'gpt-3.5-turbo',
                '{"apiKey":"YOUR_API_KEY","baseUrl":"https://api.openai.com/v1"}',
                true,
                'OpenAI GPT-3.5 Turbo 默认配置',
                NOW(),
                NOW()
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM model_config
            WHERE provider = 'openai' AND model_name = 'gpt-3.5-turbo';
        `);
    }
}