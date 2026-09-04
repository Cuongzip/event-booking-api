#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/308496602cf990dd2f8fdfe462b741aaa2172966ba3546cb360c9198c8c422d2/contract';
import endContract from '../../snapshots/308496602cf990dd2f8fdfe462b741aaa2172966ba3546cb360c9198c8c422d2/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/774f95999e5d4157363f6a8990e676e4d2f70611d7591d1b919c32f0821701c5/contract';
import startContract from '../../snapshots/774f95999e5d4157363f6a8990e676e4d2f70611d7591d1b919c32f0821701c5/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'user' }),
      this.createTable({
        schema: 'public',
        table: 'bookings',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiredAt', 'date', { notNull: true, codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('quantity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('totalPrice', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'bookings_status_check_62239f48',
            "\"status\" IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'events',
        columns: [
          col('availableSeats', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('capacity', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('endAt', 'date', { notNull: true, codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('location', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('price', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('startAt', 'date', { notNull: true, codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('DRAFT'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'events_status_check_a8bd1676',
            "\"status\" IN ('DRAFT', 'PUBLISHED', 'CANCELLED', 'ENDED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'payments',
        columns: [
          col('amount', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('expiredAt', 'date', { notNull: true, codecRef: { codecId: 'pg/date-temporal@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('transactionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'payments_status_check_f2c852a1',
            "\"status\" IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED', 'EXPIRED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'tickets',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('VALID'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'tickets_status_check_418dfda4',
            "\"status\" IN ('VALID', 'USED', 'CANCELLED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', {
            notNull: true,
            default: lit('USER'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('users_role_check_5b1978b5', "\"role\" IN ('ADMIN', 'USER')"),
          checkExpression(
            'users_status_check_a34ffd8e',
            "\"status\" IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
