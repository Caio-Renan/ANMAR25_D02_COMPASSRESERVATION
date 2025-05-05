import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsCpf() {
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
    Length(11, 14),
    Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    Transform(({ value }) => {
      if (typeof value !== 'string') return value;

      const digits = value.replace(/\D/g, '');

      if (digits.length !== 11) return value;

      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    }),
    Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
      message: 'CPF must be in the format 000.000.000-00',
    }),
  );
}