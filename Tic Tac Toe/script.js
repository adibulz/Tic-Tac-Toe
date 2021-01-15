const player = {
    sign:"",
    moves:[]
}

const ai = {
    sign:"",
    moves:[]
}

let mode = "";
let countMoves = 0;
let turn = "";
let board = [
    ["","",""],
    ["","",""],
    ["","",""]
];

function startGame(){
    mode = $(`#mode :selected`).html();
    player.sign = $(`#sign :selected`).html();
    ai.sign = player.sign === "X" ? "O" : "X";
    turn = player.sign === "X" ? "player" : "ai";
    clearBoard();
}

function clearBoard(){
    $(`.grid-item`).html(``);
    turn = "";
    lastMove = 0;
    player.moves = [];
    ai.moves = [];
    countMoves = 0;
    board = [
        ["","",""],
        ["","",""],
        ["","",""]
    ];
}

function playCell(cell){
    $(`#${cell}`).html(`${ai.sign}`)
    $(`#${cell}`).attr(`disabled`, `true`)
}

function chooseAiMove(){
    const emptySpaces = countEmptySpaces();
    let bestMove;
    let foundDraw = false;
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            if (board[i][j] !== "") continue;
            board[i][j] = ai.sign;
            let result = probability(board, emptySpaces-1, player.sign);
            console.log(i, j, result);
            board[i][j] = "";
            if (result === ai.sign) return [i,j];
            if (bestMove === undefined || !foundDraw){ 
                bestMove = [i,j];
                foundDraw = result === "D";
            }
        }
    }
    return bestMove;
}

function countEmptySpaces(){
    let count = 0;
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            if (board[i][j] === "") count++;
        }
    }
    return count;
}

function randomMove(){
    let avilableSpaces = [];
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            if (board[i][j] === "") avilableSpaces.push([i,j]);
        }
    }
    return avilableSpaces[Math.floor(Math.random() * avilableSpaces.length)];
}

function probability(board,emptySpaces,turn){
    if(checkWin(board,"X"))  return "X";
    else if(checkWin(board,"O"))  return "O";
    else if (emptySpaces === 0)   return "D"; 
    let hasWin = false, hasDraw = false;
    for(let i = 0; i<3; i++){
        for(let j = 0; j<3; j++){
            if(board[i][j]!=="") continue;
            board[i][j]=turn;
            let result = probability(board,emptySpaces-1, turn === "X" ? "O" : "X");
            board[i][j]="";
            if (result === "D") hasDraw = true;
            else if (result === turn) hasWin = true; 
        }
    }
    if (hasWin) return turn;
    else if (hasDraw) return "D";
    else return turn === "X" ? "O" : "X";
}

function checkWin(board,c){
    for(let i = 0; i<3; i++){
        let counter = 0;
        for(let j = 0; j<3; j++) if(board[i][j]===c) counter++;
        if(counter === 3) return true;
    }

    for(let i = 0; i<3; i++){
        let counter = 0;
        for(let j = 0; j<3; j++) if(board[j][i]===c) counter++; 
        if(counter === 3) return true;
    }

    let counter = 0;
    for(let i = 0; i<3; i++) if(board[i][i]===c) counter++;
    if(counter === 3)return true;

    counter = 0;
    for(let i = 0; i<3; i++) if(board[i][2-i]===c) counter++;
    if(counter === 3) return true;
    return false;
}

function aiPlays(){
    let move = chooseAiMove();
    if(mode === "Friendly" && countMoves >1 ) move = randomMove();
    board[move[0]][move[1]]= ai.sign;
    ai.moves.push(move);
    $(`#${move[0]*3+1+move[1]}`).html(ai.sign);
    $(`#${move[0]*3+1+move[1]}`).attr(`disabled`, `true`);
    countMoves++;
} 

function displayWin(){
    $(`.grid-item`).attr(`disabled`,'true');
 //   setTimeout(() => alert(`You win! Get yourself a cookie.`), 100);
   /*  $(`.end-game`).html(`You win! Get yourself a cookie.`)
    $(`.end-game`).animate({
        position: `relative`,
        marginTop: `80px`,
        marginLeft: `230px`,
    },`fast`) */
}



function displayLose(){
    $(`.grid-item`).attr(`disabled`,'true');
    setTimeout(() => alert(`You lose! No cookies for you.`), 100);
}

function displayDraw(){
    $(`.grid-item`).attr(`disabled`,'true');
    setTimeout(() => alert('Draw! Cookies for no one.'), 100);
}

$("#start").on("click",function(){
    startGame();
    for(let i = 1; i <= 9; i++) $(`#${i}`).removeAttr(`disabled`);
    if(ai.sign==="X") aiPlays();
})

$(`.grid-item`).on(`click`,function(e){
    let target = $(e.target);
    const btn =parseInt(target.attr(`id`))
    target.html(`${player.sign}`);
    target.attr('disabled', 'true');
    player.moves.push(parseInt(target.attr(`id`)));
    board[parseInt((btn-1)/3)][(btn-1)%3]=player.sign;
    if(checkWin(board,player.sign)){
        displayWin();
        return;
    }
    if (countEmptySpaces() === 0){
        displayDraw();
        return;
    }
    aiPlays();
    if(checkWin(board,ai.sign)){
        displayLose();
        return;
    }
    if (countEmptySpaces() === 0){
        displayDraw();
        return;
    }
})

$(document).ready(function(){
    $("#start").on("click",function(){
        for(let i = 1; i<10; i++){
            $(`#${i}`).animate({
                position: `relative`,
                marginTop: `80px`,
                marginLeft: `230px`,
            },`fast`)
        }
    })

})



