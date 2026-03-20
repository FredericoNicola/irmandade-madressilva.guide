import { Router } from 'express';
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/roleCheck';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/', listUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
