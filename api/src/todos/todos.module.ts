import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UsersModule],
  providers: [TodosService],
  controllers: [TodosController],
})
export class TodosModule {}
