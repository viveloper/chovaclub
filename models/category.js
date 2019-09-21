/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('category', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		alias: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true
		},
		name: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true
		}
	}, {
		tableName: 'category',
		timestamps: false
	});
};
