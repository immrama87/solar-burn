var SolarBurn = (function(canvasId, opts){
	var sb = {};
	
	opts = opts || {};
	opts.particleSpeed = opts.particleSpeed || 3;
	opts.pspeedmin = opts.minParticleSpeed || 0.4;
	opts.plife = opts.particleLife || 50;
	opts.plifemin = opts.minParticleLife || 5;
	opts.psize = opts.particleSize || 3;
	opts.psizemin = opts.minParticleSize || 1;
	opts.pspawn = opts.particlesSpawned || 100;
	opts.srad = opts.sphereRadius || 150;
	opts.parent = opts.parent || "body";
	
	var opspeed = opts.pspeed;
	var opspeedmin = opts.pspeedmin;
	var osrad = opts.srad;
	
	var canvas = document.getElementById(canvasId);
	
	var parent = $(canvas).parents().find(opts.parent);
	canvas.width = $(parent).width();
	canvas.height = $(parent).height();
	var context = canvas.getContext("2d");
	
	var gradient = context.createRadialGradient(0,0,0.1,0,0,opts.psize);
	gradient.addColorStop(0, "rgba(255,255,255,0.25)");
	gradient.addColorStop(1, "rgba(255,255,255,0)");
	
	sb.setOptions = function(options){
		opts.pspeed = options.particleSpeed || opts.pspeed;
		opts.pspeedmin = options.minParticleSpeed || opts.pspeedmin;
		opts.plife = options.particleLife || opts.plife;
		opts.plifemin = options.minParticleLife || opts.plifemin;
		opts.psize = options.particleSize || opts.psize;
		opts.psizemin = options.minParticleSize || opts.psizemin;
		opts.pspawn = options.particlesSpawned || opts.pspawn;
		if(opts.pspawn > 500){
			opts.pspawn = 500;
		}
		opts.srad = options.sphereRadius || srad;
	}

	var Particle = (function(x, y, rad){
		var p = {};
		
		var speed = Math.ceil(Math.random() * opts.pspeed) + opts.pspeedmin;
		var life = Math.ceil(Math.random() * opts.plife) + opts.plifemin;
		var lived = 0;
		
		var size = Math.ceil(Math.random() * opts.psize) + opts.psizemin;
		var dist = opts.srad;
		
		var angle = rad * 57.2958;
		angle += 90;
		while(angle > 180){
			angle -= 180;
		}
		
		var adiff = 90 / Math.abs(angle - 90);
		
		life *= (adiff/2);
		speed *= (adiff/4);
		size *= adiff*2;
		
		
		p.x = x;
		p.y = y;
		
		p.update = function(){
			lived++;
			dist += speed;
				
			p.x = canvas.width/2 + dist * Math.cos(rad);
			p.y = canvas.height/2 + dist * Math.sin(rad);
			p.size = size * (1.0 - lived/life);
		}
		
		return p;
	});
	
	var particles = [];
	
	function draw(timestamp){
		context.clearRect(0,0,canvas.width,canvas.height);
		context.fillStyle = "rgb(153,131,122)";
		context.fillRect(0,0,canvas.width,canvas.height);
		var todie = [];
		context.fillStyle = gradient;
		for(var i=0;i<particles.length;i++){
			particles[i].update();
			if(particles[i].size >= 0){
				context.save();
				context.translate(particles[i].x, particles[i].y);
				context.beginPath();
				context.arc(0,0, particles[i].size, 0, 2 * Math.PI, false);
				context.fill();
				context.restore();
			}
			else {
				todie.push(i);
			}
		}
		
		for(var d=0;d<todie.length;d++){
			particles.splice(todie[d], 1);
		}
		
		spawnParticles();
		
		window.requestAnimationFrame(draw);
	}
	
	function spawnParticles(){
		var spawnCount = Math.ceil(Math.random() * opts.pspawn);
		
		for(var i=0;i<spawnCount;i++){
			var deg = Math.floor(Math.random() * 360);
			var rad = deg * Math.PI/180;
			var x = canvas.width/2 + opts.srad * Math.cos(rad);
			var y = canvas.height/2 + opts.srad * Math.sin(rad);
			
			particles.push(new Particle(x, y, rad));
		}
	}
	
	window.requestAnimationFrame(draw);
	
	return sb;
});