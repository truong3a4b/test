module.exports = (sequelize, DataTypes) => {
  const AssignedTos = sequelize.define("AssignedTos", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Tasks",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  }
  ,
  {timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
);

  // Association =====================================
  // ------------------------------------ author: Hai 
  AssignedTos.associate = function (models) {
    AssignedTos.belongsTo(models["Users"], {
      foreignKey: 'user_id',
    });
    AssignedTos.belongsTo(models["Tasks"], {
      foreignKey: 'task_id',
      onDelete: 'CASCADE'
    })
  }
  // =================================================

  return AssignedTos;
};
