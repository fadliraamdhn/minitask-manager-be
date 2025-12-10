import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService
  ) {}

  async create(title: string, description: string, user_id: number) {
    const newTask = await this.prisma.tasks.create({
      data: {
        title,
        description,
        user_id
      }
    })

    return newTask
  }

  async findAll(user_id: number, page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit

    let where: Prisma.tasksWhereInput = {
      user_id
    }

    if (search) {
      where = {
        ...where,
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: 'insensitive'} }
        ]
      }
    }

    const [tasks, total] = await Promise.all([
      this.prisma.tasks.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.tasks.count({ where })
    ])

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      tasks,
    };
  }

  async update(id: number, updateDto: UpdateTaskDto, user_id: number) {
    const task = await this.prisma.tasks.findFirst({
      where: { id, user_id }
    })

    if (!task) throw new NotFoundException('Task not found');

    const updatedTask = await this.prisma.tasks.update({
      where: { id },
      data: updateDto
    })

    return updatedTask
  }

  async remove(id: number, user_id: number) {
    const task = await this.prisma.tasks.findFirst({
      where: { id, user_id }
    })

    if (!task) throw new NotFoundException('Task not found')

    await this.prisma.tasks.delete({
      where: { id }
    })

    return { id, message: 'Task deleted' };
  }
}
