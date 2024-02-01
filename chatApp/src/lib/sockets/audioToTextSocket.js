
const express = require('express');
const http = require('http');
const fs = require('fs');
import OpenAI from "openai";

const wav = require('wav');
var axios = require('axios');
const path = require("path");
const _ = require('lodash')
var FormData = require('form-data');
import {exec} from 'child_process'
const outFile = '-audio.wav';
const WaveFile = require('wavefile').WaveFile;
const { getAudioDurationInSeconds } = require('get-audio-duration')
import  UserSession from '../../models/userSession';
import  Conversation from '../../models/conversations';
import  Messages from '../../models/messages';
import  UserCvDetails from '../../models/userCvDetails';
import  User from '../../models/user';
import  InterviewRole from '../../models/role';
import { getUserRole } from "../../services/userService";
import { saveMessage } from "../../services/messageService";





const client = new OpenAI({
  apiKey: "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",
});

let chunkCounter = 0;
let output = {};
const speechFile = path.resolve("./speech.mp3");
const useWhisper = (filePath) => {
  var data = new FormData();
  let file = fs.createReadStream(filePath);
  data.append('file', file);
  data.append('model', 'whisper-1');
  data.append('response_format', 'text');
  data.append('language', 'en');

  var stats = fs.statSync(filePath)
  var config = {
    method: 'post',
    url: 'https://api.openai.com/v1/audio/transcriptions',
    headers: {
      'Authorization': 'Bearer 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',
      'Content-Type': 'multipart/form-data',
      'Cookie': '_cfuvid=g3oq1WjFJI.q5PWjSmFdri3k9MZ4CEV.RrvRxskjKPk-1703002627767-0-604800000; __cf_bm=EOtib71E5OcLCMZYTm_lJgAqxK6pv0dO_nzRrBAw.aE-1703171567-1-AffLdZjQ6ivKcJtiVUvxyw1pcF38DXTAnPGqkK56ktGwbhROCzG4FcEepKhYME/+Y8ol04laur7dMieRCOx2FDg=',
      ...data.getHeaders()
    },
    data: data
  };

  console.log(stats.size)
  if(stats.size < 10){
    return
    // return Promise.resolve('')
  }

  return axios(config).then(resp => {
    return resp.data;
  }).catch(e => e.data)
}

const textToSpeech = async (text) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/audio/speech', {
      model: 'tts-1',
      input: text,
      voice: 'alloy',
    }, {
      headers: {
        Authorization: 'Bearer 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',
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer', // important to receive response as ArrayBuffer
    });

    const audioBuffer = Buffer.from(response.data);

    // Save audio to a file
    const audioFilePath = path.resolve('./output.mp3');
    fs.writeFileSync(audioFilePath, audioBuffer);
    return response.data;
    // // Play the audio
    // playSound.play(audioFilePath, (err) => {
    //   if (err) {
    //     console.error('Error playing audio:', err);
    //   }
    // });

    console.log('Audio saved to:', audioFilePath);
  } catch (error) {
    console.error('Error:',error, error.response ? error.response.data : error.message);
  }
}

let fileNamePaths = [];

export const getChatSocketId = ({userId, sessionId, conversationId}) => userId + '-' + sessionId + '-' + conversationId;

 export default function connectToAudioSocket (io, socket) {
    let fileWriter;
    let sampleRateValue;
    let brain = [];
    socket.on('start', ({ sampleRate }) => {
      
      sampleRateValue = sampleRate;
      let file = `${__dirname}/audio/` + Date.now() + outFile;
      fileWriter = new wav.FileWriter(file, {
        channels: 1,
        sampleRate: sampleRate,
        bitDepth: 16,
      });
      console.log('started for', file)
    });
  
 
      socket.on('audioData', ({audio, userId, sessionId, conversationId}) => {
        fileWriter.write(new Buffer(audio));
      });
    
      socket.on('processChunk',  async ({userId, sessionId, conversationId}) => {

        fileWriter.end();
        fileNamePaths.push(fileWriter.path);
        const audioBuffer = fs.readFileSync(fileWriter.path);

        // Get the duration of the audio file in seconds
        let ad = await getAudioDurationInSeconds(fileWriter.path).then((a)=> {

        })

        fileWriter = new wav.FileWriter(`${__dirname}/audio/` + Date.now() + outFile, {
          channels: 1,
          sampleRate: sampleRateValue,
          bitDepth: 16,
        });
      });

      socket.on('startInterview', async ({ userId, sessionId, text, conversationId}) => {
        try {
          let userRole = await getUserRole(userId);
          const chatSocket = getChatSocketId({userId, sessionId, conversationId})
          let audioData = await  textToSpeech(userRole.Role.IntroMessage.replace(/{{.*}}/, userRole.UserName))
          io.to(chatSocket).emit('audio_stream', {audioData});
          brain = userRole.Role.Prompt;
          // io.emit('audio_stream', { audioData });
        } catch (error) {
          console.error('Error:', error);
        }
      });
    
      socket.on('endChunk', async ({userId, sessionId, conversationId}) => {
        console.log(userId, sessionId, conversationId);

        let start  = Date.now();
        // Implement any necessary cleanup when the recording ends
        const chatSocket = getChatSocketId({userId, sessionId, conversationId})
        
        let audio = [...fileNamePaths];
        fileNamePaths = []
        if (!audio.length) {
          return
        }
        let audioOutput = await Promise.all(audio.map(p => useWhisper(p)));
        chunkCounter++;
        output = { ...output, [chunkCounter]: audioOutput };
        console.log(audio)
        // remove post processing
        audio.forEach((aud)=>{
          exec(`rm ${aud}`)
        })
        let text = Object.values(output);
        await(saveMessage({
          userId, 
          sessionId,
          conversationId,
          role:  "user",
          message: audioOutput.join(',')
        }))
        brain.push({"role": "user", "content": audioOutput.join(',')});
        let response = await client.chat.completions.create({
          "model": "gpt-3.5-turbo-1106",
          messages: brain,
          stream: false,
         });


        let audioData = await  textToSpeech( 
          response.choices[0].message.content
        )
        brain.push({"role": "assistant", "content": response.choices[0].message.content});
        await(saveMessage({
          userId, 
          sessionId,
          conversationId,
          role:  "assistant",
          message: response.choices[0].message.content
        }))

        let end = Date.now();

        console.log(end-start, "-----------");

          console.log(brain, chatSocket)
        // @shubham save message from user type in messages db with reevant customer and serssion

        io.to(chatSocket).emit('audio_stream', {audioData});

        // io.emit('audio_stream', { audioData });
        //
      });
}
