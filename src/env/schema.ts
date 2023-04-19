import { z, type ZodFormattedError } from 'zod'

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('development'),
  PORT: z.number().optional().default(8088),
  DEBUG: z.boolean().optional().default(false),
  REDIS_HOST: z.string().optional().default('localhost'),
  REDIS_PORT: z.number().optional().default(6379),
  REDIS_PASS: z.string(),
})

export const formatErrors = (
  errors: ZodFormattedError<Map<string, string>, string>
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value) {
        return `${name}: ${value._errors.join(', ')}\n`
      }
      return
    })
    .filter(Boolean)
