import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TodosService } from './todos.service';
import { TodoDto } from './dto/todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { updateTodo } from './dto/updateTodo.dto';

type AuthRequest = Request & {
  user: {
    userId: string;
    email: string;
  };
};

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todoService: TodosService) {}
  @Post()
  async createTodods(@Req() req: AuthRequest, @Body() body: TodoDto) {
    const result = await this.todoService.createTodos(body, req.user.userId);
    return { success: true, data: result };
  }

  @Get()
  async getTodos(
    @Req() req: AuthRequest,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user.userId;

    if (offset || limit) {
      const result = await this.todoService.pagination(userId, offset, limit);
      return { success: true, data: result };
    }

    const result = await this.todoService.getAllTodos();
    return { success: true, data: result };
  }

  @Delete(':id')
  async deleteTodo(@Req() req: AuthRequest, @Param('id') id: string) {
    const userId = req.user.userId;
    const result = await this.todoService.deleteTodo(userId, id);
    return { success: true, data: result };
  }

  @Put(':id')
  async updateTodo(
    @Req() req: AuthRequest,
    @Body() body: updateTodo,
    @Param('id') id: string,
  ) {
    const userId = req.user.userId;
    const result = await this.todoService.updateTodo(body, userId, id);
    return { success: true, data: result };
  }

  @Post('bulk')
  async createMany(@Req() req: AuthRequest) {
    const userId = req.user.userId;
    const result = await this.todoService.createMany(userId);
    return { success: true, data: result };
  }

  @Get('/paginated')
  async paginated(
    @Req() req: AuthRequest,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const userId = req.user.userId;
    const result = await this.todoService.pagePagination(userId, page, limit);
    return { success: true, data: result };
  }
}
