// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}


// The player class used in this program
function Player() {
    this.node = svgdoc.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
    // direction denote the facing of player 0 means player is facing right, and 1 means player is facing left
    this.direction = 0;
    
}
// The function class used in tracking the direction of bullets
// "1" means right direction and "-1" means left direction

var bullet_speed = [];


// The exit class shown the goal of game
function Exit() {
    this.node = svgdoc.getElementById("exit");
    this.position = EXIT_POS;
}
// The function control sound effect of game
function playsnd(id) {
    //
    if (isASV) {
        var snd = svgdoc.getElementById(id + "_asv");
        snd.endElement();
        snd.beginElement();
    }
    if (isFF) {
        var snd = svgdoc.getElementById(id);
        snd.currentTime = 0;
        snd.play();
    }
}


//
// Check whether good thing is Onplatform
//
function check_good_thing_position(position){
    // var MONEY_SIZE = new Size(30, 30);          // The size of money
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
        
        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var platform_positon = new Point(x,y);
        var platform_size = new Size(w,h);
        if (intersect(position, MONEY_SIZE, platform_positon, platform_size)==true){
            return false;
        }
            
            
    }
    
    
    return true;
    
}

Player.prototype.isOnPlatform = function() {
    
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
        
        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}


//
// Below are constants used in the game
//

var name = null;

var ball_left = 8;
var flip = false;                           // Whether flip or not

var PLAYER_SIZE = new Size(38, 38);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(0, 420);   // The initial position of the player

//var LOGO_POS = new point(640,100);
var EXIT_POS = new Point(0, 0);             // The exit of the game
var EXIT_SIZE = new Size(20, 30);          // The size of the exit
// Transmisson Gate
var TRANS1_POS = new Point(0, 270);
var TRANS1_SIZE = new Size(20, 20);

var TRANS2_POS = new Point(550, 230);
var TRANS2_SIZE = new Size(20, 20);



var MONSTER_DISPLACEMENT = 10;               // The speed of movement of monster

var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game

var BULLET_SIZE = new Size(10, 10);         // The speed of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet
                                            //  = pixels it moves each game loop
var SHOOT_INTERVAL = 500.0;                 // The period when shooting is disabled
var canShoot = true;                        // A flag indicating whether the player can shoot a bullet

var MONSTER_SIZE = new Size(40, 40);        // The size of monster
var INIT_NUMBER_OF_MONSTER = 6;             // The number of monster assigned in the beginning

var MONEY_SIZE = new Size(30, 30);          // The size of money
var INIT_NUMBER_OF_MONEY = 10;

var GAME_TIME = 50;                         // The time limit of game

var REWARD_PER_SECOND = 100;                // When player finish game early, it get reward according to time
var REWARD_PER_MONSTER = 1000;              // When player kill monster, increase score
var REWARD_PER_MONEY_BAG = 500;             // When player get money bag, increase score

var extra_reward = 1;						// Extra reward will be given under zoom mode
// Variable for bullet 
var TOTAL_BALLS = 8;
var remaining_balls = 8;
var usage_of_balls = [0,0,0,0,0,0,0,0];		// 0 means balls are not being used, 1 means go right, -1 means go left


var disappear_plateform_opacity = [1,1,1];	// track opacity of three disappear plateform
var MONSTER_DISPLACEMENT_x = 1;
var MONSTER_DISPLACEMENT_y = 1;
var MONSTER_DISPLACEMENT_x_arr = [];
var MONSTER_DISPLACEMENT_y_arr = [];
var MONSTER_flip_arr = [];


//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum

var cheat_mode = false;                     // default game mode, no cheat



var svgdoc = null;                          // SVG root document node
var player = null;                          // The player object
var gameInterval = null;                    // The interval
var zoom = 1.0;                             // The zoom level of the screen
var score = 0;                              // The score of current player
var time_remaining = GAME_TIME;             // Time remainning will added to score if you finish game early
var finished=false;                         // Indicate whether the game is finished or not
var Sound1, Sound2;                         // Declare the different sound effect
var moving_timer, count_down_timer, monster_move_timer;        // Declare the two timers
var isASV = false;
var isFF = false;

