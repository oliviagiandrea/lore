import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LoreCollection from '../lore/collection';

/**
 * Checks if a lore with loreId is req.params exists
 */
const isLoreExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.loreId);
  const lore = validFormat ? await LoreCollection.findOne(req.params.loreId) : '';
  if (!lore) {
    res.status(404).json({
      error: `Lore with lore ID ${req.params.loreId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the title of the lore in req.body is valid, i.e not a stream of empty spaces 
 */
const isValidLoreTitle = (req: Request, res: Response, next: NextFunction) => {
  const {title} = req.body as {title: string};
  if (!title.trim()) {
    res.status(400).json({
      error: 'Lore title must be at least one character long.'
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the lore in req.body is valid, i.e not a stream of empty spaces 
 */
const isValidLoreContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Lore content must be at least one character long.'
    });
    return;
  }

  next();
};

export {
  isValidLoreContent,
  isValidLoreTitle,
  isLoreExists
};
