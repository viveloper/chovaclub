function Title(props) {
    this.render = () => {
        var divTitle = document.createElement('div')
        var h1Title = document.createElement('h1');
        divTitle.appendChild(h1Title);

        var aTitle = document.createElement('a');
        h1Title.appendChild(aTitle);
        aTitle.innerText = 'CHOVA CLUB';
        aTitle.href = '/main.html';

        return divTitle;
    }
}

function BoardLink(props) {
    this.render = () => {
        var liBoard = document.createElement('li');

        var aBoardLink = document.createElement('a')
        liBoard.appendChild(aBoardLink);
        aBoardLink.style.cursor = 'pointer';
        aBoardLink.addEventListener("click", () => {
            props.onClick(props.alias, {page:1, limit:3});
        });
        aBoardLink.innerText = props.name;

        return liBoard;
    }
}

function Category(props) {
    this.render = () => {
        var liCategory = document.createElement('li');
        liCategory.innerText = props.name;

        var divBoards = document.createElement('div');
        liCategory.appendChild(divBoards);

        var ulBoards = document.createElement('ul');
        divBoards.appendChild(ulBoards);

        for (var i = 0; i < props.boards.length; i++) {
            var boardLinkComponent = new BoardLink({
                alias: props.boards[i].alias,
                name: props.boards[i].name,
                onClick: (boardAlias, params) => {
                    props.onClick(boardAlias, params);
                }
            });
            ulBoards.appendChild(boardLinkComponent.render());
        }

        return liCategory;
    }
}

function Categories(props) {
    this.render = () => {
        var divCategories = document.createElement('div')
        var ulCategories = document.createElement('ul');
        divCategories.appendChild(ulCategories);

        for (var i = 0; i < props.categories.length; i++) {
            var categoryComponent = new Category({
                name: props.categories[i].name,
                boards: props.categories[i].boards,
                onClick: (boardAlias, params) => {
                    props.onClick(boardAlias, params);
                }
            });
            ulCategories.appendChild(categoryComponent.render());
        }

        return divCategories;
    }
}

function LoginArea(props) {
    this.render = () => {
        var divLoginArea = document.createElement('div');

        var spanLoginArea = document.createElement('span');
        divLoginArea.appendChild(spanLoginArea);

        var aSignin = document.createElement('a');
        spanLoginArea.appendChild(aSignin);
        aSignin.href = '';
        aSignin.innerText = '회원가입';

        var spanSeperator = document.createElement('span');
        spanLoginArea.appendChild(spanSeperator);
        spanSeperator.innerText = ' | ';

        var aLogin = document.createElement('a');
        spanLoginArea.appendChild(aLogin);
        aLogin.href = '';
        aLogin.innerText = '로그인';

        var spanSeperator2 = document.createElement('span');
        spanLoginArea.appendChild(spanSeperator2);
        spanSeperator2.innerText = ' | ';

        var aGoogleLogin = document.createElement('a');
        spanLoginArea.appendChild(aGoogleLogin);
        aGoogleLogin.href = '';
        aGoogleLogin.innerText = '구글로 로그인';

        return divLoginArea;
    }
}

function PostLink(props) {
    this.render = () => {
        var tbodyTrBoard = document.createElement('tr');

        var tbodyTrTd = document.createElement('td');
        tbodyTrBoard.appendChild(tbodyTrTd);
        tbodyTrTd.innerText = props.post.id;

        tbodyTrTd = document.createElement('td');
        tbodyTrBoard.appendChild(tbodyTrTd);
        var aTitle = document.createElement('a');
        tbodyTrTd.appendChild(aTitle);
        aTitle.href = '';
        aTitle.innerText = props.post.title;

        tbodyTrTd = document.createElement('td');
        tbodyTrBoard.appendChild(tbodyTrTd);
        var spanNickname = document.createElement('span');
        tbodyTrTd.appendChild(spanNickname);
        spanNickname.style.cursor = 'pointer';
        spanNickname.innerText = props.post.nickname;

        tbodyTrTd = document.createElement('td');
        tbodyTrBoard.appendChild(tbodyTrTd);
        tbodyTrTd.innerText = props.post.date_time;

        tbodyTrTd = document.createElement('td');
        tbodyTrBoard.appendChild(tbodyTrTd);
        tbodyTrTd.innerText = props.post.recommendation;

        tbodyTrTd = document.createElement('td');
        tbodyTrBoard.appendChild(tbodyTrTd);
        tbodyTrTd.innerText = props.post.views;

        return tbodyTrBoard;
    }
}

