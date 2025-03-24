import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
export class TableQueryParams {
  @ApiProperty({ description: '页码' })
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '每页条数' })
  limit?: number = 10;
}

export class TableResponse {
  @ApiProperty({ description: '当前页码' })
  page: number;
  @ApiProperty({ description: '每页条数' })
  limit: number;
  @ApiProperty({ description: '总条数' })
  total: number;
}
