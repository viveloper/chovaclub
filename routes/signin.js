var express = require('express');
var db = require('../modules/db');
var bcrypt = require('bcrypt');
var router = express.Router();

router.get('/', function (req, res, next) {
    var fmsg = req.flash();
    var feedback = '';
    if (fmsg.signinMsg) {
        feedback = fmsg.signinMsg[0];
    }
    var existingInfo = {};
    if (fmsg.existingInfo) {
        existingInfo = fmsg.existingInfo[0];
    }

    res.render('signin', {
        title: 'CHOVA CLUB',
        existingInfo: existingInfo,
        feedback: feedback
    });
});

router.post('/signin_process', function (req, res, next) {
    // 기존 입력값 유지를 위해 flash(session)에 저장
    req.flash('existingInfo', req.body);

    // 필수 입력 값 확인
    if (!req.body.email) {
        req.flash('signinMsg', '이메일을 입력하세요.');
        res.redirect('/signin');
    }
    else if (!req.body.password) {
        req.flash('signinMsg', '비밀번호를 입력하세요.');
        res.redirect('/signin');
    }
    else if (!req.body.confirmPassword) {
        req.flash('signinMsg', '비밀번호를 재입력하세요.');
        res.redirect('/signin');
    }
    else if (!req.body.name) {
        req.flash('signinMsg', '이름을 입력하세요.');
        res.redirect('/signin');
    }
    else if (!req.body.nickname) {
        req.flash('signinMsg', '닉네임을 입력하세요.');
        res.redirect('/signin');
    }
    else if (req.body.password !== req.body.confirmPassword) {
        // 비밀번호/확인비밀번호 일치 확인
        req.flash('signinMsg', '비밀번호가 일치하지 않습니다.');
        res.redirect('/signin');
    }
    else {
        db.query(`SELECT * FROM member WHERE email = '${req.body.email}'`, function (err, members) {
            if (members.length > 0 && members[0].password) {
                //이메일 중복 확인
                req.flash('signinMsg', '이미 가입된 이메일 입니다.');
                res.redirect('/signin');
            }
            else {
                db.query(`SELECT * FROM member WHERE nickname = '${req.body.nickname}'`, function (err, _members) {
                    if (_members.length > 0 && _members[0].email !== req.body.email) {
                        // 닉네임 중복 확인
                        req.flash('signinMsg', '이미 사용중인 닉네임 입니다.');
                        res.redirect('/signin');
                    }
                    else {
                        // 회원 가입
                        bcrypt.hash(req.body.password, 10, (err, hash) => {
                            var sql = '';
                            if (members.length > 0) {
                                sql = `UPDATE member SET password='${hash}', name='${req.body.name}', nickname='${req.body.nickname}', address='${req.body.address}', tel='${req.body.tel}' WHERE email='${req.body.email}'`;
                            }
                            else {
                                sql = `INSERT INTO member(email, password, name, nickname, address, tel) 
                        VALUES('${req.body.email}', '${hash}', '${req.body.name}', '${req.body.nickname}', '${req.body.address}', '${req.body.tel}')`;
                            }

                            db.query(sql, function (error, result) {
                                if (result.affectedRows > 0) {
                                    req.flash('signinMsg', '회원 가입을 축하합니다.');
                                    res.redirect('/');
                                }
                                else {
                                    // DB 등록 실패
                                    req.flash('signinMsg', '회원 가입에 실패하였습니다.');
                                    res.redirect('/signin');
                                }
                            });
                        });
                    }
                });
            }
        });
    }
});

module.exports = router;