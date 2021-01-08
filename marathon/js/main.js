var score = 0,
	countTime = 0.0,
	_Config = {
		speed: {
			min: 12,
			max: 48
		},
		view: {
			width: 750,
			height: 1334
		},
	},
	_Con_sprite = {
		buddy_menu: {
			height: 310,
			width: 240,
			frameNumber: 4,
			type: "spritesheet"
		},
		buddy: {
			height: 310,
			width: 240,
			frameNumber: 4,
			type: "spritesheet"
		},
		button: {
			height: 200,
			width: 190,
			frameNumber: 4,
			type: "spritesheet"
		},
		ground: {
			height: 554,
			width: 750,
			frameNumber: 1,
			type: "tilesprite"
		},
		background: {
			height: 1334,
			width: 4738,
			frameNumber: 1,
			type: "tilesprite"
		},
		earth: {
			height: 703,
			width: 671,
		},
		box: {
			height: 22,
			width: 24
		}
	},
	gameSpeed = _Config.speed.min,
	distanceTime = 50;


(function() {

	console.log("init self call,to start delegate.");

	HTMLDocument.prototype.delegate = delegate;
	HTMLElement.prototype.delegate = delegate;

	function delegate(events, selector, fn) {
		console.log("call delegate().");
		function getTarget(parent, target) {
			console.log("getTarget()");
			var children = parent.querySelectorAll(selector);
			console.log("getTarget(),children.length:",children.length);
			for (var i = 0, l = children.length; i < l; i++) {
				if (children[i] === target) {
					return children[i];
				} else if(children[i].contains(target)){
					return children[i];
				}
			}
			return false;
		}
		var parent = this;
		
		events.split(" ").forEach(function(evt) {
			parent.addEventListener(evt, function(e) {
				var target = getTarget(parent, e.target);
				if (!target) {
					return false;
				}
				fn.apply(target, arguments);
			}, false);
		})
	}
})();


//当前调试发现。该函数 调用与不调用并没有任何影响。
var hideElems = (function(){
	console.log("init self call,for hideElems");
	return function(){
		console.log("---->hideElems--return");
		var elems = document.querySelectorAll("[data-hide]");
		
		arr = Array.prototype.slice.call(elems);
		console.log("---->hideElems--return,arr.length:" + arr.length);//打印长度为0
		arr.forEach(function(element) {
			console.log("---->hideElems--forEach--element:" + element);
			element.style.display = "none";
		}, this);
		
	}
})(),
changeHeight = 200;

function prefixInteger(str, length) {
	console.log("---->prefixInteger");
	return Array(length + 1).join("0").split("").concat(String(str).split(""))
		.slice(-length).join("");
}
console.log("new Phaser.Game");
var game = new Phaser.Game(_Config.view.width, _Config.view.height, Phaser.CANVAS);
/* 
StatesNew = Phaser.StateManager；StatesNew是自己定义的新增的属性，原有的States对应全部更换为StatesNew也是ok的。
StatesNew 新增的boot添加的方法前面都不加this,会提示一下错误。
Invalid Phaser State object given. Must contain at least a one of the required functions: preload, create, update or render
*/
game.StatesNew = {};

game.StatesNew.boot = function() {
	console.log("game.StatesNew.boot = function(),this = " + this);
	this.preload = function() {
		console.log("game.StatesNew.boot = function(),this.preload = function(),this = " + this + " typeof(this) = " + typeof(this));
		console.log("game.StatesNew.boot = function(),this.preload = function(),typeof(GAME) = " + typeof(GAME));
		if (typeof(GAME) !== "undefined") {
			this.load.baseURL = GAME + "/";
		}
		
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// console.log("game.StatesNew.boot = function(),this.scale.pageAlignHorizontally.get = " + this.scale.pageAlignHorizontally.get());
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.scale.refresh();
	}; 
	this.create = function() {
		console.log("game.StatesNew.boot = function(),this.create = function(),this = " + this);
		game.state.start('preload');
	};
	//20201223新增 update方法，加载时也会调用。
	this.update = function(){
		console.log("game.StatesNew.boot = function(),this.update = function(),this = " + this);
	}
};

