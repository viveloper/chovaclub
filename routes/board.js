var express = require('express');
var db = require('../modules/db');
var category = require('../modules/category');
var router = express.Router();

router.get('/:boardAlias', function (req, res, next) {
    var currentPage = req.query.page ? parseInt(req.query.page) : 1;
    var limit = req.query.limit ? parseInt(req.query.limit) : 10;
    var offset = (currentPage - 1) * limit;
    category.getCategories(function (category) {
        var sql = `SELECT post.id,title,date_time,recommendation,views,nickname,board_id,board.alias as board_alias FROM post 
                    LEFT JOIN member ON member_id = member.id 
                    LEFT JOIN board ON board_id=board.id
                    WHERE board.alias='${req.params.boardAlias}'
                    ORDER BY post.id DESC
                    LIMIT ${limit} OFFSET ${offset}`;
        db.query(sql, function (error, post) {
            sql = `SELECT COUNT(*) as cnt FROM post 
                    LEFT JOIN member ON member_id = member.id 
                    LEFT JOIN board ON board_id=board.id
                    WHERE board.alias='${req.params.boardAlias}'
                    ORDER BY post.id DESC`;
            db.query(sql, function(err, postCnt){
                var totalPageCnt = Math.ceil(postCnt[0].cnt / limit);
                var pageSelectorStartIndex = Math.floor((currentPage-1)/10)*10+1;
                var pageSelectorRange = [];
                var endIndex = 0;
                if(totalPageCnt>=pageSelectorStartIndex+9){
                    endIndex = pageSelectorStartIndex+9;
                }else{
                    endIndex = totalPageCnt
                }
                for(var i=pageSelectorStartIndex; i<=endIndex; i++){
                    pageSelectorRange.push(i);
                }
                var firstPageLink = 0;
                if(pageSelectorStartIndex!==1){
                    firstPageLink = 1;
                }
                var lastPageLink = 0;
                if(endIndex<totalPageCnt){
                    lastPageLink = totalPageCnt;
                }
                
                var viewData = {
                    title: 'CHOVA CLUB',
                    category: category,
                    firstPageLink: firstPageLink,
                    lastPageLink: lastPageLink,
                    pageSelectorRange: pageSelectorRange,
                    limit: limit,
                    currentPage: currentPage,
                    totalPageCnt: totalPageCnt,
                    post: post,
                    boardAlias: req.params.boardAlias,
                    loginUser: req.user
                };
    
                res.render('post', viewData);
            });
        });
    });
});

router.get('/:boardAlias/writing', function (req, res, next) {
    category.getCategories(function (category) {
        var viewData = {
            title: 'CHOVA CLUB',
            category: category,
            boardAlias: req.params.boardAlias,
            loginUser: req.user
        };

        res.render('writing', viewData);
    });
});

router.get('/:boardAlias/:postId', function (req, res, next) {
    var fmsg = req.flash();
    var callByRecommendation = '';
    if (fmsg.callByRecommendation) {
        callByRecommendation = fmsg.callByRecommendation[0];
    }
    var alreayRecommendation = '';
    if (fmsg.alreayRecommendation) {
        alreayRecommendation = fmsg.alreayRecommendation[0];
    }

    category.getCategories(function (category) {
        db.query(`SELECT post.id, title, content, date_time, recommendation, views, nickname FROM post LEFT JOIN member ON member_id=member.id WHERE post.id=${req.params.postId}`, function (error, post) {
            var viewData = {
                title: 'CHOVA CLUB',
                category: category,
                boardAlias: req.params.boardAlias,
                post: post[0],
                loginUser: req.user,
                alreayRecommendation: alreayRecommendation
            };

            if (callByRecommendation) {
                res.render('content', viewData);
            }
            else {
                db.query(`UPDATE post SET views=${++post[0].views} WHERE id=${req.params.postId}`, function (error, result) {
                    // 조회수 증가
                    if (result.affectedRows > 0) {
                        viewData.post = post[0];
                        res.render('content', viewData);
                    }
                });
            }
        });
    });
});

router.get('/:boardAlias/:postId/update', function (req, res, next) {
    category.getCategories(function (category) {
        db.query(`SELECT id, title, content, member_id FROM post WHERE id = ${req.params.postId}`, function (error, post) {
            if (req.user.email === 'admin' || post[0].member_id === req.user.id) {
                var viewData = {
                    title: 'CHOVA CLUB',
                    category: category,
                    boardAlias: req.params.boardAlias,
                    post: post[0],
                    loginUser: req.user
                };

                res.render('update', viewData);
            }
            else {
                res.send(`해당 게시글에 대한 수정권한이 없습니다.`);
            }
        });
    });
});

router.get('/:boardAlias/:postId/recommendation', function (req, res, next) {
    db.query(`INSERT INTO recommendation(member_id, post_id) VALUES(${req.user.id}, ${req.params.postId})`, function (err, result) {
        if (!err) {
            db.query(`SELECT recommendation FROM post WHERE id = ${req.params.postId}`, function (err, post) {
                db.query(`UPDATE post SET recommendation=${++post[0].recommendation} WHERE id=${req.params.postId}`, function (err, _result) {
                    if (_result.affectedRows > 0) {
                        req.flash('callByRecommendation', 'true');
                        res.redirect(`/board/${req.params.boardAlias}/${req.params.postId}`);
                    }
                });
            });
        }
        else {
            req.flash('callByRecommendation', 'true');
            req.flash('alreayRecommendation', 'true');
            res.redirect(`/board/${req.params.boardAlias}/${req.params.postId}`);
        }
    });
});

router.post('/delete_process', function (req, res, next) {
    db.query(`SELECT id, title, content, member_id FROM post WHERE id = ${req.body.postId}`, function (error, post) {

        if (req.user.email === 'admin' || post[0].member_id === req.user.id) {
            db.query(`DELETE FROM post WHERE id=${req.body.postId};`, function (error, result) {
                if (error) {
                    console.log('delete_process error!')
                }
                res.redirect(`/board/${req.body.boardAlias}`);
            });
        }
        else {
            res.send(`해당 게시글에 대한 삭제권한이 없습니다.`);
        }
    });
});

router.post('/:boardAlias', function (req, res, next) {
    db.query(`SELECT * FROM board WHERE alias = '${req.params.boardAlias}'`, function (error, board) {
        // INSERT DB
        var sql = `INSERT INTO post(title, content, date_time, recommendation, views, member_id, board_id) 
      VALUES('${req.body.title}', '${req.body.content}', NOW(), 0, 0, ${req.body.member_id}, ${board[0].id})`;
        db.query(sql, function (error, result) {
            if (result.affectedRows > 0) {
                res.redirect(`/board/${req.params.boardAlias}/${result.insertId}`);
            }
        });
    });
});

router.post('/:boardAlias/:postId', function (req, res, next) {
    if (req.user.email === 'admin' || req.body.member_id == req.user.id) {
        // UPDATE DB
        var sql = `UPDATE post SET title='${req.body.title}', content='${req.body.content}', date_time=NOW(), member_id=${req.body.member_id} WHERE id=${req.params.postId}`;
        db.query(sql, function (error, result) {
            if (result.affectedRows > 0) {
                res.redirect(`/board/${req.params.boardAlias}/${req.params.postId}`);
            }
        });
    }
    else {
        res.send(`해당 게시글에 대한 수정권한이 없습니다.`);
    }
});

module.exports = router;