import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum TaskStatus {
    Complete = "Complete",
    Inprogress = "Inprogress"
}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus
}
