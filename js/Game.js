angular
	.module("fingApp")
	.controller("Game", GameFunc);

// GameFunc.$inject = ['GridFactory'];
GameFunc.$inject = ['$firebase'];

function GameFunc($firebase){
	var self = this;

	self.fb = gameObject();


	function gameObject(){
		var ref = new Firebase('https://aoa-ttt.firebaseio.com/');
		var ttt = $firebase(ref).$asObject();
		return ttt;
	}

	self.fb.player1Record = 0;
		self.fb.player2Record = 0;
	self.fb.drawRecord = 0;

	self.fb.$loaded().then(function(){
		self.fb.rows = [[0,0,0], [0,0,0], [0,0,0]];
		self.fb.currentPlayer = 1;
		self.fb.message = "Player " + self.fb.currentPlayer + " starts!";
		self.fb.win = 0;
		self.fb.$save();
	});
	
	

	// self.fb.$loaded().then(function(){
	// 	// initialize board here
	// 	// if(!self.fb.board){
	// 	// 	self.fb.board = []
	// 	// }

	// 	self.grid.rows = self.fb.rows;
	// 	self.fb.$save();
	// });



	

	// set current Player to default 1

	

		// this.rows = [[0,0,0], [0,0,0], [0,0,0]];

		self.isCSWinning = isCSWinning;
		self.check = check;
		self.cellAt = cellAt;
		self.reset = reset;
		


		function cellAt(twoDimArray){
			return self.fb.rows[twoDimArray[0]][twoDimArray[1]];
		};


		function check(row, col){
			
			if (self.fb.rows[row][col] === 0){
				self.fb.rows[row][col] = self.fb.currentPlayer;
				
				

				if(self.isCSWinning()){
					self.fb.message = self.fb.win === 0 ? ("Draw game") : ("Player " + self.fb.win + " wins!");
					if (self.fb.win == 1){
						self.fb.player1Record++;
						self.fb.$save();
					} else if (self.fb.win == 2){
						self.fb.player2Record++;
						self.fb.$save();
					} else if (self.fb.win == 0){
						self.fb.drawRecord++;
						self.fb.$save();
					}
				} else {
					self.fb.currentPlayer = (self.fb.currentPlayer%2) + 1;
					self.fb.message = "Player " + self.fb.currentPlayer + "'s turn!!";
				}
			} else {
				console.log("Already taken!");
			}
			self.fb.$save();
		};




		function isCSWinning(){
			var winnerArray = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
			var winMoves = [

				[ [0,0], [1,0], [2,0] ],
				[ [0,1], [1,1], [2,1] ],
				[ [0,2], [1,2], [2,2] ],

				[ [0,0], [0,1], [0,2] ],
				[ [1,0], [1,1], [1,2] ],
				[ [2,0], [2,1], [2,2] ],

				[ [0,0], [1,1], [2,2] ],
				[ [0,2], [1,1], [2,0] ]
				];

			
			// double loop in a fashion
			// move is equal to each element in winMoves in turn; then within each element of winMove, the values stored at those coordinates are checked for equality
			// winMove[0] = [ [0,0], [1,0], [2,0] ]
			for (var move, m = 0; move = winMoves[m]; m++){
				if( (self.cellAt(move[0]) > 0) && (self.cellAt(move[0]) === self.cellAt(move[1])) && (self.cellAt(move[1]) == self.cellAt(move[2])) ){
					// set win variable equal to the value in cell location, either 1 or 2
					self.fb.win = self.cellAt(move[0]);
					// winMove = m+1 to use with the photographs...may take this out
					self.fb.winMove = m+1;
					return true; 
				}
			}

			for (var row = 0; row < 3; row++){
				for (var col = 0; col < 3; col++){
					// if there are any unclaimed squares, return false, because a win condition has not been achieved
					if(self.cellAt([row, col]) === 0){ return false; }
				}
			}
			//this.win = 0 is the default value or the draw value; 1 and 2 are the players
			self.win = 0;
			return true; // equal
		};
	

		function reset(){
			self.fb.win = 0;
			self.fb.player1Record = 0;
			self.fb.player2Record = 0;
			self.fb.drawRecord = 0;
			self.fb.$save();
		}



	
}



