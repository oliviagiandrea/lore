import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Lore, PopulatedLore } from "./model";

// Update this if you add a property to the Lore type!
type LoreResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

/**
 * Transform a raw Lore object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Lore>} lore - Lore
 * @returns {LoreResponse} - The lore object formatted for the frontend
 */
const constructLoreResponse = (lore: HydratedDocument<Lore>): LoreResponse => {
  const loreCopy: PopulatedLore = {
    ...lore.toObject({
      versionKey: false, // Cosmetics; prevents returning of __v property
    }),
  };
  const { username } = loreCopy.authorId;
  delete loreCopy.authorId;
  return {
    ...loreCopy,
    _id: loreCopy._id.toString(),
    author: username,
    dateCreated: formatDate(lore.dateCreated),
    dateModified: formatDate(lore.dateModified),
  };
};

export { constructLoreResponse };
