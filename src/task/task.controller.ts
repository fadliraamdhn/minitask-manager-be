import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UsePipes, ValidationPipe, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import type { Request } from 'express';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @Req() req: Request) {
    const userId = req.user.id

    const task = await this.taskService.create(
      dto.title,
      dto.description,
      userId,
    );

    return {
      status: 'success',
      code: 201,
      message: 'Task created successfully',
      data: task,
    };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskDto, @Req() req: Request) {
    const userId = req.user.id

    const updateTask = await this.taskService.update(
      id,
      dto,
      userId
    )

    return {
      status: 'success',
      code: 200,
      message: 'Task updated successfully',
      data: updateTask,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId =req.user.id

    const deleted = await this.taskService.remove(
      id,
      userId
    )

    return {
      status: 'success',
      code: 200,
      message: 'Task deleted successfully',
      data: deleted,
    };
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    @Query('search') search?: string
  ) {
    const userId = req.user.id

    const result = await this.taskService.findAll(userId, page, limit, search)

    return {
      status: 'success',
      code: 200,
      message: 'Task list fetched',
      data: result,
    };
  }
}
