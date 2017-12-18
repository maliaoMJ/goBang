
let chess = document.getElementById('chess')
let context = chess.getContext('2d')
//判断游戏是否结束
var over = false
//横向个数
const HORIZONTALCOUNT = 20
//垂直个数
const VERTICALCOUNT = 30 
// 格子大小
const ITEMWIDTH = 30
//黑子先行
var black = true
//赢法总和个数
var count = 0
//防止覆盖,存储棋盘的情况
var chessBoard = [] //二维数组
//赢法数组 三维数组
var wins = [] 
//赢法的统计数组 一维数组
var myWin = []
var computerWin = []
//初始化chessBoard数组数据
for(let i = 0 ; i < 30 ;i ++){
	chessBoard[i] = []
	for(let j = 0; j < 20; j++){
		//0 代表此位置未曾落字
		//1 代表此位置落黑子
		//2 代表此位置落白子
		chessBoard[i][j] = 0
	}
}
//初始化赢法数组
for(let i=0;i<VERTICALCOUNT;i++){0
	wins[i] = []
  for(let j=0;j<HORIZONTALCOUNT;j++){
  	wins[i][j] = []
  }
} 

/*--------------------------- 核心代码开始--------------------------------*/
// 统计赢法数
 //1. 横向赢法算法个数
 for(let i=0;i<VERTICALCOUNT;i++){
   for(let j=0;j<HORIZONTALCOUNT - 4 ;j++){
   	for(let k=0;k<5;k++){
      wins[i][j+k][count] = true
   	}
   	count++
   }
 }
 //2.纵向方向上的赢法
  for(let i=0;i<VERTICALCOUNT-4;i++){
   for(let j=0;j<HORIZONTALCOUNT ;j++){
   	for(let k=0;k<5;k++){
      wins[i+k][j][count] = true
   	}
   	count++
   }
 }
 //3.斜线上的所有赢法(\)
 for(let i=0;i<VERTICALCOUNT - 4;i++){
   for(let j=0;j<HORIZONTALCOUNT - 4 ;j++){
   	for(let k=0;k<5;k++){
      wins[i+k][j+k][count] = true
   	}
   	count++
   }
 } 
 //4.反斜线上的所有赢法
 for(let i=0;i<VERTICALCOUNT-4;i++){
   for(let j=HORIZONTALCOUNT-1;j>3;j--){
   	for(let k=0;k<5;k++){
      wins[i+k][j-k][count] = true
   	}
   	count++
   }
 } 
 console.log(count)
 /*------------  赢法个数 count 15x15=572-------------*/
 //初始化赢法统计数组   
for(let i = 0;i<count ;i++){
	myWin[i] = 0
	computerWin[i] = 0 
} 
 /*--------------------------- 核心代码结束 --------------------------------*/
// 给棋盘加上背景图片
let bgImg = new Image()
bgImg.src = "./bg.jpg"
bgImg.onload=()=>{
	// 图片加载完成后
	context.drawImage(bgImg, 0,0,900,600)
	drawChessBoard() 
	
    
}

// 画棋盘

