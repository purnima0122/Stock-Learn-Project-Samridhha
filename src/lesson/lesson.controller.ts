import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  async getAll(
    @Query('module') module: string,
    @Req() req,
  ) {
    console.log('Logged-in user:', req.userId);//this should work 

    if (module) {
      return this.lessonService.findByModule(module);
    }
    return this.lessonService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }
}
