
Farough = (function() {

	var SOURCE = 'http://mtl2.liveatc.net/cytz';

	var context, audio, source, analyser, canvas, ctx, vidz;

	var voice = true;

	var videoCount = 4;
	var currentVideo = Math.floor(Math.random()*videoCount);

	var VOICE_TRESHOLD = 120, VOLUME = 0.5;

	var init = function() {

		vidz = document.querySelectorAll('.vid');
		
		document.querySelector('#treshold').addEventListener('keyup', function(e) {
		    console.log(e);
		    console.log(this);
		    
		    VOICE_TRESHOLD = this.value;
		    console.log(VOICE_TRESHOLD);
		});

		[].forEach.call(vidz,function(element, i) {
			element.addEventListener('loadeddata', function(el) {
				this.volume = 0;
				this.play();
				if(i==currentVideo) {

					vidz[currentVideo].volume = VOLUME;
					vidz[currentVideo].style.zIndex = 2;
				}
			}, false);
		});




	    canvas = document.getElementById('canvasID');
	    canvasContext = canvas.getContext('2d');
	   // canvasWidth = parseFloat(window.getComputedStyle(canvas, null).width);
	   // canvasHeight = parseFloat(window.getComputedStyle(canvas, null).height);

	    audio = new Audio();
	    audio.src = 'http://d.liveatc.net/cytz';
	    audio.play();

	    canvas = document.getElementById('canvasID');
		ctx = canvas.getContext('2d');


	    context = new webkitAudioContext();
	    analyser = context.createAnalyser(); 
	    


	     source = context.createMediaElementSource(audio);
		 source.connect(analyser);
	 	 analyser.connect(context.destination);
	 	 //analyser.fftSize = 32;


	 	visualize();



	}


	visualize = function() {

		window.webkitRequestAnimationFrame(visualize);
		fbc_array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(fbc_array);
		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
		ctx.fillStyle = '#00CCFF'; // Color of the bars
		bars = 100;

		var sum = 0;

		for (var i = 0; i < bars; i++) {
			bar_x = i * 3;
			bar_width = 2;
			bar_height = -(fbc_array[i] / 2);
			//fillRect( x, y, width, height ) // Explanation of the parameters below
			ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);

			sum+= fbc_array[i];
		}
		var avg = sum/bars;
		if(sum/bars> VOICE_TRESHOLD) {
			if(voice==false) {
				voice = true;
				changeVideo();
			}

		}
		else {
			if(voice==true) {
				voice = false;
			}


		}

	}

	changeVideo = function() {
		currentVideo = (currentVideo + 1) % videoCount;
		[].forEach.call(vidz,function(element) {
			element.volume = 0;
			element.style.zIndex = 1;
		});

		vidz[currentVideo].volume = VOLUME;
		vidz[currentVideo].style.zIndex = 2;


	}




	return {
		init: init,
		changeVideo: changeVideo
	}
})();

Farough.init();

