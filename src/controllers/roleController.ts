import { Request, Response } from 'express';
import { RoleAttributes } from '../database/models/role';
import Database from '../database';
import { sendResponse } from '../utils/response';

interface RoleCreationAttributes extends Omit<RoleAttributes, 'id'> {}

export const createRole = async (
  req: Request<object, object, RoleCreationAttributes>,
  res: Response
) => {
  try {
    const { name, description } = req.body;

    const view = name.trim();

    const roleExist = await Database.Role.findOne({
      where: {
        name: view,
      },
    });
    if (roleExist) {
      return sendResponse<null>(
        res,
        400,
        null,
        'A role with this name already exists.'
      );
    }
    const role = Database.Role.build({
      name,
      description,
    });
    await role.save();
    return sendResponse<RoleAttributes>(
      res,
      201,
      role,
      'Role created successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Database.Role.findAll();
    return sendResponse<RoleAttributes[]>(
      res,
      200,
      roles,
      'Roles fetched successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
export const getRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await Database.Role.findByPk(id);
    if (!role) {
      return sendResponse<null>(res, 404, null, 'Role not found');
    }
    return sendResponse<RoleAttributes>(
      res,
      200,
      role,
      'Role fetched successfully!'
    );
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await Database.Role.findByPk(id);
    if (!role) {
      return sendResponse<null>(res, 404, null, 'Role not found');
    }
    await role.destroy();
    return sendResponse<null>(res, 204, null, 'Role deleted successfully!');
  } catch (err: unknown) {
    const errors = err as Error;
    return sendResponse<null>(res, 500, null, errors.message);
  }
};
export const assignRole = async (req: Request, res: Response) => {
  try {
    const { userId, roleId } = req.body;
    const user = await Database.User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return sendResponse<null>(res, 404, null, 'User not found');
    }
    const role = await Database.Role.findByPk(roleId);
    if (!role) {
      return sendResponse<null>(res, 404, null, 'Role not found');
    }
    user.roleId = roleId;

    await user.save();

    return sendResponse<null>(res, 200, null, 'Role assigned successfully!');
  } catch (err: unknown) {
    const errors = err as Error;

    return sendResponse<null>(res, 500, null, errors.message);
  }
};
