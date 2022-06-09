import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export class CategoriesParamsValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(`The param ${metadata.data} is required`);
    }

    return value;
  }
}

export class CategoriesIdParamValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException(`The param ${metadata.data} is required`);
    }
    if (!isValidObjectId(value)) {
      throw new BadRequestException(
        `The param ${metadata.data} is not a valid id`,
      );
    }

    return value;
  }
}
