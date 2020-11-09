// Hallu hiers Anni
let context = new AudioContext();
let audio = new Audio("sound.wav");
let source = context.createMediaElementSource(audio);

//Nodes erstellen
let compressor = context.createDynamicsCompressor();
let filter = context.createBiquadFilter();
let gain = context.createGain();
let stereoPanner = context.createStereoPanner();
let delay = context.createDelay();
let convolver = context.createConvolver();
let distortion = context.createWaveShaper();

//Hilfsvariablen
isPlaying = false;
audio.loop = true;
ReverbOn = false;

let sliders = document.getElementsByClassName("slider")
let playButton = document.querySelector("#Playtaste");
let turnon = document.querySelector("#turnonbutton");

//Nodes verbinden
source.connect(gain);
gain.connect(stereoPanner);
stereoPanner.connect(delay);
delay.connect(distortion);
distortion.connect(compressor);
compressor.connect(filter);
filter.connect(convolver);
convolver.connect(context.destination);

//Default Filter ist allpass
filter.type = "allpass";

distortion.curve = makeDistortionCurve(0);
distortion.oversample = "4x";

//Dirac = Kein Reverb
fetch("dirac.wav")
.then(response => response.arrayBuffer())
.then(undecodedAudio => context.decodeAudioData(undecodedAudio))
.then(audioBuffer => {
convolver.buffer = audioBuffer;
convolver.normalize = true;
audio.play;
})
.catch(console.error);

//Auswahl von Filter
document.querySelector("#filterauswahlcontainer").addEventListener("click", function() {
    var FAuswahl = document.getElementById("FilterAuswahl").value;
    filter.type = FAuswahl;
});

//Abfrage, ob Sliderwerte geändert werden
for (var i = 0; i < sliders.length; i++) {
    sliders[i].addEventListener("input", changeParameter, false);
}

//Änderung der Parameter
function changeParameter() {
    switch (this.id) {
        case "GainSlider":
            gain.gain.value = (this.value/100);
            document.querySelector("#GainOutput").innerHTML = (this.value)/100 + "dB";
            break;
        case "PanSlider":
            stereoPanner.pan.value = (this.value/10);
            document.querySelector("#PanOutput").innerHTML = (this.value)/10;
            break;
        case "DelaySlider":
            delay.delayTime.value = (this.value/100);
            document.querySelector("#DelayOutput").innerHTML = (this.value)/100;
            break;
        case "ThresholdSlider":
            compressor.threshold.value = (this.value);
            document.querySelector("#ThresholdOutput").innerHTML = (this.value) + "dB";
            break;   
        case "RatioSlider":
            compressor.ratio.value = (this.value);
            document.querySelector("#RatioOutput").innerHTML = (this.value);
            break;  
        case "KneeSlider":
            compressor.knee.value = (this.value);
            document.querySelector("#KneeOutput").innerHTML = (this.value);
            break;   
        case "AttackSlider":
            compressor.attack.value = (this.value /1000);
            document.querySelector("#AttackOutput").innerHTML = (this.value) + "ms";
            break;    
        case "ReleaseSlider":
            compressor.release.value = (this.value / 1000);
            document.querySelector("#ReleaseOutput").innerHTML = (this.value) + "ms";
            break; 
        case "FreqSlider":
            filter.frequency.value = (this.value);
            document.querySelector("#FreqOutput").innerHTML = (this.value) + "Hz";
            break;  
        case "DetuneSlider":
            filter.detune.value = (this.value);
            document.querySelector("#DetuneOutput").innerHTML = (this.value) + "Hz";
            break;     
        case "QualSlider":
            filter.Q.value = (this.value);
            document.querySelector("#QualOutput").innerHTML = (this.value);
            break;     
        case "FGainSlider":
            filter.gain.value = (this.value);
            document.querySelector("#FGainOutput").innerHTML = (this.value) + "dB";
            break;
        case "DisSlider":
            distortion.curve = makeDistortionCurve(this.value);
            distortion.oversample = "4x";
            document.querySelector("#DisOutput").innerHTML = (this.value);          
    }
}

//Abfrage ob Playbutton gedrückt wird
playButton.addEventListener("click", function () {
    if(isPlaying) {
        audio.pause();
        document.getElementById("Playtaste").innerHTML = "Play";
    }
    else {
        audio.play();
        document.getElementById("Playtaste").innerHTML = "Stop";   
    }
    isPlaying =! isPlaying;

}); 

//Playbutton umbenennen, wenn Sound zuende
audio.addEventListener("ended", function () {
    isPlaying = false;
    document.getElementById("Playtaste").innerHTML = "Play";
});

//Reverb ausschalten mit Dirac
turnon.addEventListener("click", function () {
    if(ReverbOn) {
        document.getElementById("turnonbutton").innerHTML = "Turn On";
        fetch("dirac.wav")
        .then(response => response.arrayBuffer())
        .then(undecodedAudio => context.decodeAudioData(undecodedAudio))
        .then(audioBuffer => {
        convolver.buffer = audioBuffer;
        convolver.normalize = true;
        audio.play;
    })
    .catch(console.error);
    }
    else {
        document.getElementById("turnonbutton").innerHTML = "Turn Off";
        ReverbSelector();

    }
    ReverbOn =! ReverbOn;

}); 
//Reverb anschalten
document.querySelector("#auswahlcontainer").addEventListener("click", function() {
    if (ReverbOn) {
        ReverbSelector();
    }
else {}
});

//Reverb auswählen
function ReverbSelector() {
    var reverb = document.getElementById("ReverbAuswahl").value; 
    fetch(reverb +".wav")
    .then(response => response.arrayBuffer())
    .then(undecodedAudio => context.decodeAudioData(undecodedAudio))
    .then(audioBuffer => {
        convolver.buffer = audioBuffer;
        convolver.normalize = true;
        audio.play;
})
.catch(console.error);
}

//Distortion Funktion
function makeDistortionCurve(amount) {    
    let n_samples = 44100,
        curve = new Float32Array(n_samples);
    
    for (var i = 0; i < n_samples; ++i ) {
        var x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + (amount * Math.abs(x)));
    }
    
    return curve;
};