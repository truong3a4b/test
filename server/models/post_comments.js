module.exports = (sequelize, DataTypes) => {
  const PostComments = sequelize.define("PostComments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Posts",
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
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
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
  PostComments.associate = function (models) {
    PostComments.belongsTo(models["Users"], {
      foreignKey: 'user_id',
    });
    PostComments.belongsTo(models["Posts"], {
      foreignKey: 'post_id',
      onDelete: 'CASCADE'
    })
  }
  // =================================================

  return PostComments;
};
