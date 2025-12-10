import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from "bcrypt"

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

    async register(username: string, password: string) {
        const existingUsername = await this.prisma.users.findUnique({
            where: { username }
        })

        if(existingUsername) throw new BadRequestException('Username already exist')

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await this.prisma.users.create({
            data: {
                username,
                password: hashedPassword
            },
            select: {
                id: true,
                username: true,
            }
        })

        return newUser
    }

    async login(username: string, password: string) {
        const findUser = await this.prisma.users.findUnique({
            where: { username }
        })

        if (!findUser) throw new UnauthorizedException("Invalid username or password")

        const matchUsernamePassword = await bcrypt.compare(password, findUser.password)
        if (!matchUsernamePassword) throw new UnauthorizedException("Invalid username or password")
        
        const token = await this.jwt.signAsync(
            { id: findUser.id, username: findUser.username },
            { expiresIn: '1d'}
        )

        return {
            token,
            user: {
                id: findUser.id,
                username: findUser.username
            }
       }
    }
}
