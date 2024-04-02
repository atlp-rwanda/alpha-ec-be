import { Model, DataTypes, Sequelize } from 'sequelize';

interface RoleAttributes {
  roles_id: number;
  roles_name: string;
}

interface RoleCreationAttributes extends Omit<RoleAttributes, 'roles_id'> {
  roles_id?: number;
}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public roles_id!: number;
  public roles_name!: string;

 
  static associate() {
  }
}

export default (sequelize: Sequelize) => {
  Role.init({
    roles_id: DataTypes.INTEGER,
    roles_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
  });
  
  return Role;
};
