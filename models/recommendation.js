/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('recommendation', {
		member_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		post_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		}
	}, {
		tableName: 'recommendation',
		timestamps: false
	});
};
