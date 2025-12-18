import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { signupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh.token.schema';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)private UserModel: Model<User>,
    @InjectModel(RefreshToken.name)private RefreshTokenModel: Model<RefreshToken>,
  private jwtService: JwtService,
){}

  async signup(signupData: signupDto){
    const{email,password,name}=signupData


    //check if email is in use 
    const emailInUse= await this.UserModel.findOne({
      email: signupData.email,
    });
    if(emailInUse){
      throw new BadRequestException('Email is already in use');
    }

    //Hash password 
    const hashedPassword=await bcrypt.hash(password, 10);


    //Create user document in database 
    await this.UserModel.create({
      name,
      email,
      password:hashedPassword,
    });
  }

  async login(credentials:loginDto){
    const {email,password}=credentials;

    //find if user exists by email
    
     const user= await this.UserModel.findOne({email});
     if(!user){
      throw new UnauthorizedException('Wrong Credentials');
     }

    //compare entered password with existing password 
    const passwordMatch =await bcrypt.compare(password, user.password)
    if(!passwordMatch){
      throw new UnauthorizedException('Wrong credentails');
    }

    //generate jwt tokens 
    
    const tokens=await this.generateUserTokens(user._id);
    return {
      ...tokens,
      userId:user._id,
    }
  }


  async refreshTokens(refreshToken:string){
    const token= await this.RefreshTokenModel.findOne({
      token:refreshToken,
      expiryDate:{ $gte: new Date()}
    });
    if(!token){
      throw new UnauthorizedException('Refresh token is invalid');
    }
    return this.generateUserTokens(token.userId)
  }

  //separate function to generate usertoken to make the code modular
  async generateUserTokens(userId){
    const accessToken =this.jwtService.sign({userId},{expiresIn: '72 hr'});

    const RefreshToken=uuidv4();

    await this.storeRefreshToken(RefreshToken,userId)
    return {
      accessToken,//short lived
      RefreshToken// long lived
    };
  }


  async storeRefreshToken(token:string,userId){
    //expiry date is calculated to be three days from now 
    const expiryDate= new Date();
    expiryDate.setDate(expiryDate.getDate()+3);
    await this.RefreshTokenModel.updateOne({userId},
      {$set: {expiryDate,token}},
      {
        upsert:true,
      }
    );
  }
}
