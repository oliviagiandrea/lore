import type { Types } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "../user/model";

/**
 * This file defines the properties stored in lore
 */

// Type definition for Lore on the backend
export type Lore = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  title: string;
  content: string;
  dateModified: Date;
};

export type PopulatedLore = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  title: string;
  content: string;
  dateModified: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Lore stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const LoreSchema = new Schema<Lore>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The date the lore was created
  dateCreated: {
    type: Date,
    required: true,
  },
  // The title of the lore
  title: {
    type: String,
    required: true,
  },
  // The content of the lore
  content: {
    type: String,
    required: true,
  },
  // The date the lore was modified
  dateModified: {
    type: Date,
    required: true,
  },
});

const LoreModel = model<Lore>("Lore", LoreSchema);
export default LoreModel;