var monster_flip = true;
//
// The function switch cheat mode 
//

function update_cheat_mode(){
    if(cheat_mode == true){
        svgdoc.getElementById("cheat").firstChild.data = "ON";
    }
    else{
        svgdoc.getElementById("cheat").firstChild.data = "OFF";
    }
    
}



//
// The function update score
//
function update_score(){
    // var timer_element = document.getElementById("score_text");
    // timer_element.innerHTML = "Score accumulated: " + score;
    svgdoc.getElementById("score").firstChild.data = score;
}

//
// Move monster randomly
//
function move_moster(){
    // flip the monster and move monster to new place
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++){
        var monster = monsters.childNodes.item(i);
        //var x = parseInt(monster.getAttribute("x"));
        //var y = parseInt(monster.getAttribute("y"));
        var action_taken_by_monster = parseInt(Math.random()*4);
        //var action_taken_by_monster = 0;
        //console.log(action_taken_by_monster);
        
        switch (action_taken_by_monster) {
            case 0:     // monster go left
                
                MONSTER_DISPLACEMENT_x_arr[i] = -1;
				MONSTER_DISPLACEMENT_y_arr[i] = 1;
				
                if(MONSTER_flip_arr[i] == true){MONSTER_flip_arr[i]=false;}
                //MONSTER_flip_arr[i]=false;
                
                break;
                
            case 1:     // monster go right
            	MONSTER_DISPLACEMENT_x_arr[i] = 1;
				MONSTER_DISPLACEMENT_y_arr[i] = -1;
				if(MONSTER_flip_arr[i] ==false){MONSTER_flip_arr[i]=true;}
                
                break;
            case 2:     // monster go up
                MONSTER_DISPLACEMENT_x_arr[i] = -1;
				MONSTER_DISPLACEMENT_y_arr[i] = -1; 
				
				if(MONSTER_flip_arr[i] ==true){MONSTER_flip_arr[i]=false;}
				//monster_flip =true;               
				//MONSTER_flip_arr[i]=false;
				break;
                
            case 3:     // monster go down
                MONSTER_DISPLACEMENT_x_arr[i] = 1;
				MONSTER_DISPLACEMENT_y_arr[i] = 1;
				
				if(MONSTER_flip_arr[i] ==false){MONSTER_flip_arr[i]=true;}
                break;
                
        }
    }
}


//
// The function control remainding time of time
//
function count_down(){
    // decrease remaining time by one
    time_remaining = time_remaining - 1;
    // update the text display
    // var timer_element = document.getElementById("timer_text");
    // timer_element.innerHTML = "Time remaining: " + time_remaining + " sec";
    svgdoc.getElementById("time_remaining").firstChild.data = time_remaining+"s";
    
    svgdoc.getElementById("time_bar").setAttribute("width", (parseFloat(time_remaining)/parseFloat(GAME_TIME)*140.0));
    
    if (time_remaining==60){
        playsnd("bgm");
    }
    if (time_remaining==30){
        playsnd("bgm");
    }
    // call the function again after one second or finish the game
    if (time_remaining == 0){
        svgdoc.getElementById("time_remaining").firstChild.data = "0s";
        setTimeout("game_over()",1);
    }
    else{
        count_down_timer = setTimeout("count_down()", 1000);
    }
}
//
// stopGame(), it is invoke before winGame and LoseGame
//
function stop_game(){
    // set the variable, finished, to true
    flip == false;
    canShoot == false;
    finished = true;
    cheat_mode = false;
    zoom = 1.0;
    MONSTER_DISPLACEMENT = 0;
    MONSTER_DISPLACEMENT_x = 0;
    MONSTER_DISPLACEMENT_y = 0;
    svgdoc.getElementById("player_name_g").style.setProperty("visibility","hidden",null);
    // clear the two timers
    clearTimeout(count_down_timer);
    clearTimeout(moving_timer);
    // remove all the bullet
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        bullets.removeChild(bullet);
    }
    // remove all the monster
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);
        monsters.removeChild(monster);
    }
    //
    
}
//
// Record your score
//
function record_score(){
    // Get the high score table from cookies
    var table = getHighScoreTable();
    
    //var name = prompt("What is your name?","no name");
    var record = new ScoreRecord(name,score);
    
    // Insert the new score record
    var pos = table.length;
    for (var i = 0 ; i < table.length;i++){
        if(record.score >table[i].score){
            pos = i;
            break;
        }
    }
    table.splice(pos,0,record);
    
    // Store the new high score table
    setHighScoreTable(table);
    // Show the high score table
    showHighScoreTable(table);
}

