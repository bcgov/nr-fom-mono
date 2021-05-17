import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkflowStateCode } from './entities/workflow-state-code.entity';
import { WorkflowStateCodeService } from './workflow-state-code.service';
import { WorkflowStateCodeController } from './workflow-state-code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowStateCode])],
  controllers: [WorkflowStateCodeController],
  providers: [WorkflowStateCodeService],
  exports: [WorkflowStateCodeService]
})
export class WorkflowStateCodeModule {}
