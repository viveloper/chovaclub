/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('post', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		title: {
			type: DataTypes.STRING(45),
			allowNull: false
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		date_time: {
			type: DataTypes.DATE,
			allowNull: false
		},
		recommendation: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		views: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		member_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		},
		board_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false
		}
	}, {
		tableName: 'post',
		timestamps: false
	});
};
