/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('member', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING(60),
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		nickname: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true
		},
		address: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		tel: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		gender: {
			type: DataTypes.STRING(45),
			allowNull: true
		}
	}, {
		tableName: 'member',
		timestamps: false
	});
};
