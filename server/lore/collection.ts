import type { HydratedDocument, Types } from "mongoose";
import type { Lore } from "./model";
import LoreModel from "./model";
import UserCollection from "../user/collection";

/**
 * This files contains a class that has the functionality to explore lore
 * stored in MongoDB, including adding, finding, updating, and deleting lore.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Lore> is the output of the LoreModel() constructor,
 * and contains all the information in Lore. https://mongoosejs.com/docs/typescript.html
 */
class LoreCollection {
  /**
   * Add lore to the collection
   *
   * @param {string} authorId - The id of the author of the lore
   * @param {string} title - The title of the lore
   * @param {string} content - The content of the lore
   * @return {Promise<HydratedDocument<Lore>>} - The newly created lore
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    title: string,
    content: string
  ): Promise<HydratedDocument<Lore>> {
    const date = new Date();
    const lore = new LoreModel({
      authorId,
      dateCreated: date,
      title,
      content,
      dateModified: date,
    });
    await lore.save(); // Saves lore to MongoDB
    return lore.populate("authorId");
  }

  /**
   * Find lore by loreId
   *
   * @param {string} loreId - The id of the lore to find
   * @return {Promise<HydratedDocument<Lore>> | Promise<null> } - The lore with the given loreId, if any
   */
  static async findOne(
    loreId: Types.ObjectId | string
  ): Promise<HydratedDocument<Lore>> {
    return LoreModel.findOne({ _id: loreId }).populate("authorId");
  }

  /**
   * Get all the lore in the database
   *
   * @return {Promise<HydratedDocument<Lore>[]>} - An array of all of the lore
   */
  static async findAll(): Promise<Array<HydratedDocument<Lore>>> {
    // Retrieves lore and sorts them from most to least recent
    return LoreModel.find({}).sort({ dateModified: -1 }).populate("authorId");
  }

  /**
   * Get all the lore by given author
   *
   * @param {string} username - The username of author of the lore
   * @return {Promise<HydratedDocument<Lore>[]>} - An array of all of the lore
   */
  static async findAllByUsername(
    username: string
  ): Promise<Array<HydratedDocument<Lore>>> {
    const author = await UserCollection.findOneByUsername(username);
    return LoreModel.find({ authorId: author._id })
      .sort({ dateModified: -1 })
      .populate("authorId");
  }

  /**
   * Get all the lore containing given title query
   *
   * @param {string} title - The title of the lore
   * @return {Promise<HydratedDocument<Lore>[]>} - An array of all of the lore
   */
  static async findAllByTitle(
    title: string
  ): Promise<Array<HydratedDocument<Lore>>> {
    const query = new RegExp(title, "i");
    return LoreModel.find({ title: query }).sort({ dateModified: -1 });
  }

  /**
   * Update lore with new title/content
   *
   * @param {string} loreId - The id of the lore to be updated
   * @param {string} content - The new content of the lore
   * @return {Promise<HydratedDocument<Lore>>} - The newly updated lore
   */
  static async updateOne(
    loreId: Types.ObjectId | string,
    content: string
  ): Promise<HydratedDocument<Lore>> {
    const lore = await LoreModel.findOne({ _id: loreId });
    lore.content = content;
    lore.dateModified = new Date();
    await lore.save();
    return lore.populate("authorId");
  }

  /**
   * Delete lore with given loreId.
   *
   * @param {string} loreId - The loreId of lore to delete
   * @return {Promise<Boolean>} - true if the lore has been deleted, false otherwise
   */
  static async deleteOne(loreId: Types.ObjectId | string): Promise<boolean> {
    const lore = await LoreModel.deleteOne({ _id: loreId });
    return lore !== null;
  }

  /**
   * Delete all the lore by the given author
   *
   * @param {string} authorId - The id of author of lore
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await LoreModel.deleteMany({ authorId });
  }
}

export default LoreCollection;
