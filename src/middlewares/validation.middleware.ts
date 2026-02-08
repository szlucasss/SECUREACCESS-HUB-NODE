import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de validação genérico.
 * Recebe uma classe DTO, transforma o corpo da requisição nessa classe e valida.
 * Se houver erros, retorna 400 Bad Request com a lista de erros.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validationMiddleware = (dtoClass: any, skipMissingProperties = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(dtoClass, req.body);

    validate(dtoObj, { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const dtoErrors = errors.map((error: ValidationError) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (Object as any).values(error.constraints || {})
        ).join(', ');
        
        return res.status(400).json({ message: 'Erro de validação', errors: dtoErrors });
      } else {
        // Sanitização: substitui o body pelo objeto tipado e limpo
        req.body = dtoObj;
        next();
      }
    });
  };
};