function Board(props) {
    this.render = () => {
        var divBoard = document.createElement('div');

        var tableBoard = document.createElement('table');
        divBoard.appendChild(tableBoard);

        var theadBoard = document.createElement('thead');
        tableBoard.appendChild(theadBoard);

        var theadTrBoard = document.createElement('tr');
        theadBoard.appendChild(theadTrBoard);

        var theadTrThBoard = document.createElement('th');
        theadTrBoard.appendChild(theadTrThBoard);

        var theadThDiv = document.createElement('div')
        theadTrThBoard.appendChild(theadThDiv);
        theadThDiv.innerText = '번호';

        theadTrThBoard = document.createElement('th');
        theadTrBoard.appendChild(theadTrThBoard);

        theadThDiv = document.createElement('div')
        theadTrThBoard.appendChild(theadThDiv);
        theadThDiv.innerText = '제목';

        theadTrThBoard = document.createElement('th');
        theadTrBoard.appendChild(theadTrThBoard);

        theadThDiv = document.createElement('div')
        theadTrThBoard.appendChild(theadThDiv);
        theadThDiv.innerText = '작성자';

        theadTrThBoard = document.createElement('th');
        theadTrBoard.appendChild(theadTrThBoard);

        theadThDiv = document.createElement('div')
        theadTrThBoard.appendChild(theadThDiv);
        theadThDiv.innerText = '작성일';

        theadTrThBoard = document.createElement('th');
        theadTrBoard.appendChild(theadTrThBoard);

        theadThDiv = document.createElement('div')
        theadTrThBoard.appendChild(theadThDiv);
        theadThDiv.innerText = '추천';

        theadTrThBoard = document.createElement('th');
        theadTrBoard.appendChild(theadTrThBoard);

        theadThDiv = document.createElement('div')
        theadTrThBoard.appendChild(theadThDiv);
        theadThDiv.innerText = '조회';

        var tbodyBoard = document.createElement('tbody');
        tableBoard.appendChild(tbodyBoard);

        for (var i = 0; i < props.board.posts.length; i++) {
            var postLinkComponent = new PostLink({ post: props.board.posts[i] });
            tbodyBoard.appendChild(postLinkComponent.render());
        }

        // paging area
        var tablePaging = document.createElement('table');
        divBoard.appendChild(tablePaging);

        var trPaging = document.createElement('tr');
        tablePaging.appendChild(trPaging);

        var tdPrev = document.createElement('td');
        trPaging.appendChild(tdPrev);

        var aPrev = document.createElement('a');
        tdPrev.appendChild(aPrev);

        aPrev.href = '';
        aPrev.innerText = '이전페이지';

        var tdNext = document.createElement('td');
        trPaging.appendChild(tdNext);

        var aNext = document.createElement('a');
        tdNext.appendChild(aNext);

        aNext.href = '';
        aNext.innerText = '다음페이지';

        var tdPageList = document.createElement('td');
        trPaging.appendChild(tdPageList);

        var ulPageList = document.createElement('ul');
        tdPageList.appendChild(ulPageList);

        console.log(JSON.stringify(props.board.page));
        console.log(JSON.stringify(props.board.count));
        console.log(JSON.stringify(props.board.totalCount));

        return divBoard;
    }
}

function ChovaClub(props) {

    this.getCategories = (cbFunc) => {
        fetch('/restapi/categories').then((res) => {
            res.text().then((text) => {
                cbFunc(JSON.parse(text));
            });
        });
    }

    this.getBoard = (boardAlias, params, cbFunc) => {
        fetch(`/restapi/board/${boardAlias}?page=${params.page}&limit=${params.limit}`).then((res) => {
            res.text().then((text) => {
                cbFunc(JSON.parse(text));
            });
        });
    }

    this.render = (cbFunc) => {
        var divChovaClub = document.createElement('div');

        var titleComponent = new Title();
        divChovaClub.appendChild(titleComponent.render());

        this.getCategories((categories) => {
            var categoriesComponent = new Categories({
                categories: categories,
                onClick: (boardAlias, params) => {
                    this.getBoard(boardAlias, params, (board) => {
                        var boardComponent = new Board({
                            board: board
                        });
                        var renderedBoardComponent = boardComponent.render();
                        renderedBoardComponent.id = 'board';
                        if (document.getElementById('board')) {
                            document.getElementById('board').remove();
                        }
                        divChovaClub.appendChild(renderedBoardComponent);
                        cbFunc(divChovaClub);
                    });
                }
            });
            divChovaClub.appendChild(categoriesComponent.render());

            var loginArea = new LoginArea();
            divChovaClub.appendChild(loginArea.render());

            cbFunc(divChovaClub);
        });
    }
}

var chovaClub = new ChovaClub();
chovaClub.render((divChovaClub) => {
    document.getElementById('root').appendChild(divChovaClub);
});