//
// The function show the game won message
//
function game_won(){
    playsnd("win");
    // stop the game;
    stop_game();
    
    score = score + time_remaining*REWARD_PER_SECOND*extra_reward;
        update_score();
    record_score();
    svgdoc.getElementById("gamewon").style.setProperty("visibility","visible",null);
    svgdoc.getElementById("playagain").style.setProperty("visibility","visible",null);
    //alert("game won!!!");
    
    
    
}


//
// The function show the game over message
//
function game_over(){
    // play player die music
    playsnd("player_die");
    // stop the game;
    stop_game();
    // remove player, player die
    var player_object = svgdoc.getElementById("player");
    player_object.parentNode.removeChild(player_object);
    // var timer_element = document.getElementById("timer_text");
    // timer_element.innerHTML = "Time remaining: 0 sec";
    record_score();
    svgdoc.getElementById("gameover").style.setProperty("visibility","visible",null);
    svgdoc.getElementById("playagain").style.setProperty("visibility","visible",null);
    //alert("Times up!!!");
    
    
    
}

//
// The load function for zoom mode
//
function load_zoom_mode(evt){
	setZoom();
	load(evt);
}

//
// The function is invoked by clicking "play again"
//
function reset_then_load(){
	location.reload();
}


//
// The load function for the SVG document
//
function load(evt) {
	// Set the root node to the global variable
    svgdoc = evt.target.ownerDocument;

	
	
	// hide welcome screen


	
	
	
	svgdoc.getElementById("startingscreen").style.setProperty("visibility","hidden",null);
	svgdoc.getElementById("normal_mode").style.setProperty("visibility","hidden",null);

	svgdoc.getElementById("zoom_mode").style.setProperty("visibility","hidden",null);

	
	//var start_screen = svgdoc.getElementById("startingscreen");
	//start_screen.parentNode.removeChild(start_screen);
	// show starting screen
	
	
	
	// ask player enter his name 
	name = prompt("What is your name?","no name");
    name = name.trim();
        // handler space name
    if(name == ""){
        name = "Anonymous";
        svgdoc.getElementById("player_name").firstChild.data = "Anonymous"; 
    }
    else{
	    svgdoc.getElementById("player_name").firstChild.data = name; 

    }
    
        
    	
    // check the environment of broswer
    isASV = (window.navigator.appName == "Adobe SVG Viewer");
    isFF = (window.navigator.appName == "Netscape");
    
    
    // Attach keyboard events
    svgdoc.documentElement.addEventListener("keydown", keydown, false);
    svgdoc.documentElement.addEventListener("keyup", keyup, false);
    
    // Remove text nodes in the 'platforms' group
    cleanUpGroup("platforms", true);
        
    
    
    
    // Create the player
    player = new Player();
    // Create name for player 
    if(name!= null){
    	//createName(100, 100, name);
    }

    
    
    // Craete the exit
    exit = new Exit();
    // Post the lofo
    // Craete the exit
    //logo = new PokoLogo();
    // var PLAYER_INIT_POS  = new Point(0, 420);   // The initial position of the player
    // SCREEN_SIZE = new Size(600, 560)
    // Create the monsters
    for(var i = 0;i < INIT_NUMBER_OF_MONSTER;i++){
        var monster_init_x = 450*Math.random()+100;
        var monster_init_y = 510*Math.random();
        
        while(intersect(player.position,new Size(58, 58),new Point(monster_init_x,monster_init_y),MONSTER_SIZE)){
            monster_init_x = 550*Math.random();
            monster_init_y = 510*Math.random();
            
        }
        createMonster(monster_init_x, monster_init_y);
    }
   
    // Create the moneys
    
    for(var i = 0;i < INIT_NUMBER_OF_MONEY;i++){
        var money_init_x = 450*Math.random()+100;
        var money_init_y = 510*Math.random();
        var money_position = new Point(money_init_x,money_init_y);
        while(intersect(player.position,PLAYER_SIZE,new Point(money_init_x,money_init_y),MONEY_SIZE) ||
              check_good_thing_position(money_position)==false){
            money_init_x = 510*Math.random()+40;
            money_init_y = 510*Math.random();
            money_position = new Point(money_init_x,money_init_y);
            
        }
        createMoney(money_init_x, money_init_y);
    }
        
    
    
    

    
    
    playsnd("bgm");
    // Start the timer
    count_down_timer = setTimeout("count_down()", 1000);
    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
    // Start the monster timer
    monster_move_timer = setInterval("move_moster()",3000);
}
//
// This function remove disappear plateform
//
function remove_plate_form(index_of_plateform){
	if(index_of_plateform == 0){
		var dp1 = svgdoc.getElementById("disappear_plateform_1");
		if(dp1 != null){
			dp1.parentNode.removeChild(dp1);
		}
	}
	else if(index_of_plateform ==1){
		var dp2 = svgdoc.getElementById("disappear_plateform_2");
		if(dp2 != null){
			dp2.parentNode.removeChild(dp2);
		}

	}
	else if(index_of_plateform == 2){
		var dp3 = svgdoc.getElementById("disappear_plateform_3");
		if(dp3!=null){
			dp3.parentNode.removeChild(dp3);
		}

	}
	else{
		alert("no plateform removed");
	}
}

