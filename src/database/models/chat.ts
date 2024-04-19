import { Model, DataTypes, Sequelize } from 'sequelize';

interface ChatAttributes {
  id: string;
  senderId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ChatCreationAttributes extends Omit<ChatAttributes, 'id'> {}

/**
 * Chat model definition class.
 */
class Chat
  extends Model<ChatAttributes, ChatCreationAttributes>
  implements ChatAttributes
{
  public id!: string;

  public senderId!: string;

  public content!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
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
      senderId: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
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
