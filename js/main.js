


// reference http://www.michaelbromley.co.uk/experiments/soundcloud-vis/#d-jahsta/d-jahsta-system-forthcoming
var canvasElement, context, audioSource;

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
	audioSource.playStream('song/MAKJ-Crunch.mp3');
    mousePos = {x:window.innerWidth/2,y:window.innerHeight/2}

    /* listeners */
    window.addEventListener("resize",resizeCanvas,false);
    window.addEventListener("mousemove",updateMousePos,false); 


	animate();
};

var updateMousePos = function(e)
{
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
}

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
    context.arc(window.innerWidth/2,window.innerHeight/2,val*2,0,2*Math.PI);
    context.stroke();
}

var drawLineCircle = function(red,green,blue,val)
{
    context.beginPath()

    for(var i=0;i<360;i++)
    {
        if(i%10==0)
        {
            var radians = i * (Math.PI / 180);
            context.moveTo(window.innerWidth/2,window.innerHeight/2)
            x = val*2*Math.cos(radians);
            y =val*2*Math.sin(radians);
            context.lineTo(x+window.innerWidth/2,y+window.innerHeight/2);
        }

    }

    context.strokeStyle = 'rgb(' + red+50 + ', ' + green + ', ' + blue + ')';
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
        drawLineCircle(red,green,blue,val);
    }
    context.rotate(0.4);
   

    requestAnimationFrame(animate);
};