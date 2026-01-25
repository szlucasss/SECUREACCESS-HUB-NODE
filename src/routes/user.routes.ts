import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { CreateUserDto, UpdateUserDto } from '../dtos/UserDto';

const router = Router();
const userController = new UserController();

// Rotas de Usuário
// Todas as rotas exigem autenticação
router.use(authMiddleware);

// Apenas ADMIN pode criar, atualizar ou deletar usuários
router.post('/', checkRole(['ADMIN']), validationMiddleware(CreateUserDto), userController.create);
router.get('/', checkRole(['ADMIN']), userController.findAll);
router.get('/:id', checkRole(['ADMIN', 'USER']), userController.findById); // USER pode ver detalhes (idealmente apenas o próprio)
router.put('/:id', checkRole(['ADMIN']), validationMiddleware(UpdateUserDto, true), userController.update);
router.delete('/:id', checkRole(['ADMIN']), userController.delete);

export default router;

