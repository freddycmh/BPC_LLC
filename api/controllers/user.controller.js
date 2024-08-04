import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

const ADMIN_USER_ID = '664a1c34413c39f3d7fa02d4';
const ADMIN_USER_ID2 = '66a6ac6b52f384512b70c176';


export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    // Check if the user is the owner of the listings or if the user is an admin
    if (req.user.id === req.params.id || req.user.id === ADMIN_USER_ID || req.user.id === ADMIN_USER_ID2) {
      const filter = req.user.id === ADMIN_USER_ID || req.user.id === ADMIN_USER_ID2 ? {} : { userRef: req.params.id };
      const listings = await Listing.find(filter);
      res.status(200).json(listings);
    } else {
      return next(errorHandler(401, 'You can only view your own listings!'));
    }
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, 'User not found!'));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};