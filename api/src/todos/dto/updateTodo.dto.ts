import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TodoStatus } from '../todo.entity';

export class updateTodo {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  time: string;

  @IsOptional()
  @IsEnum(TodoStatus)
  status: TodoStatus;
}