function drawChessBoard(){
	// 30x20规格棋盘
    context.strokeStyle = '#3a3838'
	for(let i =0;i< VERTICALCOUNT ;i++){
	  //竖向
	 context.moveTo(15+i*ITEMWIDTH,15)
	 context.lineTo(15+i*ITEMWIDTH,585)
	 context.stroke()
	}
	for(let i = 0 ;i < HORIZONTALCOUNT ;i++){
      //横向
	 context.moveTo(15,15+ITEMWIDTH*i)
	 context.lineTo(885,15+ITEMWIDTH*i)
	 context.stroke()
	}
}
// 画棋子
function drawChessPieces(x, y , black){

    let gradient = context.createRadialGradient(15 + x * ITEMWIDTH + 2, 15 + y * ITEMWIDTH - 2,13,15 + x * ITEMWIDTH + 2, 15+y * ITEMWIDTH - 2,0)
	    if(black){
	    	// 黑棋子
	    	gradient.addColorStop (0, '#0a0a0a')
	        gradient.addColorStop(1, '#636766')
	    }else{
	    	// 白棋子
	    	gradient.addColorStop (0, '#d1d1d1')
	        gradient.addColorStop(1, '#f9f9f9')
      
	    }
		context.beginPath()
		context.arc(15 + x * ITEMWIDTH, 15+y * ITEMWIDTH, 13, 0, 2 * Math.PI)
		context.closePath()
		context.fillStyle = gradient
		context.fill()
}
// 下棋操作 对棋盘进行点击落子
chess.onclick= (e)=>{
   //判断游戏是否失败
   if(over){
    return 
   }
   if(!black){
   	return
   }
   let x = Math.floor(e.offsetX / ITEMWIDTH)
   let y = Math.floor(e.offsetY / ITEMWIDTH)
   //判断此位置是否有棋子
   if(chessBoard[x][y]===0){
	   	// 没有棋子,可以下
	   	 drawChessPieces(x,y,black)
	   	if(black){
	   		// 下黑棋子
	   		
	   		chessBoard[x][y] = 1
	   	}else{
	   		chessBoard[x][y] = 2
	   	}
   	 black = !black
   	 for(var k = 0;k < count; k++){
   	 	if(wins[x][y][k]){
   	 		myWin[k]++
   	 		computerWin[k] = 47
   	 		if(myWin[k] == 5){
             alert('你赢啦！')
              over = true
   	 		}
   	 	}
   	 }
   	 if(!over){
   	 	//游戏尚未结束计算机开始落子
   	 	computerAI()
   	 }
   } 
}
function computerAI(){
	// 人和电脑得分
 let myScore = []
 let computerScore= []
 let max =0
 var u = 0
 var v = 0
 // 初始化
 for(let i= 0;i<VERTICALCOUNT;i++){
 	myScore[i] = []
 	computerScore[i] = []
   for(let j =0;j<HORIZONTALCOUNT;j++){
     myScore[i][j] = 0
     computerScore[i][j] = 0
   }
 }
 for(let i = 0 ;i<VERTICALCOUNT;i++){
 	for(let j = 0;j<HORIZONTALCOUNT;j++){
      if(chessBoard[i][j] ==0){
        for(let k =0;k<count;k++){
        	if(wins[i][j][k]){
        		//me
        		if(myWin[k]==1){
                   myScore[i][j] += 200
        		}else if(myWin[k]==2){
        			myScore[i][j] += 400
        		}else if(myWin[k]==3){
                    myScore[i][j] += 2000
        		}else if(myWin[k]==4){
        		     myScore[i][j] += 10000	
        		}
        		//computer
        		if(computerWin[k]==1){
                   computerScore[i][j] += 220
        		}else if(computerWin[k]==2){
        			computerScore[i][j] += 440
        		}else if(computerWin[k]==3){
                    computerScore[i][j] += 2400
        		}else if(computerWin[k]==4){
        		     computerScore[i][j] += 12000	
        		}
        	}
        }
        if(myScore[i][j] > max){
          max = myScore[i][j]
          u = i
          v = j
        }else if(myScore[i][j] == max){
         if(computerScore[i][j] > computerScore[u][v]){
          u = i
          v = j
         }
        }
         if(computerScore[i][j] > max){
          max = computerScore[i][j]
          u = i
          v = j
        }else if(computerScore[i][j] == max){
         if(myScore[i][j] > myScore[u][v]){
          u = i
          v = j
         }
        }
      }
 	}

 }
 // 计算机落子
drawChessPieces(u,v,false)
chessBoard[u][v] =2 
 for(var k = 0;k < count; k++){
   	 	if(wins[u][v][k]){
   	 		computerWin[k]++
   	 		myWin[k] = 47
   	 		if(computerWin[k] == 5){
             
              over = true
              alert('电脑赢啦！')
   	 		}
   	 	}
   	 }
   	 if(!over){
   	 	//游戏尚未结束计算机开始落子
   	 	black = !black
   	 }
}