//
// This function removes all/certain nodes under a group
//
function cleanUpGroup(id, textOnly) {
    var node, next;
    var group = svgdoc.getElementById(id);
    node = group.firstChild;
    while (node != null) {
        next = node.nextSibling;
        if (!textOnly || node.nodeType == 3) // A text node
            group.removeChild(node);
        node = next;
    }
}


//
// This function create the texts for player
//

//
// This function creates the monsters in the game
//
function createMonster(x, y) {
    
    var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    svgdoc.getElementById("monsters").appendChild(monster);
    var initial_action = Math.random()*2.0-1;
    MONSTER_DISPLACEMENT_x_arr.push(initial_action);
    MONSTER_DISPLACEMENT_y_arr.push(Math.random()*2.0-1);
    if(initial_action<=0){
	    MONSTER_flip_arr.push(false);
	    console.log(MONSTER_flip_arr.length);
    }
    else{
	    MONSTER_flip_arr.push(true);
	    console.log(MONSTER_flip_arr.length);
    }
    
    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");
    
    monster.setAttribute("x", x);
    monster.setAttribute("y", y);
}
//
// This function creates the money bags in the game
//
function createMoney(x, y) {
    var money = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    svgdoc.getElementById("moneys").appendChild(money);
    money.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#money");
    
    money.setAttribute("x", x);
    money.setAttribute("y", y);
}

