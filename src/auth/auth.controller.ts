import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        const user =  await this.auth.register(dto.username, dto.password)

        return {
            status: 'success',
            code: 201,
            message: 'User created successfully',
            data: user,
        }
    }

    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { token, user } = await this.auth.login(
            dto.username,
            dto.password
        )

        res.cookie('token', token, {    
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        })

        return {
            status: 'success',
            code: 200,
            message: 'Login successful',
            data: user
        };
    }
}
