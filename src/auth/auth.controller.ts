import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './dtos/signup.dto';
import { loginDto } from './dtos/login.dto';
import { RefreshToken } from './schemas/refresh.token.schema';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

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

  //refresh
  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.refreshTokens(refreshTokenDto.refreshToken)
  }

  //POST change password
  //we need this protected
  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(@Body()changePasswordDto: ChangePasswordDto, @Req() req,){
    return this.authService.changePassword(
      req.userId,
      changePasswordDto.oldPassword,changePasswordDto.newPassword);
  }

  //POST forgot password
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto)
  {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  //Reset Password
  
}