//
// This function shoots a bullet from the player
//
function shootBullet() {
    
    // Disable shooting for a short period of time
    canShoot = false;
    setTimeout("canShoot = true",SHOOT_INTERVAL);
    
    // Create the bullet using the use node
    var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    svgdoc.getElementById("bullets").appendChild(bullet);
    
    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");
    // var usage_of_balls = [0,0,0,0,0,0,0,0]; 0 means balls are not being used, 1 means go right, -1 means go left
    // direction denote the facing of player 0 means player is facing right, and 1 means player is facing left
    // this.direction = 0;

    if(player.direction == 0){
        if((remaining_balls>0 || cheat_mode ==1)&&finished==false){
	        playsnd("shoot");
        	var bullet_x = player.position.x + PLAYER_SIZE.w/2.0 - BULLET_SIZE.w/2.0;
			var bullet_y = player.position.y + PLAYER_SIZE.h/2.0 - BULLET_SIZE.h/2.0;
			
			
			
			bullet_speed[svgdoc.getElementById("bullets").childNodes.length-1] = 10;			
			
			//BULLET_SPEED = 10;
			
			// under cheat mode, the number of bullet will not decreased 
	        if(cheat_mode == 0&&finished==false){
	        	remaining_balls--;
				svgdoc.getElementById("ball_remaining").firstChild.data = remaining_balls;
	        }
			
        }
        
    }
    else{
	    if((remaining_balls>0 || cheat_mode == 1)&&finished==false){
		    playsnd("shoot");
	        var bullet_x = player.position.x - PLAYER_SIZE.w/2.0 + BULLET_SIZE.w/2.0;
	        var bullet_y = player.position.y + PLAYER_SIZE.h/2.0 - BULLET_SIZE.h/2.0;
	        
	        
			bullet_speed[svgdoc.getElementById("bullets").childNodes.length-1] = -10;	
	        
	        
	        //BULLET_SPEED = -10;
	        // under cheat mode, the number of bullet will not decreased 
	        if(cheat_mode == 0 && finished==false){
	        	remaining_balls--;
				svgdoc.getElementById("ball_remaining").firstChild.data = remaining_balls;
	        }
    	}
    }
    
    bullet.setAttribute("x", bullet_x);
    bullet.setAttribute("y", bullet_y);
}


//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            //var previous_motion = player.motion;
            
            player.motion = motionType.LEFT;
            player.direction =1;
            
            if(flip == true){
                flip = false;
            }
            
            
            break;

        case "D".charCodeAt(0):
            //var previous_motion = player.motion;
            
            player.motion = motionType.RIGHT;
            
            player.direction =0;
            if(flip == false){
                flip = true;
            }
            
                        
            
            break;
			
        case "W".charCodeAt(0):
            if (player.isOnPlatform()||cheat_mode==true) {
                player.verticalSpeed = JUMP_SPEED;
            }
            break;
        // c – cheat mode on
        case "C".charCodeAt(0):
            cheat_mode = true;
            update_cheat_mode();
            svgdoc.getElementById("ball_remaining").firstChild.data = "infinity";
            svgdoc.getElementById("player").style.opacity = 0.5;
            SHOOT_INTERVAL = 0;
            
            break;
        // v – cheat mode off
        case "V".charCodeAt(0):
            cheat_mode = false;
            update_cheat_mode();
            svgdoc.getElementById("ball_remaining").firstChild.data = remaining_balls;
            svgdoc.getElementById("player").style.opacity = 1.0;
            SHOOT_INTERVAL = 500;
            break;
	//add a case to shoot bullet
        case 32:
            // check whether we can shoot, then we shoot bullet
            if(canShoot)
                shootBullet();
            break;
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            
            break;

        case "D".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}


