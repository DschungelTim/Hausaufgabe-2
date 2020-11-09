//Tim´s Kommentar ist super!
let context = new AudioContext();
let sound = new Audio("test.p3");
let audio = context.createMediaElementSource(sound);
let convolver = context.createConvolver();
let isPlaying = false;

audio.connect(convolver);
convolver.connect(context.destination);

document.querySelector("#playbutton").addEventListener("click", function (e) {
     auslesen();
     if (isPlaying) {
          sound.pause();
          document.querySelector("#playbutton").innerHTML = "Play";
     }

     else {
          var auswahl = document.getElementById("Auswahl").value; 
          fetch("impulseResponses/" + auswahl +".wav")
          .then(response => response.arrayBuffer())
          .then(undecodedAudio => context.decodeAudioData(undecodedAudio))
          .then(audioBuffer => {
          convolver.buffer = audioBuffer;
          convolver.normalize = true;
     })
     .catch(console.error);
          sound.play();
     
     document.querySelector("#playbutton").innerHTML = "Stop";
     }
     isPlaying =! isPlaying;
 
});



sound.addEventListener("ended", function () {
     isPlaying = false;
     document.getElementById("playbutton").innerHTML = "Play";
 
 });


function auslesen() {
     var auswahl = document.getElementById("Auswahl").value; 
     document.getElementById("output").innerHTML = auswahl; 
}


     
