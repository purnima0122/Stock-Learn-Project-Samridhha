import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Lesson', required: true })
  lessonId: Types.ObjectId;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  completedAt?: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

// Optional but IMPORTANT: one record per user per lesson
ProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
