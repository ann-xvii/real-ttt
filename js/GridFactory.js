angular
	.module("fingApp")
	.factory("GridFactory", GridFactory);


function GridFactory(){


	var Grid = function(){
		var self = this;
		self.rows = [[0,0,0], [0,0,0], [0,0,0]];

		self.isCSWinning = isCSWinning;
		self.check = check;
		self.cellAt = cellAt;


		function cellAt(coords){
			return self.rows[coords[0]][coords[1]];
		};


		function check(row, col){
			console.log("I've been clicked!");
			
			if (self.rows[row][col] === 0){
				self.rows[row][col] = self.currentPlayer;

				if(self.isCSWinning()){
					self.message = self.win === 0 ? ("Draw game") : ("Player " + self.win + " wins!");
				} else {
					self.currentPlayer = (self.currentPlayer%2) + 1;
					self.message = "Player " + self.currentPlayer + "'s turn!!";
				}
			} else {
				console.log("No double clicks!!");
			}
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

			
			for (var move, m=0; move= winMoves[m]; m++){
				if( (self.cellAt(move[0]) > 0) && (self.cellAt(move[0]) === self.cellAt(move[1])) && (self.cellAt(move[1]) == self.cellAt(move[2])) ){
					self.win = self.cellAt(move[0]);
					self.winMove = m+1;
					return true; 
				}
			}

			for (var row = 0; row < 3; row++){
				for (var col = 0; col < 3; col++){
					if(self.cellAt([row, col]) === 0){ return false; }
				}
			}
			self.win = 0;
			return true; // equal
		};
	}

	return Grid;



}

