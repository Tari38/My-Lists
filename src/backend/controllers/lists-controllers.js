import { validationResult } from "express-validator";
import { startSession } from "mongoose";

import HttpError from "../models/http-error";
import List, { findById } from "../models/list";
import { findById as _findById } from "../models/user";

const getListById = async (req, res, next) => {
  const listId = req.params.lid;

  let list;
  try {
    list = await findById(listId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a list.",
      500
    );
    return next(error);
  }

  if (!list) {
    const error = new HttpError(
      "Could not find list for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ list: list.toObject({ getters: true }) });
};

const getListsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // let lists;
  let userWithLists;
  try {
    userWithLists = await _findById(userId).populate("lists");
  } catch (err) {
    const error = new HttpError(
      "Fetching lists failed, please try again later.",
      500
    );
    return next(error);
  }

  // if (!lists || lists.length === 0) {
  if (!userWithLists || userWithLists.lists.length === 0) {
    return next(
      new HttpError("Could not find lists for the provided user id.", 404)
    );
  }

  res.json({ lists: userWithLists.lists.map(list => list.toObject({ getters: true })) });
};

const createList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, creator } = req.body;

  const createdList = new List({
    title,
    description
  });

  let user;
  try {
    user = await _findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating list failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await startSession();
    sess.startTransaction();
    await createdList.save({ session: sess }); 
    user.lists.push(createdList); 
    await user.save({ session: sess }); 
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating list failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ list: createdList });
};

const updateList = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const listId = req.params.lid;

  let list;
  try {
    list = await findById(listId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update list.",
      500
    );
    return next(error);
  }

  list.title = title;
  list.description = description;

  try {
    await list.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update list.",
      500
    );
    return next(error);
  }

  res.status(200).json({ list: list.toObject({ getters: true }) });
};

const deleteList = async (req, res, next) => {
  const listId = req.params.lid;

  let list;
  try {
    list = await findById(listId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete list.",
      500
    );
    return next(error);
  }

  if (!list) {
    const error = new HttpError("Could not find list for this id.", 404);
    return next(error);
  }

  try {
    const sess = await startSession();
    sess.startTransaction();
    await list.remove({session: sess});
    list.creator.lists.pull(list);
    await list.creator.save({session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete list.",
      500
    );
    return next(error);
  }
  
  res.status(200).json({ message: "Deleted list." });
};

const _getListById = getListById;
export { _getListById as getListById };
const _getListsByUserId = getListsByUserId;
export { _getListsByUserId as getListsByUserId };
const _createList = createList;
export { _createList as createList };
const _updateList = updateList;
export { _updateList as updateList };
const _deleteList = deleteList;
export { _deleteList as deleteList };