//
// This function checks collision
//
function collisionDetection() {
    // Check whether the player collides with a monster
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);
        var x = parseInt(monster.getAttribute("x"));
        var y = parseInt(monster.getAttribute("y"));

	// For each monster check if it overlaps with the player
        // if yes, stop the game
        if (intersect(new Point(x, y), MONSTER_SIZE, player.position, PLAYER_SIZE) && cheat_mode== false) {
            // remove player
            //var players = svgdoc.getElementById("player");
            //for (var i = 0; i < players.childNodes.length; i++) {
                //var player_object = players.childNodes.item(i);
                //players.removeChild(player_object);
            //}
            // Clear the game interval
            clearInterval(gameInterval);
            // Lose game
            game_over();
            
            
            return;
        }
        
    }
    
    // Check whether the player collides with a money
    var moneys = svgdoc.getElementById("moneys");
    for (var i = 0; i < moneys.childNodes.length; i++) {
        var money = moneys.childNodes.item(i);
        var x = parseInt(money.getAttribute("x"));
        var y = parseInt(money.getAttribute("y"));
        
        // For each monster check if it overlaps with the player
        // if yes, get reward, update score, remove money
        if(intersect(player.position,PLAYER_SIZE,new Point(x,y),MONEY_SIZE)){
            moneys.removeChild(money);
            score = score + REWARD_PER_MONEY_BAG*extra_reward;
            update_score();
            i--;
            //clearInterval(gameInterval);
        }
        
    }
    // Transmission handler
    // Transmisson Gate
    //var TRANS1_POS = new Ponit(0, 270);
    //var TRANS1_SIZE = new SIZE(20, 20);
    
    //var TRANS2_POS = new Ponit(550, 230);
    //var TRANS2_SIZE = new SIZE(20, 20);
    if(intersect(player.position,PLAYER_SIZE,TRANS1_POS,TRANS1_SIZE)){
        // move player to another door
        // Get the new position of the player
        var position = new Point();
        position.x = 510;
        position.y = 230;
        
        player.position = position;
        updateScreen();
        
        
    }
    if(intersect(player.position,PLAYER_SIZE,TRANS2_POS,TRANS2_SIZE)){
        // move player to another door
        // Get the new position of the player
        var position = new Point();
        position.x = 25;
        position.y = 270;
        player.position = position;
        updateScreen();
        
    }
    // track condition of disappear plateform
        var disappear_plateform_array =  [svgdoc.getElementById("disappear_plateform_1"),svgdoc.getElementById("disappear_plateform_2"),svgdoc.getElementById("disappear_plateform_3")];
    for(var i = 0;i<disappear_plateform_array.length;i++){
	    var isOnDisappearPlatform = false;
	    
	    var node = disappear_plateform_array[i];
        if (node != null){
        
	        var x = parseFloat(node.getAttribute("x"));
	        var y = parseFloat(node.getAttribute("y"));
	        var w = parseFloat(node.getAttribute("width"));
	        var h = parseFloat(node.getAttribute("height"));

	        if (((player.position.x + PLAYER_SIZE.w > x && player.position.x < x + w) ||
	             ((player.position.x + PLAYER_SIZE.w) == x && player.motion == motionType.RIGHT) ||
	             (player.position.x == (x + w) && player.motion == motionType.LEFT)) &&
	            player.position.y + PLAYER_SIZE.h == y) isOnDisappearPlatform = true;
		}

    

	    if(disappear_plateform_array[i]!=null && isOnDisappearPlatform == true){
		    disappear_plateform_opacity[i]  = disappear_plateform_opacity[i] - 0.05;
		    disappear_plateform_array[i].style.opacity = disappear_plateform_opacity[i];
		    
		    //disappear_plateform_array[i].parentNode.removeChild(disappear_plateform_array[i]);
		    setTimeout("remove_plate_form("+i+")",600);
		}
    }

    
    
    // Check whether player arrive at exit
        // if yes, the player won
    if(intersect(player.position,PLAYER_SIZE,EXIT_POS,EXIT_SIZE) && moneys.childNodes.length==0){
        game_won();
        clearInterval(gameInterval);
    }
    
    // Check whether a bullet hits a monster
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));

        for (var j = 0; j < monsters.childNodes.length; j++) {
            var monster = monsters.childNodes.item(j);
            var mx = parseInt(monster.getAttribute("x"));
            var my = parseInt(monster.getAttribute("y"));

	// For each bullet check if it overlaps with any monster
        // if yes, remove both the monster and the bullet
            if(intersect(new Point(x,y),BULLET_SIZE,new Point(mx,my),MONSTER_SIZE)){
                monsters.removeChild(monster);
                MONSTER_DISPLACEMENT_x_arr.pop();
                MONSTER_DISPLACEMENT_y_arr.pop();
                playsnd("monster_die");
                score = score + REWARD_PER_MONSTER*extra_reward;
                update_score();
                j--;
                bullets.removeChild(bullet);
                i--;
                //write some code to update the score
               
                
            }
        }
    }
}


//
// This function updates the position of the bullets
//
function moveBullets() {
    // Go through all bullets
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);
        
        var fixed_speed = bullet_speed[i];
        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));
        //node.setAttribute("x", x + BULLET_SPEED);
        node.setAttribute("x", x + fixed_speed);

        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w || x < 0) {
            bullets.removeChild(node);
            bullet_speed.splice(i, 1);
            i--;
            // xxxxxxx
        }
    }
}


