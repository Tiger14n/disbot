const discord = require("discord.js")
const client = new discord.Client({ disableEveryone: true, disabledEvents: ["TYPING_START"] });
const { readdirSync } = require("fs");
const { join } = require("path");
const {QUEUE_LIMIT, PREFIX } = require("./config.json")
// const { WITAPIKEY } = require("./config.json");

// const listen = require("./commands/speech.js")
//CLIENT EVENTS
client.on("ready", () => {
  console.log('Ready to play song | Bot created by CTK WARRIOR')
  client.user.setActivity("!help | by Ko7o")
 
})

///////////////////////////////////

const fs = require('fs');
const util = require('util');
const path = require('path');
const request = require('request');
const { Readable } = require('stream');

//////////////////////////////////////////
///////////////// VARIA //////////////////
//////////////////////////////////////////

function necessary_dirs() {
    if (!fs.existsSync('./data/')){
        fs.mkdirSync('./data/');
    }
}
necessary_dirs()


//// config ////







function loadConfig() {

        DISCORD_TOK = process.env.DISCORD_TOK;
        WITAPIKEY_TOK = process.env.WITAPIKEY_TOK;
}
loadConfig()


client.on("warn", info => console.log(info));

client.on("error", console.error)

//DEFINIING
client.commands = new discord.Collection()
client.prefix = PREFIX
client.queue = new Map();
client.vote = new Map();

//LETS LOAD ALL FILES
const cmdFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"))
for (const file of cmdFiles) {
  const command = require(join(__dirname, "commands", file))
  client.commands.set(command.name, command)
} //LOADING DONE

const guildMap = new Map();
//WHEN SOMEONE MESSAGE
client.on("message", async (message) => {

////
try {
  if (!('guild' in message) || !message.guild) return; // prevent private messages to bot
  const mapKey = message.guild.id;
  if (message.content.trim().toLowerCase() == _CMD_JOIN) {
      if (!message.member.voice.channelID) {
          message.reply('Error: please join a voice channel first.')
      } else {
          if (!guildMap.has(mapKey))
              await connect(message, mapKey)
          else
              message.reply('Already connected')
      }
  } else if (message.content.trim().toLowerCase() == _CMD_LEAVE) {

      if (guildMap.has(mapKey)) {
          
           let val = guildMap.get(mapKey);
          if (val.voice_Channel) val.voice_Channel.leave()
          if (val.voice_Connection) val.voice_Connection.disconnect()
          if (val.musicYTStream) val.musicYTStream.destroy()
              guildMap.delete(mapKey)
          

          message.reply("Disconnected.")
      } else {
          message.reply("Cannot leave because not connected.")
      }
  }
  else if ( PLAY_CMDS.indexOf( message.content.trim().toLowerCase().split('\n')[0].split(' ')[0] ) >= 0 ) {
      if (!message.member.voice.channelID) {
          message.reply('Error: please join a voice channel first.')
      } else {
          if (!guildMap.has(mapKey))
              await connect(message, mapKey)
       //   music_message(message, mapKey);
      }
  } 

  else if (message.content.trim().toLowerCase() == _CMD_DEBUG) {
      console.log('toggling debug mode')
      let val = guildMap.get(mapKey);
      if (val.debug)
          val.debug = false;
      else
          val.debug = true;
  }
  else if (message.content.trim().toLowerCase() == _CMD_TEST) {
      message.reply('hello back =)')
  }
  else if (message.content.split('\n')[0].split(' ')[0].trim().toLowerCase() == _CMD_LANG) {
      const lang = message.content.replace(_CMD_LANG, '').trim().toLowerCase()
      listWitAIApps(data => {
        if (!data.length)
          return message.reply('no apps found! :(')
        for (const x of data) {
          updateWitAIAppLang(x.id, lang, data => {
            if ('success' in data)
              message.reply('succes!')
            else if ('error' in data && data.error !== 'Access token does not match')
              message.reply('Error: ' + data.error)
          })
        }
      })
  }
} catch (e) {
  console.log('discordClient message: ' + e)
  message.reply('Error#180: Something went wrong, try again or contact the developers if this keeps happening.');
}
/////



   //if (message.author.bot) return;
  if (!message.guild) return;
  
  if(message.content.startsWith(PREFIX)) { //IF MESSSAGE STARTS WITH MINE BOT PREFIX
    
    const args = message.content.slice(PREFIX.length).trim().split(/ +/) //removing prefix from args
    const command = args.shift().toLowerCase();
    
    if(!client.commands.has(command)) {
      return;
    } 
    
  try  { //TRY TO GET COMMAND AND EXECUTE
      client.commands.get(command).execute(client, message, args)
    //COMMAND LOGS
    console.log(`${message.guild.name}: ${message.author.tag} Used ${client.commands.get(command).name} in #${message.channel.name}`)
    /// succes sound

    return
    } catch (err) { //IF IT CATCH ERROR
      console.log(err)
      message.reply("I am getting error on using this command")
    }
    
  }
  
  
});



