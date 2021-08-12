const discord2 = require("discord.js")
const { WITAPIKEY } = require("./config.json");
const { MessageEmbed } = require("discord.js")
const ms = require("ms")
//////////////////////////////////////////
//////////////// CONFIG //////////////////
//////////////////////////////////////////
const discordClient = new discord2.Client()
discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`)
})

  
module.exports = {
  name: "listen",
  description: "listening",
  execute: (client, message, args) => {
function loadConfig() {
    
    if (!WITAPIKEY)
        throw 'failed loading config #113 missing keys!'
    
}
loadConfig()


const https = require('https')
function listWitAIApps(cb) {
    const options = {
      hostname: 'api.wit.ai',
      port: 443,
      path: '/apps?offset=0&limit=100',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+WITAPIKEY,
      },
    }

    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      });
      res.on('end',function() {
        cb(JSON.parse(body))
      })
    })

    req.on('error', (error) => {
      console.error(error)
      cb(null)
    })
    req.end()
}
function updateWitAIAppLang(appID, lang, cb) {
    const options = {
      hostname: 'api.wit.ai',
      port: 443,
      path: '/apps/' + appID,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+WITAPIKEY,
      },
    }
    const data = JSON.stringify({
      lang
    })

    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let body = ''
      res.on('data', (chunk) => {
        body += chunk
      });
      res.on('end',function() {
        cb(JSON.parse(body))
      })
    })
    req.on('error', (error) => {
      console.error(error)
      cb(null)
    })
    req.write(data)
    req.end()
}
//////////////////////////////////////////

////////////////




const _CMD_HELP        = PREFIX + 'help' ;
const _CMD_JOIN        = PREFIX + 'join';
const _CMD_LEAVE       = PREFIX + 'leave';
const _CMD_PLAY        = PREFIX + 'play'  ;
const _CMD_LYRICS      = PREFIX + 'lyrics';
const _CMD_PAUSE       = PREFIX + 'pause';
const _CMD_RESUME      = PREFIX + 'resume';
const _CMD_SHUFFLE     = PREFIX + 'shuffle';
const _CMD_FAVORITE    = PREFIX + 'favorite';
const _CMD_UNFAVORITE  = PREFIX + 'unfavorite';
const _CMD_FAVORITES   = PREFIX + 'favorites';
const _CMD_GENRE       = PREFIX + 'genre';
const _CMD_GENRES      = PREFIX + 'genres';
const _CMD_CLEAR       = PREFIX + 'clear';
const _CMD_RANDOM      = PREFIX + 'random';
const _CMD_SKIP        = PREFIX + 'skip';
const _CMD_QUEUE       = PREFIX + 'list';
const _CMD_DEBUG       = PREFIX + 'debug';
const _CMD_TEST        = PREFIX + 'hello';
const _CMD_LANG        = PREFIX + 'lang';
const PLAY_CMDS = [_CMD_PLAY, _CMD_PAUSE, _CMD_RESUME, _CMD_SHUFFLE, _CMD_SKIP, _CMD_LYRICS, _CMD_GENRE, _CMD_GENRES, _CMD_RANDOM, _CMD_CLEAR, _CMD_QUEUE, _CMD_FAVORITE, _CMD_FAVORITES, _CMD_UNFAVORITE];







//////////////////////////////////////////

const guildMap = new Map();

discordClient.on('message', async (msg) => {
    try {
        if (!('guild' in msg) || !msg.guild) return; // prevent private messages to bot
        const mapKey = msg.guild.id;
        if (msg.content.trim().toLowerCase() == _CMD_JOIN) {
            if (!msg.member.voice.channelID) {
                msg.reply('Error: please join a voice channel first.')
            } else {
                if (!guildMap.has(mapKey))
                    await connect(msg, mapKey)
                else
                    msg.reply('Already connected')
            }
        } else if (msg.content.trim().toLowerCase() == _CMD_LEAVE) {
   
            if (guildMap.has(mapKey)) {
                
                 let val = guildMap.get(mapKey);
                if (val.voice_Channel) val.voice_Channel.leave()
                if (val.voice_Connection) val.voice_Connection.disconnect()
                if (val.musicYTStream) val.musicYTStream.destroy()
                    guildMap.delete(mapKey)
                
  
                msg.reply("Disconnected.")
            } else {
                msg.reply("Cannot leave because not connected.")
            }
        }
        else if ( PLAY_CMDS.indexOf( msg.content.trim().toLowerCase().split('\n')[0].split(' ')[0] ) >= 0 ) {
            if (!msg.member.voice.channelID) {
                msg.reply('Error: please join a voice channel first.')
            } else {
                if (!guildMap.has(mapKey))
                    await connect(msg, mapKey)
                music_message(msg, mapKey);
            }
        } else if (msg.content.trim().toLowerCase() == _CMD_HELP) {
            msg.reply(getHelpString());
        }
		
        else if (msg.content.trim().toLowerCase() == _CMD_DEBUG) {
            console.log('toggling debug mode')
            let val = guildMap.get(mapKey);
            if (val.debug)
                val.debug = false;
            else
                val.debug = true;
        }
        else if (msg.content.trim().toLowerCase() == _CMD_TEST) {
            msg.reply('hello back =)')
        }
        else if (msg.content.split('\n')[0].split(' ')[0].trim().toLowerCase() == _CMD_LANG) {
            const lang = msg.content.replace(_CMD_LANG, '').trim().toLowerCase()
            listWitAIApps(data => {
              if (!data.length)
                return msg.reply('no apps found! :(')
              for (const x of data) {
                updateWitAIAppLang(x.id, lang, data => {
                  if ('success' in data)
                    msg.reply('succes!')
                  else if ('error' in data && data.error !== 'Access token does not match')
                    msg.reply('Error: ' + data.error)
                })
              }
            })
        }
    } catch (e) {
        console.log('discordClient message: ' + e)
        msg.reply('Error#180: Something went wrong, try again or contact the developers if this keeps happening.');
    }
})



//////////////////////////////////////////
async function connect(msg, mapKey) {
  discordClient.on("ready", () => {
      const channel = discordClient.channels.cache.get(member.voice.channelID);
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
  let voice_Channel = await discordClient.channels.fetch(msg.member.voice.channelID);
  if (!voice_Channel) return msg.reply("Error: The voice channel does not exist!");
  let text_Channel = await discordClient.channels.fetch(msg.channel.id);
  if (!text_Channel) return msg.reply("Error: The text channel does not exist!");
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
  msg.reply('connected!')
} catch (e) {
  console.log('connect: ' + e)
  msg.reply('Error: unable to join your voice channel.');
  throw e;
}

}

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
        const output = await extractSpeechIntent(WITAPIKEY, stream, contenttype)
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






  }


};

