import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AppError } from '../utils/AppError';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  findAll = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await this.userService.findAll({ page, limit });
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.findById(req.params.id as string);
      res.status(200).json(user);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.update(req.params.id as string, req.body);
      res.status(200).json(user);
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.userService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}

