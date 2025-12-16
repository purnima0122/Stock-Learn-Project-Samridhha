import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './dtos/signup.dto';
import { loginDto } from './dtos/login.dto';
import { RefreshToken } from './schemas/refresh.token.schema';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService:AuthService){}
  //post signup
  @Post('signup')//api endpoint: auth/signup
  async signUp(@Body() signupData: signupDto) {
    return this.authService.signup(signupData)
  }

  //post logout
  @Post('login')
  async login(@Body() credentials: loginDto)
  {
    return this.authService.login(credentials)
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.refreshTokens(refreshTokenDto.refreshToken)
  }

}
