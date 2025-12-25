import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson, LessonDocument } from './schemas/lesson.schema';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private lessonModel: Model<LessonDocument>,
  ) {}

  async findAll() {
    return this.lessonModel
      .find({ isPublished: true })
      .sort({ order: 1 })
      .exec();
  }

  async findByModule(module: string) {
    return this.lessonModel
      .find({ module, isPublished: true })
      .sort({ order: 1 })
      .exec();
  }

  async findOne(id: string) {
    return this.lessonModel.findById(id).exec();
  }
}