game.StatesNew.preload = function() {
	console.log("---->game.StatesNew.preload = function(),this = " + this);

	this.preload = function() {


		console.log("game.StatesNew.preload ---->this.preload = function()");

		game.load.image("bk", "assets/bk.jpg");
		game.load.image("background", "assets/background.jpg");
		game.load.image('ground', 'assets//ground.jpg');
		game.load.image('loading', 'assets/preloader.gif');
		game.load.image("earth", 'assets/earth.png');
		game.load.image("box", 'assets/box.png');
		game.load.image('flag', 'assets/flag.png');
		game.load.image('btn-ready', 'assets/btn-ready.png');
		game.load.image("time",'assets/time.png');
		game.load.image("game_end",'assets/gameend.jpg');
		//load sprite
		game.load.spritesheet('buddy_menu', 'assets/badi.png', _Con_sprite.buddy.width, _Con_sprite.buddy.height, _Con_sprite.buddy.frameNumber);
		game.load.spritesheet('buddy', 'assets/buddy.png', _Con_sprite.buddy.width, _Con_sprite.buddy.height, _Con_sprite.buddy.frameNumber);
		game.load.spritesheet('button', 'assets/button.png', _Con_sprite.button.width, _Con_sprite.button.height, _Con_sprite.button.frameNumber);
		//voice
		game.load.audio('player_sound', 'assets/play.mp3');
		game.load.audio('score_sound', 'assets/score.mp3');
		// font
		game.load.bitmapFont('flappy_font', 'assets/flappyfont.png', 'assets/flappyfont.xml');
		game.load.bitmapFont('time_count', 'assets/flappyfont.png', 'assets/flappyfont.xml');
	};
	this.create = function() {
		console.log("game.StatesNew.preload ---->this.create = function()");
		game.state.start('menu');
	};
};

