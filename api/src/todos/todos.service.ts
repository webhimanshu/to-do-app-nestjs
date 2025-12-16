import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo, TodoStatus } from './todo.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { TodoDto } from './dto/todo.dto';
import { UsersService } from 'src/users/users.service';
import { updateTodo } from './dto/updateTodo.dto';
import { TODOS } from './helper';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private toDoRepo: Repository<Todo>,
    private readonly userServices: UsersService,
  ) {}
  async createTodos(body: TodoDto, userId: string) {
    if (!userId) {
      throw new HttpException(
        'user id not availble',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const user = await this.userServices.findById(userId);
    if (!user) {
      throw new NotFoundException('NotFoundException');
    }
    const { name, description, time, status } = body;
    try {
      const todo = this.toDoRepo.create({
        name,
        description,
        time,
        status,
        user: { id: userId } as User,
      });
      const saved = await this.toDoRepo.save(todo);
      return saved;
    } catch {
      throw new HttpException(
        'Failed to create todo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllTodos() {
    try {
      const todos = await this.toDoRepo.find();
      return todos;
    } catch {
      throw new HttpException(
        'Failed to fetch todo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTodo(userId: string, id: string) {
    try {
      const result = await this.toDoRepo.delete({
        id,
        user: { id: userId } as User,
      });
      return result;
    } catch {
      throw new HttpException(
        'Failed to delete todo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTodo(body: updateTodo, userId: string, id: string) {
    const { name, description, time, status } = body;

    try {
      const todo = await this.toDoRepo.findOne({
        where: { id, user: { id: userId } },
        relations: ['user'],
      });

      if (!todo) {
        throw new NotFoundException('Todo not found or does not belong to you');
      }

      if (name !== undefined) todo.name = name;
      if (description !== undefined) todo.description = description;
      if (time !== undefined) todo.time = time;
      if (status !== undefined) todo.status = status;

      const updated = await this.toDoRepo.save(todo);
      return updated;
    } catch {
      throw new HttpException(
        'Failed to update todo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMany(userId: string) {
    try {
      const entities = TODOS.map((item) => {
        let status: TodoStatus = TodoStatus.IN_PROGRESS;
        if (item.status === 'IN_PROGRESS') {
          status = TodoStatus.IN_PROGRESS;
        } else if (item.status === 'COMPLETED') {
          status = TodoStatus.COMPLETED;
        } else if (item.status === 'PENDING') {
          status = TodoStatus.IN_PROGRESS;
        }

        return this.toDoRepo.create({
          name: item.name,
          description: item.description,
          time: item.time,
          status,
          user: { id: userId } as User,
        });
      });
      const saved = await this.toDoRepo.save(entities);
      return saved;
    } catch {
      throw new HttpException(
        'Failed to perform bulk insert',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async pagination(userId: string, offset?: string, limit?: string) {
    try {
      const skip = offset ? parseInt(offset, 10) : 0;
      const take = limit ? parseInt(limit, 10) : 10;

      const [todos, total] = await this.toDoRepo.findAndCount({
        where: { user: { id: userId } },
        skip,
        take,
        order: { createdAt: 'DESC' },
      });

      return {
        todos,
        total,
        offset: skip,
        limit: take,
      };
    } catch {
      throw new HttpException(
        'Failed to fetch todos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async pagePagination(userId: string, page: string, limit: string) {
    const skip = page ? parseInt(page, 10) : 1;
    const take = limit ? parseInt(limit, 10) : 10;
    const offset = (skip - 1) * take;

    const [todos, total] = await this.toDoRepo.findAndCount({
      where: { user: { id: userId } },
      skip: offset,
      take,
      order: { createdAt: 'DESC' },
    });
    return {
      todos,
      offset,
      limit: take,
      total,
    };
  }
}
