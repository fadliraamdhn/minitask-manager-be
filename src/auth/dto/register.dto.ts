import { IsNotEmpty, Matches, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @Matches(/^\S+$/, { message: "Usernames cannot contain spaces" })
    username: string

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^\S+$/, { message: "Password cannot contain spaces" })
    password: string
}