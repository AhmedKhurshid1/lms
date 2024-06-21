// function applyRelationships(sequelize) {
//   const { Users, UserSessions, Logs } = sequelize.models;

//   // Users - User Sessions | One to One
//   Users.hasOne(UserSessions, {
//     foreignKey: {
//       allowNull: false,
//       name: 'userId',
//     },
//     onDelete: 'CASCADE',
//   });
//   UserSessions.belongsTo(Users, {
//     foreignKey: {
//       allowNull: false,
//       name: 'userId',
//     },
//     onDelete: 'CASCADE',
//   });

//   // Users - Logs | One to many
//   const logOptions = {
//     foreignKey: {
//       allowNull: true,
//       name: 'userId',
//     },
//     onDelete: 'CASCADE',
//   };
//   Users.hasMany(Logs, logOptions);
//   Logs.belongsTo(Users, logOptions);
// }

// module.exports = applyRelationships;
