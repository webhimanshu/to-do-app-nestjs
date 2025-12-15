import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TodoStatus } from '../todo.entity';

export class TodoDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  time: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  status: TodoStatus;
}
