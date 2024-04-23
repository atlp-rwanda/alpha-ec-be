import { Request, Response } from 'express';
import Database from '../database';
import { sendResponse } from '../utils';
import { sendEmail } from '../utils/email';

export const userStatus = async (
  req: Request<{ id: string }, object, string[]>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const reasons: string[] = req.body;
    const user = await Database.User.findOne({ where: { id } });

    if (!user) {
      return sendResponse<null>(res, 404, null, 'User not found');
    }
    const { email } = user;
    const { name } = user;

    user.status = !user.status;

    if (
      user.status === false &&
      (!reasons || Object.keys(reasons).length === 0)
    ) {
      return sendResponse<null>(
        res,
        400,
        null,
        'At least one reason is required to Suspend an account.'
      );
    }

    await user.save();

    if (user.status === false) {
      const mailOptions = {
        to: email,
        subject: 'Your Account Status Update',
        template: 'suspendAccount',
        context: {
          name,
          reasons,
        },
      };
      await sendEmail(mailOptions);
    } else {
      const mailOptions = {
        to: email,
        subject: 'Your Account Status Update',
        template: 'activateAccount',
        context: {
          name,
        },
      };
      await sendEmail(mailOptions);
    }

    const statusMessage = user.status ? 'ACTIVE' : 'SUSPENDED';

    return sendResponse<null>(
      res,
      200,
      null,
      `Status has been updated to ${statusMessage}`
    );
  } catch (err) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
