var pHeight = function() { return 9; }
var pWidth = function() { return 9; }

var mHeight = Math.floor((pHeight() - 1) / 2);
var mWidth = Math.floor((pWidth() - 1) / 2);

// 4 cardinal directions
// active bit means allowed direction (no wall)
NORTH = 1;
EAST  = 2;
SOUTH = 4;
WEST  = 8;

VISITED = 32;

// Wall symbols
NWSE = 143;

NWE  = 146;
WSE  = 147;
NWS  = 145;
NSE  = 144;

WE   = 150;
NS   = 149;

SE   = 154;
WS   = 152;
NE   = 155;
NW   = 153;

opposite = function(direction) { 
  switch(direction) {
    case NORTH:
      return SOUTH;
    case SOUTH:
      return NORTH;
    case EAST:
      return WEST;
    case WEST:
      return EAST;
  }
}


// init maze
var maze = new Array(mHeight);
for(var i=0; i<mHeight; i++) {
  maze[i] = new Array(mWidth);

  for(var j=0; j<mWidth; j++) {
    maze[i][j] = 0;
  }
}

// init print
var print = new Array(pHeight());
for(var i=0; i<pHeight(); i++) {
  print[i] = new Array(pWidth());

  for(var j=0; j<pWidth(); j++) {
    print[i][j] = 0;
  }
}


/* Shuffle an array */
Array.prototype.shuffle = function() {
    var tmp, current, top = this.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = this[current];
        this[current] = this[top];
        this[top] = tmp;
    }

    return this;
}

printMaze = function() {
  // print vertical walls between cells
  for(var i=1; i<pHeight()-1; i=i+2) {
    for(var j=2; j<pWidth()-1; j=j+2) {
      var mI = Math.floor((i-1)/2);
      var mJ = Math.floor((j-1)/2);

      if(MazeGenerator.hasWall(mI, mJ, WEST)) {
        print[i][j] = NS;
      }
    }
  }

  // print horizontal walls between cells
  for(var i=2; i<pHeight()-1; i=i+2) {
    for(var j=1; j<pWidth()-1; j=j+2) {
      var mI = Math.floor((i-1)/2);
      var mJ = Math.floor((j-1)/2);

      if(MazeGenerator.hasWall(mI, mJ, SOUTH)) {
        print[i][j] = WE;
      }
    }
  }

  // print walls between walls and west and south border
  for(var i=2; i<pHeight()-1; i=i+2) {
    for(var j=2; j<pWidth()-1; j=j+2) {
      if(print[i-1][j] && print[i+1][j])
        print[i][j] = NS;

      if(print[i][j-1] && print[i][j+1])
        print[i][j] = WE;

      if(print[i+1][j] && print[i][j-1])
        print[i][j] = SE;

      if(print[i][j+1] && print[i+1][j])
        print[i][j] = WS;

      if(print[i-1][j] && print[i][j+1])
        print[i][j] = NW;

      if(print[i-1][j] && print[i][j-1])
        print[i][j] = NE;

      if(print[i-1][j] && print[i][j-1] && print[i+1][j])
        print[i][j] = NSE;

      if(print[i-1][j] && print[i][j-1] && print[i][j+1])
        print[i][j] = NWE;

      if(print[i][j-1] && print[i][j+1] && print[i+1][j])
        print[i][j] = WSE;

      if(print[i-1][j] && print[i][j+1] && print[i+1][j])
        print[i][j] = NWS;

      if(print[i-1][j] && print[i+1][j] && print[i][j-1] && print[i][j+1])
        print[i][j] = NWSE;
    }
  }

  //print north border
  var i=0;
  for(var j = 0; j<pWidth()-1; j++) {
    if(j===0) {
      print[i][j] = WS;
    }
    else if(j === pWidth() - 2) {
      print[i][j] = SE;
    }
    else if(j % 2 === 1) {
      print[i][j] = WE;
    }
    else {
      if(print[i+1][j] === 0) {
        print[i][j] = WE;
      }
      else {
        print[i][j] = WSE;
      }
    }
  }

  //print east border
  var j=0;
  for(var i = 1; i<pHeight()-1; i++) {
    if(i === pHeight()-2) {
      print[i][j] = NW;
    }
    else if(i % 2 === 1) {
      print[i][j] = NS;
    }
    else {
      if(print[i][j+1] === 0) {
        print[i][j] = NS;
      }
      else {
        print[i][j] = NWS;
      }
    }
  }

  // print start and end points
  print[1][pWidth()-2] = 0;
  print[1][pWidth()-1] = 94; //'^'

  print[pHeight()-3][0] = 0;

  // flush print
  for(var i=0; i<pHeight(); i++) {
    for(var j=0; j<pWidth(); j++) {
      if(print[i][j] > 0) {
        pSymbolA(print[i][j]);
        pPixel(j, i);
      }
    }
  }
}

printVisitedCells = function() {
  // print visited cells
  for(var i=1; i<pHeight()-1; i=i+2) {
    for(var j=1; j<pWidth()-1; j=j+2) {
      var mI = Math.floor((i-1)/2);
      var mJ = Math.floor((j-1)/2);
      if(MazeGenerator.isVisited(mI,mJ)) {
        pSymbolA(135);
        pPixel(j,i);
      }
    }
  }
}

MazeGenerator = {
  'hasWall': function(i, j, direction) {
    return !(direction & maze[i][j]);
  },

  'allow': function(i, j, direction) {
    maze[i][j] = maze[i][j] | direction;
    var neighbor = this.go(i,j,direction);
    maze[neighbor[0]][neighbor[1]] = maze[neighbor[0]][neighbor[1]] | opposite(direction);
  },

  'isVisited': function(i, j) {
    return maze[i][j] & VISITED;
  },

  'visit': function(i, j) {
    maze[i][j] = maze[i][j] | VISITED;
  },

  'neighboringDirections': function(i, j) {
    var directions = [];

    if(i > 0) 
      directions.push(NORTH);

    if(i < mHeight - 1) 
      directions.push(SOUTH);

    if(j > 0) 
      directions.push(EAST);

    if(j < mWidth - 1) 
      directions.push(WEST);
    
    return directions;
  },

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
        coords[1] -= 1;
        break;
      case WEST:
        coords[1] += 1;
        break;
    }

    return coords;
  },

  'neighbors': function(i, j) {
    var neighbors = [];
    var neighboringDirections = this.neighboringDirections(i,j);

    for(var k=0; k<neighboringDirections.length; k++) {
      var direction = neighboringDirections[k];

      neighbors.push( this.go(i, j, direction) );
    }

    return neighbors;
  },

  'randomCell': function() {
    var x = Math.floor(Math.random() * mHeight);
    var y = Math.floor(Math.random() * mWidth);

    return [x,y];
  },

  'generateMaze': function() {
    cell = this.randomCell();
    this.randomDFS(cell[0], cell[1]);
  },

  'randomDFS': function(i, j) {
    this.visit(i, j);

    var neighboringDirections = this.neighboringDirections(i, j);
    neighboringDirections.shuffle();

    for(var k=0; k<neighboringDirections.length; k++) {
      var direction = neighboringDirections[k];

      var neighbor = this.go(i, j, direction);
      if(!this.isVisited(neighbor[0], neighbor[1])) {
        this.allow(i, j, direction);

        this.randomDFS(neighbor[0], neighbor[1]);
      }
    }
  }
}

MazeGenerator.generateMaze();

printMaze();
