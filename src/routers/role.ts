import { Router } from 'express';
import { isAdmin, isAuthenticated } from '../middleware';
import {
  assignRole,
  createRole,
  deleteRole,
  getRole,
  getRoles,
} from '../controllers/roleController';
// import { isAdmin,isAuthenticated } from '../middleware';

const router = Router();
router.post('/roles', isAuthenticated, isAdmin, createRole);
router.get('/roles', isAuthenticated, isAdmin, getRoles);
router.get('/roles/:id', isAuthenticated, isAdmin, getRole);
router.put('/roles/:id', isAuthenticated, isAdmin, createRole);
router.delete('/roles/:id', isAuthenticated, isAdmin, deleteRole);
router.post('/users/roles', isAuthenticated, isAdmin, assignRole);
export default router;
