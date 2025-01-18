module.exports = (sequelize, DataTypes) => {
  const ProjectJoineds = sequelize.define("ProjectJoineds", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Projects",
        key: "id",
      },
    },
    participant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    isManager: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }
  ,
  {timestamps: false,
      createdAt: false,
      updatedAt: false,
    }

);



  // Association =====================================
  // author: Hai -------------------------------------
  ProjectJoineds.associate = function (models) {
    ProjectJoineds.belongsTo(models["Users"], {
      foreignKey: 'participant_id',
    });
    ProjectJoineds.belongsTo(models["Projects"], {
      foreignKey: 'project_id',
      onDelete: 'CASCADE'
    })
  }
  // =================================================

  return ProjectJoineds;
};