//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
    // Check collisions, call the collisionDetection when you create the monsters and bullets
    collisionDetection();
    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();
    
    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT){
        displacement.x = -MOVE_DISPLACEMENT;
       
        
    }
    if (player.motion == motionType.RIGHT){
        displacement.x = MOVE_DISPLACEMENT;
    }

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;

    // Move the bullets, call the movebullets when you create the monsters and bullets
    moveBullets();
    
    updateScreen();
}


//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//


function updateScreen() {
    
    // flip the player and move player to new place
    var textObject = svgdoc.getElementById("player_name");
    if(flip == true){
        var current_player_x = player.position.x;
        var current_player_y = player.position.y;
    
        var playerObject = svgdoc.getElementById("player");
        
        
        if(playerObject!=null){
            playerObject.setAttribute("transform", "translate(" + (current_player_x + (38)) + ", "+current_player_y+") scale(-1, 1)");
            textObject.setAttribute("x", player.position.x+ PLAYER_SIZE.w/2);
        textObject.setAttribute("y", player.position.y);

        }
    }
    else{
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
        textObject.setAttribute("x", player.position.x + PLAYER_SIZE.w/2);
        textObject.setAttribute("y", player.position.y);
        
    }
    // flip the monster and move monster to new place 
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);
        var x = parseInt(monster.getAttribute("x"));
        var y = parseInt(monster.getAttribute("y"));
        var new_x = x+MONSTER_DISPLACEMENT_x_arr[i];
        
        var final_x = x;
        //console.log(MONSTER_DISPLACEMENT_x_arr.length);
        if(x+MONSTER_DISPLACEMENT_x_arr[i]>SCREEN_SIZE.w-MONSTER_SIZE.w || x+MONSTER_DISPLACEMENT_x_arr[i]<0){
	        
	        //if(MONSTER_flip_arr[i]==true){
				//monster.setAttribute("transform", "translate(" + (x+x + (MONSTER_SIZE.w)) + ", "+0+") scale(-1, 1)");
        	//} 
	        
	        
	        monster.setAttribute("x", x);
        }
        else{
	        
	        
	        
        	monster.setAttribute("x", x+MONSTER_DISPLACEMENT_x_arr[i]);
        	final_x = new_x;
        	//if(MONSTER_flip_arr[i]==true){
				//monster.setAttribute("transform", "translate(" + (new_x+new_x + (MONSTER_SIZE.w)) + ", "+0+") scale(-1, 1)");
				
        	//}  
        	
        	
        }
        if(y+MONSTER_DISPLACEMENT_y_arr[i]>SCREEN_SIZE.h-MONSTER_SIZE.h || y+MONSTER_DISPLACEMENT_y_arr[i]<0){
        	monster.setAttribute("y", y);
        }
        else{
	        monster.setAttribute("y", y+MONSTER_DISPLACEMENT_y_arr[i]);
        }
        
        
        if (MONSTER_flip_arr[i]) {
        	//var tx = (2*parseInt(monster.getAttribute("x"))+MONSTER_SIZE.w);
        	

        	
        	var tx = (2*final_x)+MONSTER_SIZE.w;
			monster.setAttribute("transform", "translate(" + tx + ", 0) scale(-1, 1)");


		} else {
			monster.setAttribute("transform", "");
		}
        
        

        //}
	}
        
   
            
    // Calculate the scaling and translation factors	
    var scale = new Point(zoom, zoom);
    var translate = new Point();
    
    translate.x = SCREEN_SIZE.w / 2.0 - (player.position.x + PLAYER_SIZE.w / 2) * scale.x;
    if (translate.x > 0) 
        translate.x = 0;
    else if (translate.x < SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x)
        translate.x = SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x;

    translate.y = SCREEN_SIZE.h / 2.0 - (player.position.y + PLAYER_SIZE.h / 2) * scale.y;
    if (translate.y > 0) 
        translate.y = 0;
    else if (translate.y < SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y)
        translate.y = SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y;
            
    // Transform the game area
    svgdoc.getElementById("gamearea").setAttribute("transform", "translate(" + translate.x + "," + translate.y + ") scale(" + scale.x + "," + scale.y + ")");	
}


//
// This function sets the zoom level to 2
//
function setZoom() {
	extra_reward = 2;
    zoom = 2.0;
    
}
