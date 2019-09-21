var db = require('../modules/db');

function getCategories(cbFunc) {
    db.query('SELECT * FROM category ORDER BY id ASC', function (error, categories) {
        db.query('SELECT * FROM board', function (error, boards) {
            for (var i = 0; i < categories.length; i++) {
                categories[i].boardList = [];
                for (var j = 0; j < boards.length; j++) {
                    if (categories[i].id === boards[j].category_id) {
                        categories[i].boardList.push(boards[j]);
                    }
                }
            }
            cbFunc(categories);
        });
    });
}

exports.getCategories = getCategories;