



let isPlayingVal = false

const isPlaying  = () => {
 return isPlayingVal
}

//get this from login api
let userId = "65b8a3630f7167e7c84cd2fa"

let appSession = {};
(function (window) {
  

  var socket = io('http://localhost:8080'); // Adjust the server URL accordingly
 
  var audioState = 'PAUSED'
  socket.on('connect', function () {
    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({ audio: true }, success, function (e) {
        alert('Error capturing audio.');
      });
    } else {
      alert('getUserMedia not supported in this browser.');
    }

    var recording = false;
    var silenceThreshold = -25; // Adjust this threshold based on your audio characteristics
    var minSilenceDuration = 1000; // Minimum duration of silence before starting a new chunk (in milliseconds)
    var lastAudioTimestamp = Date.now();
    var audioState = 'PAUSED'  //PAUSED, ENDED
    window.startRecording = function () {
      socket.emit('start', { sampleRate: context.sampleRate, userId, ...appSession });
      recording = true;
    };

    window.stopRecording = function () {
      recording = false;
      socket.emit('endChunk', {userId, ...appSession});
    };

    window.end = function () {
      socket.emit('end', {userId, ...appSession});
      recording = false;
    };

    function success(e) {
      audioContext = window.AudioContext || window.webkitAudioContext;
      context = new audioContext();


      // the sample rate is in context.sampleRate
      audioInput = context.createMediaStreamSource(e);

      var bufferSize = 2048;
      recorder = context.createScriptProcessor(bufferSize, 1, 1);

      recorder.onaudioprocess = function (e) {
        if (!recording || isPlaying()) return;
        console.log(context.sampleRate)

        var left = e.inputBuffer.getChannelData(0);

        // Calculate the volume level in decibels
        var volumeInDecibels = calculateVolumeInDecibels(left);

        var currentTimestamp = Date.now();
        var silenceDuration = currentTimestamp - lastAudioTimestamp;
        console.log(audioState, silenceDuration, volumeInDecibels, silenceThreshold)
        if ((volumeInDecibels > silenceThreshold)) {
          audioState = 'LISTENING';
          lastAudioTimestamp = Date.now();
        }
        if (volumeInDecibels < silenceThreshold && audioState === 'LISTENING') {
          // Check if the silence duration exceeds the threshold
          if (silenceDuration > minSilenceDuration) {
            // Start processing a new chunk
            
            socket.emit('processChunk', {userId, ...appSession});
            lastAudioTimestamp = Date.now();
            audioState = 'PAUSED';
          }

        }
        if (silenceDuration > 2000 && audioState !== 'PROCESSED') {
          audioState = 'PROCESSED';
          socket.emit('endChunk', {userId, ...appSession});
          lastAudioTimestamp = Date.now();
        }


        if (recording && audioState === 'LISTENING') {

          socket.emit('audioData', {audio: convertoFloat32ToInt16(left) , userId, ...appSession} );
        }
      };

      audioInput.connect(recorder);
      recorder.connect(context.destination);
    }

    function calculateVolumeInDecibels(buffer) {
      var rms = calculateRootMeanSquare(buffer);
      var referenceAmplitude = 1.0; // Adjust this based on your audio characteristics
      var dB = 20 * Math.log10(rms / referenceAmplitude);
      return dB;
    }

    function calculateRootMeanSquare(buffer) {
      var sumOfSquares = buffer.reduce(function (acc, val) {
        return acc + val * val;
      }, 0);
      var meanSquare = sumOfSquares / buffer.length;
      var rootMeanSquare = Math.sqrt(meanSquare);
      return rootMeanSquare;
    }

    function convertoFloat32ToInt16(buffer) {
      var l = buffer.length;
      var buf = new Int16Array(l);

      while (l--) {
        buf[l] = buffer[l] * 0xFFFF; // convert to 16 bit
      }
      return buf.buffer;
    }
  });

  socket.on('sessionInitialised',  (session) => {
    console.log(session);

    let { chatSocketId,
      sessionId ,
      userId,
      conversationId} = session;
   
       appSession = session;
      socket.emit('startInterview', {userId, sessionId, conversationId} );



  })

     // Example: Receive messages from the server
     socket.on('message', (data) => {
    });

    socket.on('audio_stream', (data) => {
      const audioData = data.audioData;
      const audioBuffer = new Uint8Array(audioData).buffer;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioSource = audioContext.createBufferSource();

      audioContext.decodeAudioData(audioBuffer, (buffer) => {
        audioSource.buffer = buffer;
        audioSource.connect(audioContext.destination);
        console.log(audioSource)
        audioSource.start();
        isPlayingVal = true;

        audioSource.onended = () => {
          isPlayingVal = false;
          // You can perform additional actions here if needed
      };
      });


      // const audioPlayer = document.getElementById('audioPlayer');
      // console.log(isPlaying(), '------', audioPlayer)
      // if(audioPlayer?.srcObject){
      //   audioPlayer.srcObject = audioSource;
      // }
    });

    socket.on('connect', connection => {
      socket.emit('create', {userId, ...appSession});
    });

  socket.on('disconnect', connection => {
    window.end()
  });
  

  // Add Socket.IO event listeners for server responses if needed
  // For example, you might want to listen for 'resume' or 'processChunk' events from the server
  // socket.on('resume', function() { /* Handle resume event */ });
  // socket.on('processChunk', function() { /* Handle processChunk event */ });

})(this);
