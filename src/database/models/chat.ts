import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './user';

interface ChatAttributes {
  id: string;
  socketId: string;
  senderId: string | null; // Updated data type to match Sequelize.UUID in the migration
  content: string;
  readStatus: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ChatCreationAttributes extends Omit<ChatAttributes, 'id'> {}

/**
 * Chat model definition class.
 */
export class Chat
  extends Model<ChatAttributes, ChatCreationAttributes>
  implements ChatAttributes
{
  public id!: string;

  public senderId!: string | null; // Updated data type to match Sequelize.UUID in the migration

  public socketId!: string;

  public content!: string;

  public readStatus!: boolean;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  /**
   * Associations.
   * @param {IModels} models - The models object containing all initialized models.
   * @returns {Object} An object representing association.
   */
  public static associate(models: { User: typeof User }) {
    Chat.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender',
    });
  }
}

// eslint-disable-next-line valid-jsdoc
/**
 * Initializes the Chat model.
 * @param {Sequelize} sequelize - The sequelize instance.
 * @return {typeof Chat} - The initialized Chat model.
 */
export default function initializeChatModel(sequelize: Sequelize): typeof Chat {
  Chat.init(
    {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      socketId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.UUID, // Ensure this matches the data type in the migration
        references: {
          model: 'users',
          key: 'id',
        },
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      readStatus: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'Chat',
      tableName: 'Chats',
    }
  );

  return Chat;
}
