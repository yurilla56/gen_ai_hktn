import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DialController } from './dial.controller';
import { DialService } from '../../integrations/dial/dial.service';

@Module({
  imports: [HttpModule],
  controllers: [DialController],
  providers: [DialService],
})
export class DialModule {}