game.StatesNew.menu = function() {

	console.log("---->game.StatesNew.menu = function(),this = " + this);

	this.create = function() {

		console.log("---->game.StatesNew.menu -- create");
		//tileSprite = {Phaser.TileSprite}
		game.add.tileSprite(0, 0, game.width, game.height, 'bk');
		var titleGroup = game.add.group();//titleGroup 为一个组，以该组为基准，创建的角色内容都在这个组内。显示位置也在这个组内
		// titleGroup.create(100, 0, /* 'earth' */'box');//也会显示出来。
		titleGroup.create(0, 0, 'earth'/* 'box' */);//临时测试代码。当再次调用titleGroup.create创建‘earth’时，获取titleGroup.width为？
		//titleGroup.width为上面最后一个titleGroup.create对应图片的宽度，以及高度		
		console.log("---->game.StatesNew.menu -- create,titleGroup.x=" + titleGroup.x + ",titleGroup.y=" + titleGroup.y);
		console.log("---->game.StatesNew.menu -- create,titleGroup.width="+ titleGroup.width + ",titleGroup.height="+titleGroup.height);
		console.log("---->game.StatesNew.menu -- create,game.width=" + game.width + ",game.height=" + game.height);
		console.log("---->game.StatesNew.menu -- create,_Con_sprite.earth.width=" + _Con_sprite.earth.width + ",_Con_sprite.earth.height=" + _Con_sprite.earth.height);
		var badi = titleGroup.create((titleGroup.width - _Con_sprite.buddy.width) / 2, (titleGroup.height - _Con_sprite.buddy.height /* - 200 */) / 2, 'buddy');
		// badi.animations.add('move');//动画名称任意指定，和播放一致就可以。只有使用一个参数
		badi.animations.add('move',[0,1,2,3]);//动画名称任意指定，和播放一致就可以。多个参数，frames数组。
		badi.animations.play('move', gameSpeed, true);
		titleGroup.x = (game.width - _Con_sprite.earth.width) / 2;
		titleGroup.y = (game.height - _Con_sprite.earth.width) / 2;
		console.log("---->game.StatesNew.menu -- create,titleGroup.x=" + titleGroup.x + ",titleGroup.y=" + titleGroup.y);
		
		//返回全局变量button
		button = game.add.button((game.width - 381) / 2, 1334 - 330, 'btn-ready', function() {
			console.log("game.StatesNew.menu -- create,btn-ready click.");
			game.state.start('play');
		});
		game.state.start('play');
	};
};
//game.state.add('play', game.StatesNew.play)调用时，game.StatesNew.play会被调用。
game.StatesNew.play = function() {

	console.log("---->game.StatesNew.play = function()");
	console.log("---->game.StatesNew.play = function(),this = " + this);

	var that = this,
		plusEvent = 0,
		isGameOver = false,
		distance = 4000,
		going = 0,
		changeHeight = 200;
	this.create = function() {
		console.log("---->game.StatesNew.play---create");
		// hideElems();
		// 物理系统
		game.physics.startSystem(Phaser.Physics.ARCADE);
		// 背景
		// tileSprite-> Phaser. TileSprite
		this.bg = game.add.tileSprite(0, 0, _Con_sprite.background.width, _Con_sprite.background.height, 'background');
		this.ground = game.add.tileSprite(0, game.height - _Con_sprite.ground.height , game.width, _Con_sprite.ground.height , 'ground');
		console.log("---->game.StatesNew.play---create,game.world.centerX:" + game.world.centerX + " ,game.world.centerY:" + game.world.centerY);
		this.scoreBox = game.add.sprite(game.world.centerX - 130,15,"box");
		this.scoreText = game.add.bitmapText(game.world.centerX - 20, 30, 'flappy_font', '0', 36);
		this.timeImg = game.add.sprite(20,15,"time");
		this.timeText = game.add.bitmapText(120, 30, "time_count", 0, 36);

		var btnLeft = game.add.button(game.world.centerX - 162 - 50, 1138 -150 , "button", this.runLeft, this, 2, 2, 0);
		var btnRight = game.add.button(game.world.centerX + 50, 1138 -150 , "button", this.runRight, this, 3, 3, 1);

		this.flag = game.add.sprite(600, game.height - _Con_sprite.buddy.height / 2 - _Con_sprite.ground.height , "flag");
		this.flag.visible = false; 

		//voice
		this.soundPlay = game.add.sound('player_sound');
		this.soundScore = game.add.sound('score_sound');
		this.soundPlay.loop = true;
		this.soundPlay.play();
		//player
    	this._buddyPos = game.height - _Con_sprite.buddy.height -(_Con_sprite.ground.height * 2 / 3) - 60;
		this._buddy = game.add.sprite(0, this._buddyPos, "buddy");
		//this._buddy.anchor.setTo(0.5, 0.5);
		this._buddy.animations.add('move');
		this._buddy.animations.play('move', gameSpeed, true);

		//  障碍物
		this.boxGroup = game.add.group();
		this.boxGroup.enableBody = true;
		this.hinderGroup = game.add.group();
		this.hinderGroup.enableBody = true;

		game.physics.arcade.enable(this._buddy);
		game.physics.arcade.enable(this.ground);
		game.physics.arcade.enable(this.boxGroup);

		this._buddy.body.collideWorldBounds = true;

		// 动画
		//tween(.) ->Phaser. Tween
		var tween = game.add.tween(this._buddy).to({
			x: (game.width - _Con_sprite.buddy.width) / 3
		}, 1000, Phaser.Easing.Sinusoidal.InOut, true);

		//onChildComplete :Phaser.Signal
		tween.onComplete.add(this.onStart, this);
		//监听循环
		//game.input.touch.touchEndCallback = _.throttle(this.plusSpeed,1000);		
		game.time.events.loop(Phaser.Timer.SECOND * 2.5, this.subSpeed, this);
		
	};
  this.runLeft = function() {
	console.log("---->this.runLeft");
    this._buddyPos = game.height - _Con_sprite.buddy.height -(_Con_sprite.ground.height * 2 / 3) - 60;
    this._buddy.y = this._buddyPos;
  };
  this.runRight = function() {
	console.log("---->this.runRight");
    this._buddyPos = game.height - _Con_sprite.buddy.height -(_Con_sprite.ground.height * 2 / 3) + 60;
    this._buddy.y = this._buddyPos;
  };
	this.checkSpeed = function() {

		console.log("---->game.StatesNew.play---checkSpeed,gameSpeed:" + gameSpeed);
		if (gameSpeed < _Config.speed.min) {
			gameSpeed = _Config.speed.min;
		} else if (gameSpeed > _Config.speed.max) {
			gameSpeed = _Config.speed.max;
		} else {

		}
	};
	this.speedFlag = (function() {
		var speedFlag = false;
		return {
			set: function(flag) {
				speedFlag = flag;
			},
			get: function() {
				return speedFlag;
			}
		}
	})();
	this.plusSpeed = function() {
		console.log("---->this.plusSpeed call.");
		if(!isGameOver){
			if (gameSpeed >= _Config.speed.max) {
				return;
			}
			that.speedFlag.set(true);
			++gameSpeed;
			console.log("trigger PLUS Speed: " + gameSpeed);
			that._buddy.animations.stop('move');
			that._buddy.animations.play('move', gameSpeed, true);
			that.bg.stopScroll();
			that.ground.stopScroll();
			that.bg.autoScroll(-gameSpeed * 15, 0);
			that.ground.autoScroll(-gameSpeed * 30, 0);
			that.speedFlag.set(false);
		}
	
	};
	this.subSpeed = function() {
		console.log("---->this.subSpeed call.");
		if(!isGameOver){
			if (gameSpeed <= _Config.speed.min || this.speedFlag.get()) {
				return;
			}
			console.log("trigger sub Speed: " + gameSpeed);
			gameSpeed -= 0.5;
			this._buddy.animations.stop('move');
			this._buddy.animations.play('move', gameSpeed, true);
			this.bg.stopScroll();
			this.ground.stopScroll();
			this.bg.autoScroll(-gameSpeed * 20, 0);
			this.ground.autoScroll(-gameSpeed * 40, 0);
		}

	};
	this.onStart = function() {
		this.score = 0;
		this._buddy.body.velocity.x = 10;
		//Phaser. TileSprite -> autoScroll(x,y)
		this.bg.autoScroll(-gameSpeed * 15, 0);
		this.ground.autoScroll(-gameSpeed * 30, 0);
		this.startTime = Date.now();
		console.log("---->game.StatesNew.play---onStart,this.startTime:" + this.startTime);
	};
	this.generateBoxs = function() {
		console.log("---->game.StatesNew.play---generateBoxs.");
		console.log("---->game.StatesNew.play---generateBoxs,Math.random() * 1000:" + Math.random() * 1000);
		if (Math.random() * 1000 < 3*5) {
			//sprite函数，参数frame,如果没有多帧，填写0表示第一帧。group如果不指定，生成的每一个对象需要单独指定物理特性。	
			game.add.sprite(game.width, (game.height - (_Con_sprite.ground.height * 3 / 10) - _Con_sprite.buddy.height) , 'box', 0, this.boxGroup);
			//setAll统一设置组中所有直接成员的属性值。
			this.boxGroup.setAll('body.velocity.x', -gameSpeed * 9*2);
			this.boxGroup.setAll('checkWorldBounds', true);
			this.boxGroup.setAll('outOfBoundsKill', true);
		}
	};
	this.collectBox = function(player, box) {
		box.kill();
		this.scoreText.text = ++this.score;
		score = this.scoreText.text;
		game.add.tween(this._buddy).to({
			x: (game.width - _Con_sprite.buddy.width) / 3
		}, 1000, Phaser.Easing.Sinusoidal.InOut, true);
		this.soundScore.play();
	};
	this.updateTime = function() {
		console.log("---->game.StatesNew.play---updateTime,isGameOver:" + isGameOver);
		if (!isGameOver) {
			
			console.log("---->game.StatesNew.play---updateTime,Date.now():" + Date.now() + ",this.startTime:" + this.startTime);
			//比如：updateTime,Date.now():1609991434014,this.startTime:1609991433612
			console.log("---->game.StatesNew.play---updateTime,[Date.now() - this.startTime]:" + (Date.now() - this.startTime));

			var str = prefixInteger(Date.now() - this.startTime, 6),
				text = str.substr(0, 3);
			/*
			1.当this.startTime:undefined时，
				[Date.now() - this.startTime]:NaN，
				str=000NaN,
				则str.substr(0, 3)=000
			2.当updateTime,Date.now():1610011416223,this.startTime:1610011412979,
				[Date.now() - this.startTime]:3245,
				str:003245,
				[text = str.substr(0, 3)]:003
			
			*/
			console.log("---->game.StatesNew.play---updateTime,str:" + str);
			console.log("---->game.StatesNew.play---updateTime,[text = str.substr(0, 3)]:" + str.substr(0, 3));
			this.timeText.text = text;
			countTime = text;
			if (going > distance) {
				this.generateflag();
			}
		}
	};
	this.generateflag = function() {	
		this.flag.visible = true;
		game.physics.arcade.enable(this.flag);
		this.flag.body.velocity.x = -gameSpeed * 5;
		this.flag.body.checkWorldBounds = true;
		this.flag.body.outOfBoundsKill = true;
	};
	this.hitFlag = function() {
		that._buddy.body.velocity.x += 20;
		that.gameover();
	};
	this.goDistance = function() {
		console.log("---->game.StatesNew.play---goDistance,isGameOver:" + isGameOver);
		if(!isGameOver){
			going += game.time.elapsed * 10 * 0.001 * gameSpeed;
		}
	};
	this.gameover = function() {
		isGameOver = true;
		that._buddy.body.velocity.x = game.width - _Con_sprite.buddy.width * 3 / 4;
		that._buddy.animations.stop('move');
		that._buddy.animations.stop();
		that.bg.autoScroll(0, 0);
		that.ground.autoScroll(0, 0);
		that.flag.body.velocity = 0;
		that._buddy.body.velocity = 0;
		that.boxGroup.setAll('body.velocity.x', 0);
		that.boxGroup.setAll('body.velocity.y', 0);
		game.state.start('over');

	};
	//update会一直循环调用。
	this.update = function() {
		console.log("---->game.StatesNew.play---update call.");
		console.log("---->game.StatesNew.play---update,isGameOver:" + isGameOver);
		if(!isGameOver){
			this.goDistance();
			this.updateTime();
			this.checkSpeed();
			this.generateBoxs();
		}
		game.physics.arcade.collide(this._buddy, this.boxGroup, /* null */this.collectBox, null, this);
		game.physics.arcade.collide(this._buddy, this.hinderGroup, this.collectBox, null, this);
		game.physics.arcade.overlap(this._buddy, this.flag, this.hitFlag, null, null, this);
	};

};