/* //////// speech codes //////// */

/////////////////////////////////////////
async function connect(message, mapKey) {
  client.on("ready", () => {
      const channel = client.channels.cache.get(member.voice.channelID);
      if (!channel) return console.error("The channel does not exist!");
      channel.join().then(connection => {
          // Yay, it worked!
          console.log("Successfully connected.");
      }).catch(e => {
  
          // Oh no, it errored! Let's log it to console :)
          console.error(e);
      });
  });

try {
  let voice_Channel = await client.channels.fetch(message.member.voice.channelID);
  if (!voice_Channel) return message.reply("Error: The voice channel does not exist!");
  let text_Channel = await client.channels.fetch(message.channel.id);
  if (!text_Channel) return message.reply("Error: The text channel does not exist!");
  let voice_Connection = await voice_Channel.join();
  voice_Connection.play('sound.mp3', { volume: 0.5 });
  guildMap.set(mapKey, {
      'text_Channel': text_Channel,
      'voice_Channel': voice_Channel,
      'voice_Connection': voice_Connection,
      'musicQueue': [],
      'musicDispatcher': null,
      'musicYTStream': null,
      'currentPlayingTitle': null,
      'currentPlayingQuery': null,
      'debug': false,
  });
  speak_impl(voice_Connection, mapKey)
  voice_Connection.on('disconnect', async(e) => {
      if (e) console.log(e);
      guildMap.delete(mapKey);
  })
  message.reply("Connected! I'm ready for your command")
} catch (e) {
  console.log('connect: ' + e)
  message.reply('Error: unable to join your voice channel.');
  throw e;
}

}

/////////////////////////////////////////

/////////////////////////////////////////
function speak_impl(voice_Connection, mapKey) {
  voice_Connection.on('speaking', async (user, speaking) => {
      if (speaking.bitfield == 0 || user.bot) {
          return
      }
      console.log(`I'm listening to ${user.username}`)
      // this creates a 16-bit signed PCM, stereo 48KHz stream
      const audioStream = voice_Connection.receiver.createStream(user, { mode: 'pcm' })
      audioStream.on('error',  (e) => { 
          console.log('audioStream: ' + e)
      });
      let buffer = [];
      audioStream.on('data', (data) => {
          buffer.push(data)
      })
      audioStream.on('end', async () => {
          buffer = Buffer.concat(buffer)
          const duration = buffer.length / 48000 / 4;
          console.log("duration: " + duration)

          if (duration < 1.0 || duration > 19) { // 20 seconds max dur
              console.log("TOO SHORT / TOO LONG; SKPPING")
              return;
          }

          try {
              let new_buffer = await convert_audio(buffer)
              let out = await transcribe(new_buffer);
              if (out != null)
                  process_commands_query(out, mapKey, user.id);
          } catch (e) {
              console.log('tmpraw rename: ' + e)
          }


      })
  })
}





//////////////////////////////////////////
async function transcribe(buffer) {

return transcribe_witai(buffer)
//  return transcribe_gspeech(buffer)
}

// WitAI
let witAI_lastcallTS = null;
const witClient = require('node-witai-speech');
async function transcribe_witai(buffer) {
  try {
      // ensure we do not send more than one request per second
      if (witAI_lastcallTS != null) {
          let now = Math.floor(new Date());    
          while (now - witAI_lastcallTS < 1000) {
              console.log('sleep')
              await sleep(100);
              now = Math.floor(new Date());
          }
      }
  } catch (e) {
      console.log('transcribe_witai 837:' + e)
  }

  try {
      console.log('transcribe_witai')
      const extractSpeechIntent = util.promisify(witClient.extractSpeechIntent);
      var stream = Readable.from(buffer);
      const contenttype = "audio/raw;encoding=signed-integer;bits=16;rate=48k;endian=little"
      const output = await extractSpeechIntent(WITAPIKEY_TOK, stream, contenttype)
      witAI_lastcallTS = Math.floor(new Date());
      console.log(output)
      stream.destroy()
      if (output && '_text' in output && output._text.length)
          return output._text
      if (output && 'text' in output && output.text.length)
          return output.text
      return output;
  } catch (e) { console.log('transcribe_witai 851:' + e); console.log(e) }
  
}



