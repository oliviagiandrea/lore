import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LoreCollection from './collection';
import * as userValidator from '../user/middleware';
import * as loreValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the lore
 *
 * @name GET /api/lore
 *
 * @return {LoreResponse[]} - A list of all the lore sorted in descending
 *                      order by date modified
 */
// /**
//  * Get lore by author.
//  *
//  * @name GET /api/lore?author=username
//  *
//  * @return {LoreResponse[]} - An array of lore created by user with username, author
//  * @throws {400} - If author is not given
//  * @throws {404} - If no user has given author
//  *
//  */
// router.get(
//   '/',
//   async (req: Request, res: Response, next: NextFunction) => {
//     // Check if author query parameter was supplied
//     if (req.query.author !== undefined) {
//       next();
//       return;
//     }

//     const allLore = await LoreCollection.findAll();
//     const response = allLore.map(util.constructLoreResponse);
//     res.status(200).json(response);
//   },
//   [
//     userValidator.isAuthorExists
//   ],
//   async (req: Request, res: Response) => {
//     const authorLore = await LoreCollection.findAllByUsername(req.query.author as string);
//     const response = authorLore.map(util.constructLoreResponse);
//     res.status(200).json(response);
//   }
// );

/**
 * Get lore by title.
 *
 * @name GET /api/lore?title=title
 *
 * @return {LoreResponse[]} - An array of lore containing title regex
 * @throws {400} - If title is not given
 * @throws {404} - If no title has given regex
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if title query parameter was supplied
    if (req.query.title !== undefined) {
      next();
      return;
    }

    const allLore = await LoreCollection.findAll();
    const response = allLore.map(util.constructLoreResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response) => {
    const titleLore = await LoreCollection.findAllByTitle(req.query.title as string);
    const response = titleLore.map(util.constructLoreResponse);
    res.status(200).json(response);
  }
);

/**
 * Create new lore.
 *
 * @name POST /api/lore
 *
 * @param {string} title - The title of the lore
 * @param {string} content - The content of the lore
 * @return {LoreResponse} - The created lore
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the lore title/content is empty or a stream of empty spaces
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    loreValidator.isValidLoreTitle,
    loreValidator.isValidLoreContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const lore = await LoreCollection.addOne(userId, req.body.title, req.body.content);

    res.status(201).json({
      message: 'Lore was created successfully.',
      lore: util.constructLoreResponse(lore)
    });
  }
);

/**
 * Delete lore
 *
 * @name DELETE /api/lore/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the loreId is not valid
 */
router.delete(
  '/:loreId?',
  [
    userValidator.isUserLoggedIn,
    loreValidator.isLoreExists
  ],
  async (req: Request, res: Response) => {
    await LoreCollection.deleteOne(req.params.loreId);
    res.status(200).json({
      message: 'Lore was deleted successfully.'
    });
  }
);

/**
 * Modify lore
 *
 * @name PATCH /api/lore/:id
 *
 * @param {string} content - the new content for the lore
 * @return {LoreResponse} - the updated lore
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the lore
 * @throws {404} - If the loreId is not valid
 * @throws {400} - If the lore title/content is empty or a stream of empty spaces
 */
router.patch(
  '/:loreId?',
  [
    userValidator.isUserLoggedIn,
    loreValidator.isLoreExists,
    loreValidator.isValidLoreContent
  ],
  async (req: Request, res: Response) => {
    const lore = await LoreCollection.updateOne(req.params.loreId, req.body.content);
    res.status(200).json({
      message: 'Lore was updated successfully.',
      lore: util.constructLoreResponse(lore)
    });
  }
);

export {router as loreRouter};
