import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { formatString } from '@/utils/globalFunctions';
import { ZodError } from 'zod';

import { z } from 'zod';

// TRPC errors are thrown when a procedure fails, even if the error is a Prisma error.
// This function allows us to preserve the Prisma error type and also assign a TRPC error code.
export function generateTypedError(
  error: Error,
  customMessage?: string
): Error {
  const prismaError = error as Prisma.PrismaClientKnownRequestError;
  if (prismaError) {
    const prismaErrorCode = prismaError.code as zPrismaErrorType;

    if (zPrismaErrors.options.includes(prismaErrorCode)) {
      const field = (prismaError.meta?.target as string[])
        ?.map(formatString)
        .join(', ');

      return new TRPCError({
        code: zPrismaErrorTRPCCode[prismaErrorCode],
        message: customMessage
          ? `${customMessage} (${prismaError.code})`
          : `${zPrismaErrorMessage[prismaErrorCode](field)} (${
              prismaError.code
            })`,
        cause: prismaError
      });
    }

    // If we haven't defined what to do with this error, throw an internal server error
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: customMessage
        ? `${customMessage} (${prismaError.code})`
        : `${prismaError.message} (${prismaError.code})`,
      cause: prismaError
    });
  }

  const zodError = error as ZodError;
  if (zodError) {
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: customMessage ? customMessage : `Invalid input data.`,
      cause: zodError
    });
  }

  return error;
}

const zPrismaErrors = z.enum(['P2002']);
type zPrismaErrorType = z.infer<typeof zPrismaErrors>;

const zPrismaErrorTRPCCode: Record<
  zPrismaErrorType,
  typeof TRPCError.prototype.code
> = {
  P2002: 'CONFLICT'
};

const zPrismaErrorMessage: Record<zPrismaErrorType, (field: string) => string> =
  {
    P2002: (field: string) => `${field} field is already in use.`
  };
