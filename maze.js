var pHeight = pHeight();
var pWidth = pWidth();

var mHeight = (pHeight - 1) / 2;
var mWidth = (pWidth - 1) / 2;

// 4 cardinal directions
NORTH = 1;
EAST  = 2;
SOUTH = 4;
WEST  = 8;


VISITED = 32;

// init maze
var maze = new Array(mHeight);
for(var i=0; i<mHeight; i++) {
  maze[i] = new Array(mWidth);

  for(var j=0; j<mWidth; j++) {
    maze[i][j] = 0;
  }
}

MazeGenerator = {
  'hasWall': function(i, j, direction) {
    return !(direction & maze[i][j]);
  },

  'allow': function(i, j, direction) {
    maze[i][j] = maze[i][j] | direction;
  }

  'isVisited': function(i, j) {
    return maze[i][j] & VISITED;
  }

  'visit': function(i, j) {
    maze[i][j] = maze[i][j] | VISITED;
  }

  'neighboringDirections': function(i, j) {
    directions = [];

    if(i > 0) 
      directions.push(NORTH);

    if(i < mHeight - 1) 
      directions.push(SOUTH);

    if(j > 0) 
      directions.push(WEST);

    if(j < mWidth - 1) 
      directions.push(EAST);
  }

  'go': function(i, j, direction) {
    var neighboringDirections = this.neighboringDirections(i,j);

    if(neighboringDirections.indexOf(direction) === -1) {
      return false;
    }

    var coords = [i, j];
    switch(direction) {
      case NORTH:
        coords[0] -= 1; 
        break;
      case SOUTH:
        coords[0] += 1; 
        break;
      case EAST:
        coords[1] += 1;
        break;
      case WEST:
        coords[1] -= 1;
        break;
    }

    return coords;
  }

  'neighbors': function(i, j) {
    var neighbors = [];
    var neighboringDirections = this.neighboringDirections(i,j);

    for(var direction in neighboringDirections) {
      neighbors.push( this.go(i, j, direction) );
    }

    return neighbors;
  }

  'randomCell': function() {
    var x = Math.floor(Math.random() * mHeight);
    var y = Math.floor(Math.random() * mWidth);

    return [x,y];
  }

  'generateMaze': function() {
    cell = this.randomCell();
    this.visit(cell[0], cell[1]);
  }
}
