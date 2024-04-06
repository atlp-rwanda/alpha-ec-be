import { Sequelize, Model, DataTypes } from 'sequelize';

export interface UserOTPVerificationAttributes {
  email: string;
  otp?: string;
  expiresAt?: Date;
  createdAt?: Date;
}

interface UserOTPVerificationCreationAttributes
  extends Omit<UserOTPVerificationAttributes, 'createdAt'> {
  createdAt?: Date;
}

export class UserOTPVerification extends Model<UserOTPVerificationAttributes, UserOTPVerificationCreationAttributes> {
  declare email: string;
  declare otp: string;
  declare expiresAt: Date;
  declare readonly createdAt: Date;
}

const UserOTPVerificationModel = (sequelize: Sequelize) => {
  UserOTPVerification.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserOTPVerification',
      tableName: 'user_otp_verifications',
      timestamps: true,
    }
  );

  return UserOTPVerification;
};

export default UserOTPVerificationModel;
