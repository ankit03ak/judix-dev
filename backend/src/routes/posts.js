import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/', protect, createPost);
router.get('/', protect, getPosts);
router.get('/:id', protect, getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

export default router;
