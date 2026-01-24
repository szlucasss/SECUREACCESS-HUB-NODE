import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para verificar se o usuário possui as roles necessárias.
 * @param requiredRoles Array de roles permitidas (ex: ['ADMIN', 'AUDITOR'])
 */
export const checkRole = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Tenta extrair as roles de diferentes locais comuns no token do Keycloak
    // 1. realm_access.roles (Padrão do Keycloak)
    // 2. roles (Se você configurou o mapper simplificado)
    // 3. resource_access.client-id.roles (Roles específicas de client)
    const userRoles =
      req.user.realm_access?.roles || req.user.roles || req.user.resource_access?.['backend-node']?.roles || [];

    // Verifica se o usuário tem pelo menos uma das roles necessárias
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        message: 'Acesso negado: Você não tem permissão para acessar este recurso.',
        required: requiredRoles,
        yours: userRoles,
      });
    }

    return next();
  };
};

