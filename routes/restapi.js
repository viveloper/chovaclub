var express = require('express');
var router = express.Router();
var db = require('../modules/db');
var createError = require('http-errors');

// // ===================================================================
// // sequelize
// // ===================================================================
// var Sequelize = require('sequelize');
// const sequelize = new Sequelize('chovaclub', 'root', '000000', {
//     host: 'localhost',
//     dialect: 'mysql'
// });
// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });
// // ===================================================================

// var Board = require('../models/board')(sequelize, Sequelize.DataTypes);
// var Category = require('../models/category')(sequelize, Sequelize.DataTypes);
// var Member = require('../models/member')(sequelize, Sequelize.DataTypes);
// var Post = require('../models/post')(sequelize, Sequelize.DataTypes);
// var Recommendation = require('../models/recommendation')(sequelize, Sequelize.DataTypes);

// router.get('/categories', function (req, res, next) {
//     // Find all userse
//     Category.findAll({order:[['id', 'ASC']]}).then(categories => {
//         var strCategories = JSON.stringify(categories);
//         categories = JSON.parse(strCategories);
//         Board.findAll().then((boards)=>{
//             var strBoards = JSON.stringify(boards);
//             boards = JSON.parse(strBoards);
//             for (var i = 0; i < categories.length; i++) {
//                 categories[i].boardList = [];
//                 for (var j = 0; j < boards.length; j++) {
//                     if (categories[i].id === boards[j].category_id) {
//                         categories[i].boardList.push(boards[j]);
//                     }
//                 }
//             }
//             res.send(categories);
//         });
//     });
// });

router.get('/categories', function (req, res, next) {
    db.query('SELECT * FROM category ORDER BY id ASC', function (error, categories) {
        db.query('SELECT * FROM board', function (error, boards) {
            for (var i = 0; i < categories.length; i++) {
                categories[i].boards = [];
                for (var j = 0; j < boards.length; j++) {
                    if (categories[i].id === boards[j].category_id) {
                        categories[i].boards.push(boards[j]);
                    }
                }
            }
            res.send(categories);
        });
    });
});

router.get('/board/:boardAlias', function (req, res, next) {
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var limit = req.query.limit ? parseInt(req.query.limit) : 10;
    var offset = (page - 1) * limit;

    var sql = `SELECT post.id,title,date_time,recommendation,views,nickname,board_id,board.alias as board_alias FROM post 
                    LEFT JOIN member ON member_id = member.id 
                    LEFT JOIN board ON board_id=board.id
                    WHERE board.alias='${req.params.boardAlias}'
                    ORDER BY post.id DESC`;
    if (req.query.page || req.query.limit) {
        sql += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    db.query(sql, function (error, posts) {
        sql = `SELECT COUNT(*) as cnt FROM post 
                    LEFT JOIN member ON member_id = member.id 
                    LEFT JOIN board ON board_id=board.id
                    WHERE board.alias='${req.params.boardAlias}'
                    ORDER BY post.id DESC`;
        db.query(sql, function (err, totalCountInfo) {
            var result = {
                page: page,
                count: posts.length,
                totalCount: totalCountInfo[0].cnt,
                posts: posts
            }
            res.send(result);
        });
    });
});

router.get('/board/:boardAlias/:postId', function (req, res, next) {
    db.query(`SELECT post.id, title, content, date_time, recommendation, views, nickname FROM post LEFT JOIN member ON member_id=member.id WHERE post.id=${req.params.postId}`, function (error, posts) {
        if (posts.length > 0) {
            db.query(`UPDATE post SET views=${++posts[0].views} WHERE id=${req.params.postId}`, function (error, result) {
                // 조회수 증가
                if (result.affectedRows > 0) {
                    res.send(posts[0]);
                }
            });
        } else {
            res.status(404).send('Not found');
        }
    });
});

module.exports = router;
