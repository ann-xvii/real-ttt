angular
	.module("fingApp")
	.controller("Game", GameFunc);

// GameFunc.$inject = ['GridFactory'];

function GameFunc($firebase){
	var self = this;
	var ref = new Firebase('https://aoa-ttt.firebaseio.com/');
	self.fb = $firebase(ref).$asObject();

	// self.fb.$loaded().then(function(){
	// 	// initialize board here
	// 	// if(!self.fb.board){
	// 	// 	self.fb.board = []
	// 	// }

	// 	self.grid.rows = self.fb.rows;
	// 	self.fb.$save();
	// });



	self.grid = new Grid();

	// set current Player to default 1
	self.currentPlayer = 1;
	self.message = "Player " + self.currentPlayer + " starts!";

	
		

	function Grid(){
		this.rows = [[0,0,0], [0,0,0], [0,0,0]];

		this.isCSWinning = isCSWinning;
		this.check = check;
		this.cellAt = cellAt;




		function cellAt(twoDimArray){
			return this.rows[twoDimArray[0]][twoDimArray[1]];
		};


		function check(row, col){
			
			if (this.rows[row][col] === 0){
				this.rows[row][col] = self.currentPlayer;
				
				

				if(this.isCSWinning()){
					self.message = this.win === 0 ? ("Draw game") : ("Player " + this.win + " wins!");
				} else {
					self.currentPlayer = (self.currentPlayer%2) + 1;
					self.message = "Player " + self.currentPlayer + "'s turn!!";
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
				if( (this.cellAt(move[0]) > 0) && (this.cellAt(move[0]) === this.cellAt(move[1])) && (this.cellAt(move[1]) == this.cellAt(move[2])) ){
					// set win variable equal to the value in cell location, either 1 or 2
					this.win = this.cellAt(move[0]);
					// winMove = m+1 to use with the photographs...may take this out
					this.winMove = m+1;
					return true; 
				}
			}

			for (var row = 0; row < 3; row++){
				for (var col = 0; col < 3; col++){
					// if there are any unclaimed squares, return false, because a win condition has not been achieved
					if(this.cellAt([row, col]) === 0){ return false; }
				}
			}
			//this.win = 0 is the default value or the draw value; 1 and 2 are the players
			this.win = 0;
			return true; // equal
		};
	}


	
}



