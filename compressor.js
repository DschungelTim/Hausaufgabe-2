let context = new AudioContext();
let audio = new Audio("test.mp3");
let source = context.createMediaElementSource(audio);
let compressor = context.createDynamicsCompressor();
let playButton = document.querySelector("#Playtaste");
isPlaying = false;
ReverOn = false;
// Testetstest

source.connect(compressor);
compressor.connect(context.destination);



compressor.threshold.value = -70;
compressor.ratio.value = 12;
compressor.knee.value = 15;
compressor.attack.value = 0.16;
compressor.release.value = 0.55;


document.querySelector("#ThresholdSlider").addEventListener("input", function (e) {
    let ThresholdValue = (this.value);
    compressor.threshold.value = ThresholdValue;
    document.getElementById("ThresholdOutput").innerHTML = ThresholdValue + "dB";
    
});

document.querySelector("#RatioSlider").addEventListener("input", function (e) {
    let RatioValue = (this.value);
    compressor.ratio.value = RatioValue;
    document.getElementById("RatioOutput").innerHTML = RatioValue;
    
});

document.querySelector("#KneeSlider").addEventListener("input", function (e) {
    let KneeValue = (this.value);
    compressor.knee.value = KneeValue;
    document.getElementById("KneeOutput").innerHTML = KneeValue;
    
});

document.querySelector("#AttackSlider").addEventListener("input", function (e) {
    let AttackValue = (this.value);
    compressor.attack.value = AttackValue;
    document.getElementById("AttackOutput").innerHTML = AttackValue + "ms";
    
});

document.querySelector("#ReleaseSlider").addEventListener("input", function (e) {
    let ReleaseValue = (this.value);
    compressor.release.value = ReleaseValue;
    document.getElementById("ReleaseOutput").innerHTML = ReleaseValue + "ms";
    
});

playButton.addEventListener("click", function () {
    if(isPlaying) {
        audio.pause();
        document.getElementById("Playtaste").innerHTML = "Play";
    }
    else {
        audio.play();
        document.getElementById("Playtaste").innerHTML = "Pause";   
    }
    isPlaying =! isPlaying;

}); 

audio.addEventListener("ended", function () {
    isPlaying = false;
    document.getElementById("Playtaste").innerHTML = "Play";


});