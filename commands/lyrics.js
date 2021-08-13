const { MessageEmbed } = require("discord.js")
const { COLOR } = require("../config.json");
const solenolyrics= require("solenolyrics"); 
module.exports = {
  name: "lyrics",
  description: "Get lyrics of song :v",
  async execute (client, message, args) {
    let embed = new MessageEmbed()
    .setDescription("Looking For Lyrics ...")
    .setColor("YELLOW")
    const msg = await message.channel.send(embed)
    //nothing is playing and didnt write a song name
    if(!args.length) {

      const serverQueue = message.client.queue.get(message.guild.id);
      if (!serverQueue) {
       // embed.setAuthor("Please play somthing or give me a song name")
       
         embed.setDescription("Please play somthing or give me a song name") ;
          msg.edit(embed);
          return
      }
      // song is playing
      songtitle = serverQueue.songs[0].title
        console.log(songtitle);
         getlyricsfromtitle();

          
     /* embed.setDescription(`**NOW PLAYING** - ${serverQueue.songs[0].title}`)
      .setThumbnail(serverQueue.songs[0].thumbnail)
      msg.edit(embed);*/
  

    //  return message.channel.send("Please Give The Song Name")
    } else if (args.length) {
    
   
     try {
          const songs = await Genius.tracks.search(args.join(" "));
          const lyrics = await songs[0].lyrics();
          
           if (lyrics.length > 4095) {
             msg.delete()
        return message.channel.send('Lyrics are too long to be returned as embed');
     }
      if (lyrics.length < 2048) {
        const lyricsEmbed = new MessageEmbed()
          .setColor(COLOR)
          .setDescription(lyrics.trim());
        return msg.edit(lyricsEmbed);
      } else {
        // lyrics.length > 2048
        const firstLyricsEmbed = new MessageEmbed()
          .setColor(COLOR)
          .setDescription(lyrics.slice(0, 2048));
        const secondLyricsEmbed = new MessageEmbed()
          .setColor(COLOR)
          .setDescription(lyrics.slice(2048, lyrics.length));
        msg.edit(firstLyricsEmbed);
        message.channel.send(secondLyricsEmbed);
        return;
      }
      
       
     } catch(e) {
       
       embed.setDescription("Got err : " + e)
       msg.edit(embed)
          console.log(e);
     }
    
    }



////////////////////////////////
 ///// get lyrics functions /////
//////////////////////////////////

async function getlyricsfromtitle() {
  var ab = 0;
 
  let part = songtitle.substring(
    songtitle.lastIndexOf("(", "[") + 1, 
			songtitle.lastIndexOf(")", "]")
);
let part2 = songtitle.substring(
    songtitle.lastIndexOf("[") + 1, 
			songtitle.lastIndexOf("]")
);
					let partinput = songtitle.replace(part, '').replace(part2, '')
					
					let inputcut = partinput.replace('()', '') .replace('[]', '')
		
					let inputlast = inputcut.replace(/\s+/g,' ').trim();
	
					var input = inputlast.split('ft.')[0]
									 

	  
	
  

	  async function showinglyrics() {


     try {
		 
     try {
  var lyrics = await solenolyrics.requestLyricsFor(input)
		  	 }
catch(e) {
	  embed.setDescription("Got err : " + e)
       msg.edit(embed)
          console.error(e);
}
    
	
	 function waitForElement(){
	
    if (lyrics !== null){
		
           if (lyrics.length > 4095) {
             msg.delete()
       
		embed.setDescription("Lyrics are too long to be returned as embed ")
       msg.edit(embed);
     }
      if (lyrics.length < 2048) {
        const lyricsEmbed = new MessageEmbed()
          .setColor("GREEN")
          .setDescription(lyrics.trim());
        return msg.edit(lyricsEmbed);
		
	  
	   
      } if (lyrics.length < 4095 && lyrics.length > 2048 ) {
        // lyrics.length > 2048
        const firstLyricsEmbed = new MessageEmbed()
          .setColor("GREEN")
          .setDescription(lyrics.slice(0, 2048));
        const secondLyricsEmbed = new MessageEmbed()
          .setColor("GREEN")
          .setDescription(lyrics.slice(2048, lyrics.length));
        msg.edit(firstLyricsEmbed);
        message.channel.send(secondLyricsEmbed);
        return;
      
	  }
	 
	 }
	 else {
		 
       // setTimeout(waitForElement, 250);
	   embed.setDescription("Lyrics n")
       msg.edit(embed);
	     
		   }
    
    }
	waitForElement();
	 }
catch(e) {
  
 
  if (ab == 10){
 embed.setColor("RED")
	 embed.setDescription("LYRICS NOT FOUND..")
       msg.edit(embed);
	   console.log();
	   return;
	
 
  } else ab++;
  console.log(ab);  showinglyrics();
  console.log();
 
}
	
	
	
			
			
	
			
	
 }
  				
showinglyrics();
		}


//////////////////////////////// end of lyrics function ////////////


  }
  
}