game.StatesNew.over = function() {
	console.log("---->game.StatesNew.over = function(),this = " + this);
	this.create = function() {

		console.log("---->game.StatesNew.over,this.create = function() ");


		this.bg = game.add.tileSprite(0, 0, _Con_sprite.background.width, _Con_sprite.background.height, 'background');
		this.ground = game.add.tileSprite(0, game.height - _Con_sprite.ground.height  , game.width, _Con_sprite.ground.height , 'ground');
		this.scoreBox = game.add.sprite(game.world.centerX - 130,15,"box");
		this.scoreText = game.add.bitmapText(game.world.centerX - 20, 30, 'flappy_font', '0', 36);
		this.timeImg = game.add.sprite(20,15,"time");
		this.timeText = game.add.bitmapText(120, 30, "time_count", 0, 36);

		this.scoreText.text = score;
		this.timeText.text = countTime;

		var url = 'https://github.com/channingbreeze/games',
	
        random = Date.now();
		game.add.button((game.width - 580) / 2, 200, 'game_end', function() {
			console.log("---->game.add.button");

			location.href = url;
		});
	};
}

/*game = Phaser.Game.prototyp;state = new Phaser.StateManager(this, state);
Phaser.StateManager 中 有this.states = {};指向The object containing Phaser.States.
game.StatesNew 包含的boot,preload,menu,play,over也是自定义的。
*/
game.state.add('boot', game.StatesNew.boot);
game.state.add('preload', game.StatesNew.preload);
game.state.add('menu', game.StatesNew.menu);
game.state.add('play', game.StatesNew.play);//会调用 game.StatesNew.play = function()
game.state.add('over', game.StatesNew.over);

game.state.start('boot');//启动。或者直接在添加时启动game.state.add('boot', game.StatesNew.boot,true);