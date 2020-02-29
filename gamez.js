//Select canvas Elements

const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");


// Add border to canvas
cvs.style.border = "1px solid #0f0";


//MAKE LINE THICK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

// Game Variables and constants
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;
let LIFE = 3;
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;
// let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

//CREATING THE PADDLE

const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx:5
}

//Drawing Paddle

function drawPaddle(){
    ctx.fillStyle = "#ffcc99";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // ctx.strokeStyle = "#ff00ff";
    // ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

//CONTROLLING THE PADDLE

document.addEventListener("keydown", function(event){
    if (event.keyCode == 37){
        leftArrow = true;
    }else if(event.keyCode == 39){
        rightArrow = true;
    }
});

document.addEventListener("keyup", function(event){
    if (event.keyCode == 37){
        leftArrow = false;
    }else if(event.keyCode == 39){
        rightArrow = false;
    }
});

//MOVE PADDLE

function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < cvs.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

//CREATE THE BALL

const ball ={
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 4,
    dx : 3 * (Math.random() * 2 - 1),
    dy : -3
}

//DRAW THE BALL
function drawBall(){
    ctx.beginPath();

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "#ff4000";
    ctx.fill();

    ctx.strokeStyle = "#2e3548";
    ctx.stroke();

    ctx.closePath();
}

//MOVE THE BALL
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}


//DRAW FUNCTION
function draw(){
    drawPaddle();
    drawBall();
    drawBricks();

        // SHOW SCORE
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    // SHOW LIVES
    showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width-55, 5); 
    // SHOW LEVEL
    showGameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2 - 30, 5);
}

//BALL AND WALL COLLISION DETECTED
function ballWallCollision(){
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx = -ball.dx;
    }

    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
    }

    if(ball.y + ball.radius > cvs.height){
        LIFE-- ; //LOSES LIFE
        resetBall();
    }
}

//RESET THE BALL

function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

//BALL AND PADDLE COLLISION
function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        
        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width/2);
        
        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI/3;
            
            
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

//CREATING THE BRICKS
const brick = {
    row : 3,
    column : 10,
    width : 55,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop : 40,
    fillColor : "#ffffff",
    strokeColor : "#000000"
}


let bricks = [];

function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * (brick.offSetLeft + brick.width)  + brick.offSetLeft,
                y : r * (brick.offSetTop + brick.height)  + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

// draw the bricks
function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// ball brick collision
function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    // BRICK_HIT.play();
                    ball.dy = -ball.dy;
                    b.status = false; // the brick is broken
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}

// show game stats
function showGameStats(text, textX, textY, img, imgX, imgY){
    // draw text
    ctx.fillStyle = "#FFF";
    // ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    
    // draw image
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// game over
// function gameOver(){
//     if(LIFE <= 0){
//         // showYouLose();
//         GAME_OVER = true;
//     }

//     // level up
// function levelUp(){
//     let isLevelDone = true;
    
// // check if all the bricks are broken
//    for(let r = 0; r < brick.row; r++){
//     for(let c = 0; c < brick.column; c++){
//     isLevelDone = isLevelDone && ! bricks[r][c].status;
//         }
//     }
    
//     if(isLevelDone){
//         // WIN.play();
        
//         if(LEVEL >= MAX_LEVEL){
//             // showYouWin();
//             GAME_OVER = true;
//             return;
//         }
//         brick.row++;
//         createBricks();
//         ball.speed += 0.5;
//         resetBall();
//         LEVEL++;
//     }
// }

// UPDATE GAME FUNCTION

function update(){
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    // gameOver();
    // levelUp();


    
}

//GAME LOOP
function loop(){

    // ctx.drawImage(BG_IMG,0,0);

    ctx.clearRect(0,0,1200,600);


    draw();

    update();

    requestAnimationFrame(loop);


    // if(! GAME_OVER){
    // }
}
loop();