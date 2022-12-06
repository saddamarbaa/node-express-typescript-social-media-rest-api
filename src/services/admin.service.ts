import { RequestHandler } from 'express';
import { InternalServerError } from 'http-errors';

import User from '@src/models/User.model';
import { response } from '@src/utils';

export const getUsersService: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find().select(
      'name firstName lastName  surname email dateOfBirth gender joinedDate isVerified  profileImage  mobileNumber  status role  companyName   acceptTerms nationality  favoriteAnimal  address  profileImage  bio mobileNumber createdAt updatedAt'
    );

    const data = {
      user: users,
    };

    return res.status(200).json(
      response<typeof data>({
        data,
        success: true,
        error: false,
        message: `Success`,
        status: 200,
      })
    );
  } catch (error) {
    return next(InternalServerError);
  }
};

export default {
  getUsersService,
};
