import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ModelConfig {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 100 })
    provider: string;

    @Column({ length: 100 })
    modelName: string;

    @Column({ length: 500, nullable: true })
    apiKey: string;

    @Column({ length: 500, nullable: true })
    baseUrl: string;

    @Column({ type: 'json', nullable: true })
    config: Record<string, any>;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}