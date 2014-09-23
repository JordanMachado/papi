


// reference http://www.michaelbromley.co.uk/experiments/soundcloud-vis/#d-jahsta/d-jahsta-system-forthcoming
var canvasElement, context, audioSource,mousePos = {x:100,y:100};

var checkCompatibility = function()
{
    if(Detectizr.browser.name != "chrome")
    {
          browserMessage = document.getElementById("browserMessage");
          browserMessage.innerHTML = "Vous utilisez actuellement "+Detectizr.browser.name+" malheuresement l'application est disponible seulement sur google Chrome.";
          browserMessage.style.display = "block";   
    }
    console.log("checkCompatibility ...");
};

var init = function()
{
    console.log("init");

    checkCompatibility();
	audioSource = new AudioReader('player');
	canvasElement = document.getElementById('canvas');
	resizeCanvas();
	context = canvasElement.getContext("2d");
	audioSource.playStream('song/song.mp3');
    window.addEventListener("resize",resizeCanvas,false);

	animate();
};

var resizeCanvas = function()
{
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;
}
var AudioReader = function(audioElement) {
    var player = document.getElementById(audioElement);
    var self = this;
    var analyser;
    var audioCtx = new (window.AudioContext || window.webkitAudioContext);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256; // see - there is that 'fft' thing. 
    var source = audioCtx.createMediaElementSource(player); 
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    var sampleAudioStream = function() {
        analyser.getByteFrequencyData(self.streamData);
        var total = 0;
        for (var i = 0; i < 80; i++) { 
            total += self.streamData[i];
        }
        self.volume = total;
    };
    setInterval(sampleAudioStream, 20);
    this.volume = 0;
    this.streamData = new Uint8Array(128); 
    this.playStream = function(streamUrl) {
        player.setAttribute('src', streamUrl);
        player.play();
    }
};
/*
var Particule = function(x,y,dx,dy,speed)
{
    this.ox = window.innerWidth/2;
    this.oy = window.innerHeight/2;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = speed;


	this.update = function(val)
	{
        this.x = x;
       
        
	};
    this.draw = function(context)
    {
        context.beginPath();
        context.moveTo(this.ox+this.x,this.oy);
        context.lineTo(this.x,this.y);
        context.stroke();
    };
};
*/
var drawBgCanvas = function()
{
    grd=context.createRadialGradient(window.innerWidth/2,window.innerHeight/2,window.innerWidth/2,window.innerWidth/2,window.innerWidth/2,300);
    grd.addColorStop(0,"#000000");
    grd.addColorStop(1,"#24022f");
    context.fillStyle=grd;
    context.fillRect(0,0,window.innerWidth,window.innerHeight);
};

var drawBass = function(red,green,blue,val)
{
    context.beginPath();
    context.strokeStyle = 'rgb(' + red + ', ' + green + ', ' + blue + ')';
    context.arc(window.innerWidth/2,window.innerHeight/2,val,0,2*Math.PI);
    context.stroke();
}

var animate = function() 
{
    canvas.width = canvas.width;
   
    drawBgCanvas();
    for(bin = 0; bin < audioSource.streamData.length; bin ++) 
    {
        var val = audioSource.streamData[bin];
        var red = val;
        var green = 255 - val;
        var blue = val; 
        drawBass(red,green,blue,val)
    }

    requestAnimationFrame(animate);
};