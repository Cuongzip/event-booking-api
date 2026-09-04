import { Injectable } from '@nestjs/common';
import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './prisma/contract';
import contractJson from './prisma/contract.json' with { type: 'json' };

@Injectable()
export class PrismaService {
  readonly db = postgres<Contract>({
    contractJson,
    url: process.env.DATABASE_URL,
  });
}
