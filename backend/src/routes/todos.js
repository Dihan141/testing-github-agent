const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('../../generated/prisma');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all todos for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new todo
router.post(
  '/',
  [
    authMiddleware,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description } = req.body;

      const todo = await prisma.todo.create({
        data: {
          title,
          description,
          userId: req.userId,
        },
      });

      res.status(201).json(todo);
    } catch (error) {
      console.error('Create todo error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update a todo
router.put(
  '/:id',
  [
    authMiddleware,
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('completed').optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      // Check if todo exists and belongs to user
      const existingTodo = await prisma.todo.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }

      if (existingTodo.userId !== req.userId) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Update todo
      const todo = await prisma.todo.update({
        where: { id: parseInt(id) },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(completed !== undefined && { completed }),
        },
      });

      res.json(todo);
    } catch (error) {
      console.error('Update todo error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete a todo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if todo exists and belongs to user
    const existingTodo = await prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (existingTodo.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete todo
    await prisma.todo.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
