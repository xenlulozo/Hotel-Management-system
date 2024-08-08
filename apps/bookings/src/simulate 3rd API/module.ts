import { Global, Module } from '@nestjs/common';
import { Service } from './service';
@Global()
@Module({
  controllers: [],
  providers: [Service],
  exports: [Service]
})
export class FakeModule {}
