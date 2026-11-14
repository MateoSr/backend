import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Debe ejecutarse una sola vez, antes de que los schemas usen .openapi().
extendZodWithOpenApi(z);

export { z };