function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function convert_audio(input) {
    try {
        // stereo to mono channel
        const data = new Int16Array(input)
        const ndata = new Int16Array(data.length/2)
        for (let i = 0, j = 0; i < data.length; i+=4) {
            ndata[j++] = data[i]
            ndata[j++] = data[i+1]
        }
        return Buffer.from(ndata);
    } catch (e) {
        console.log(e)
        console.log('convert_audio: ' + e)
        throw e;
    }
}
//////////////////////////////////////////
//////////////////////////////////////////

function process_commands_query(query, mapKey, userid) {
  if (!query || !query.length)
      return;

  let out = null;

  const regex = /^bitch ([a-zA-Z]+)(.+?)?$/;
  const regex2 = /^beach ([a-zA-Z]+)(.+?)?$/;
  const regex3 = /^which ([a-zA-Z]+)(.+?)?$/;
  const regex4 = /^my bitch ([a-zA-Z]+)(.+?)?$/;
  const regex5 = /^my beach ([a-zA-Z]+)(.+?)?$/;
  const m = (query.toLowerCase().match(regex) || query.toLowerCase().match(regex2) || query.toLowerCase().match(regex3) || query.toLowerCase().match(regex4) || query.toLowerCase().match(regex5)) ;

  if (m && m.length) {
      const cmdd = (m[1]||'').trim() ;
      const args = (m[2]||'').trim() ;

      switch(cmdd) {
          case 'help':
              out = _CMD_HELP;
              break;
          case 'skip':
              out = _CMD_SKIP;
              break;
          case 'shuffle':
              out = _CMD_SHUFFLE;
              break;
      case 'lyrics':
              out = _CMD_LYRICS;
              break;
          case 'loop':
              out = _CMD_LOOP;
              break;
          case 'stop':
              out = _CMD_PAUSE;
              break;
          case 'continue':
              out = _CMD_RESUME;
              break;
          case 'clear':
             
                  out = _CMD_CLEAR;
              break;
          case 'leave':
                  out = _CMD_LEAVE;
              break;
          case 'list':
              out = _CMD_QUEUE;
              break;
          case 'hello':
              out = 'hello back =)'
              break;
          case 'favorites':
              out = _CMD_FAVORITES;
              break;
          case 'set':
              switch (args) {
                  case 'favorite':
                  case 'favorites':
                      out = _CMD_FAVORITE;
                      break;
              }
              break;
          case 'play':
          case 'player':
              switch(args) {
                  case 'random':
                      out = _CMD_RANDOM;
                      break;
                  case 'favorite':
                  case 'favorites':
                      out = _CMD_PLAY + ' ' + 'favorites';
                      break;
                  default:
                      
                      if (out == null) {
                          out = _CMD_PLAY + ' ' + args;
                      }
              }
              break;
      }
      if (out == null)
          out = '<bad command: ' + query + '>';
  }
  if (out != null && out.length) {
      // out = '<@' + userid + '>, ' + out;
      console.log('text_Channel out: ' + out)
      const val = guildMap.get(mapKey);
      val.text_Channel.send(out)
  }
}






//////////////////////////////////////////

const _CMD_HELP        = PREFIX + 'help' ;
const _CMD_JOIN        = PREFIX + 'join';
const _CMD_LEAVE       = PREFIX + 'leave';
const _CMD_PLAY        = PREFIX + 'p'  ;
const _CMD_LYRICS      = PREFIX + 'lyrics';
const _CMD_PAUSE       = PREFIX + 'stop';
const _CMD_RESUME      = PREFIX + 'continue';
const _CMD_LOOP       = PREFIX + 'loop';
const _CMD_VOLUME      = PREFIX + 'volume';
const _CMD_CLEAR       = PREFIX + 'clear';
const _CMD_RANDOM      = PREFIX + 'random';
const _CMD_SKIP        = PREFIX + 'skip';
const _CMD_QUEUE       = PREFIX + 'queue';
const _CMD_DEBUG       = PREFIX + 'debug';
const _CMD_TEST        = PREFIX + 'hello';
const _CMD_LANG        = PREFIX + 'lang';
const PLAY_CMDS = [_CMD_PLAY, _CMD_PAUSE, _CMD_RESUME,  _CMD_SKIP, _CMD_LYRICS, _CMD_CLEAR, _CMD_QUEUE];



//////////////////////////////////////////





//DONT DO ANYTHING WITH THIS TOKEN lol
client.login(DISCORD_TOK)
