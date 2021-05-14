// Module + Config
const Discord = require('discord.js');
const client = new Discord.Client();
const discordemoji = require('discord-emoji');
const moment = require('moment')
const fs = require('fs');
var cron = require("cron");
const config = require('./config.json')
const prefix = config.prefix;
// Configuration des modules discords
var Apocalypse = new Discord.Guild(client, {id: "837681606654558218"})
var channelAnnonce = new Discord.TextChannel(Apocalypse, {id : "842604726087319572"})
var channelPlace = new Discord.TextChannel(Apocalypse, {id : "842604675014459392"})
var joueurRole = new Discord.Role(client, {id : "837682493330554910"}, Apocalypse)
var timeChannel = new Discord.VoiceChannel(Apocalypse, {id : "842700182851813376"})
var hourChannel = new Discord.VoiceChannel(Apocalypse, {id: "842702083567255553"})
// Liste des messages d'annonces
var messageJour = ""
var messageMort = ""
// Boucles des parties démarrés
var bouclePartie = false;
// Le bot démarre
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
})

setInterval(function () {
  var titrechannel = String("Il est environ : "+ moment().format("HH:mm"))
  hourChannel.edit({name : titrechannel})
}, 10000)

var heurejourJob = new cron.CronJob('0 10 * * *', function(){
    timeChannel.edit({name: "Jour sur Thiercellieux"})
})
var heurenuitJob = new cron.CronJob('0 20 * * *', function(){
    timeChannel.edit({name: "Nuit sur Thiercellieux"})
})
heurejourJob.start()
heurenuitJob.start()

// Lorsqu'un membre arrive sur le serveur
client.on("guildMemberAdd", member => {
    // On créer le profil du joueur qui vient d'arrivé sur le serveur
    var data = {
      "name": member.user.username,
      "partiesJouer": 0,
      "partiesGagner": 0,
      "points": 0,
      "MVP": 0,
      "MJStock" : 0,
    }
    var path = "joueurs/" + member.id + ".json"
    fs.access(path, (err) => {
      if (err) {
          writeFile(path, data)
      }
    })
})
// Lorsqu'un membre part du serveur
client.on("guildMemberRemove", member => {

})
// Reaction Rôle
client.on("messageReactionAdd", (reaction, user) => {
  if (reaction.emoji.name === discordemoji.people.eyes) {
    // On v�rifie la reaction et le role de la personne
    console.log(reaction.count)
        // Si il as le role spectateur d�ja on ne fait rien
        if (reaction.message.guild.member(user).roles.cache.get('837682439454588949')) {
            return
        }
        // Si il as le role joueur, on lui retire pour lui mettre le role spectateur
        else if (reaction.message.guild.member(user).roles.cache.get('837682493330554910')) {
            reaction.message.guild.member(user).roles.remove('837682493330554910')
            reaction.message.guild.member(user).roles.add('837682439454588949')
        }
        // Si il n'as rien on met le role spectateur
        else {
            reaction.message.guild.member(user).roles.add('837682439454588949')
        }
        // Pour les deux derniers on v�rifie si un compte est d�ja creer, sinon on lui creer son compte/profil
  }
  if (reaction.emoji.name === discordemoji.activity.video_game) {
    // On v�rifie la reaction et le role de la personne
    console.log(reaction.count)
        // Si il as le role joueur d�ja on ne fait rien
        if (reaction.message.guild.member(user).roles.cache.get('837682493330554910')) {
            return
        }
        // Si il as le role spectateur, on lui retire pour lui mettre le role joueur
        else if (reaction.message.guild.member(user).roles.cache.get('837682439454588949')) {
            reaction.message.guild.member(user).roles.remove('837682439454588949')
            reaction.message.guild.member(user).roles.add('837682493330554910')
        }
        // Si il n'as rien on met le role joueur
        else {
            reaction.message.guild.member(user).roles.add('837682493330554910')
        }
        // Pour les deux derniers on v�rifie si un compte est d�ja creer, sinon on lui creer son compte/profil
  }
})
// Le bot  analyse les messages envoyés
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    // EmojiList
    var reactionpoll = [discordemoji.symbols.one, discordemoji.symbols.two, discordemoji.symbols.three,discordemoji.symbols.four,discordemoji.symbols.five,discordemoji.symbols.six,discordemoji.symbols.seven,discordemoji.symbols.eight,discordemoji.symbols.nine,discordemoji.symbols.zero,discordemoji.symbols.a,discordemoji.symbols.b,discordemoji.symbols.cancer,discordemoji.symbols.diamonds,discordemoji.symbols.end,discordemoji.symbols.fast_forward,discordemoji.symbols.gemini, discordemoji.symbols.hash,discordemoji.symbols.infinity,discordemoji.symbols.black_joker,discordemoji.symbols.koko,discordemoji.symbols.leo,discordemoji.symbols.m, discordemoji.symbols.new, discordemoji.symbols.o, discordemoji.symbols.parking, discordemoji.symbols.question, discordemoji.symbols.radioactive, discordemoji.symbols.sagittarius, discordemoji.symbols.taurus, discordemoji.symbols.underage, discordemoji.symbols.virgo, discordemoji.symbols.warning, discordemoji.symbols.x, discordemoji.symbols.yellow_circle, discordemoji.symbols.zzz];
    // Si le membre a les permissions du bot
    if (message.member.roles.cache.get("841294795225169982")) {
        if (command === "creategame") {
          message.channel.send('Bonjour a tous \n Le maire de Thiercellieux vous convie a une chasse aux Loup-Garou ! Rejoignez nous ! \n' + discordemoji.activity.video_game + ' = Joueur \n' + discordemoji.people.eyes + " = Spectateurs").then(sendMessage => {
              sendMessage.react(discordemoji.activity.video_game)
              sendMessage.react(discordemoji.people.eyes)
          })
        }
        else if(command === "poll"){
          let str = ""
          for (let index = 0; index < args.length; index++) {
              str = str + `${reactionpoll[index]} : ${args[index]}\n`
          }
          const msg = await message.channel.send(str)

          for (let index = 0; index < args.length; index++) {
              msg.react(reactionpoll[index])
          }
          message.delete()
        }
        else if(command === "vote"){
          let str = `Les votes sont ouverts : \n`
          var players = message.guild.roles.cache.get('837682493330554910').members
          var indexeach = 0
          players.forEach((joueurs) => {
              str = str + `- ${reactionpoll[indexeach]} : <@${joueurs.user.id}> \n`;
              indexeach++
          })
          const msg = await message.channel.send(str)
          for (let index = 0; index < players.size; index++) {
              msg.react(reactionpoll[index])
          }
          message.delete()
        }
        else if(command === "annoncejour"){
          var texte = ""
          for (let index = 0; index < args.length; index++) {
            texte = texte + args[index] + " "
          }
          messageJour = texte
          message.channel.send(messageJour)
        }
        else if(command === "annoncenuit"){
          var texte = ""
          for (let index = 0; index < args.length; index++) {
            texte = texte + args[index] + " "
          }
          messageMort = texte
          message.channel.send(messageMort)
        }
        else if(command === "start"){
          bouclePartie = true;
        }
        else if(command === "stop"){
          bouclePartie = false;
        }
        else if(command === "perms"){
          channelPlace.updateOverwrite(joueurRole , {SEND_MESSAGES: false})
        }
        else if(command === "test"){
          channelAnnonce.send("test")
        }
        else if(command === "addrole"){
          if (!args[0]) {
            message.channel.send("Veuillez entrer un code de role pour l'ajouter a la game")
          }
          else {
            if (args[0] === "lg") {
              message.channel.send("Vous avez ajouté le rôle Loup-Garou")
              var rolechannel = new Discord.TextChannel(Apocalypse, {id: "842696811860983828"})
              rolechannel.clone({name : "taniere-des-loups", parent : "837684199922204713"})
            }
            else {
              message.channel.send("Le code de role n'est pas reconnu")
            }
          }
        }
    }
    // Commandes qui ne necessitent pas de permissions
    if (command === "profil") {
      var paths = String("joueurs/" + message.author.id + ".json");
      var data = {
          "name": message.author.username,
          "partiesJouer": 0,
          "partiesGagner": 0,
          "points": 0,
          "MVP": 0,
          "MJStock" : 0,
      }
      fs.access(paths, (err) => {
          if (err) {
              message.channel.send("Votre profil a été créé")
              writeFile(paths, data)
          }
          else {
              var joueur = readFile("joueurs/" + message.author.id + ".json");
              const embed = new Discord.MessageEmbed()
                  .setAuthor("Statistiques de " + message.author.username)
                  .setColor("DARK_RED")
                  .addField("Parties jouees", joueur.partiesJouer)
                  .addField("Parties gagnees", joueur.partiesGagner)
                  .addField("Points", joueur.points)
                  .addField("MVP", joueur.MVP)
                  .addField("MJ Restant", joueur.MJStock)
              message.channel.send(embed)
          }
      })
    }
});
// On gère les automatismes de la partie
while (bouclePartie){
  var jourJob = new cron.CronJob('0 20 * * *', function(){
    channelAnnonce.send(messageJour);
    channelPlace.updateOverwrite(joueurRole , {SEND_MESSAGES: true})
  })
  var nuitJob = new cron.CronJob('0 10 * * *', function(){
    channelAnnonce.send(messageNuit);
    channelPlace.updateOverwrite(joueurRole , {SEND_MESSAGES: false})
  })
  jourJob.start()
  nuitJob.start()
}
// Gestions de fichiers
function writeFile(file, data) {
  data = JSON.stringify(data);
  fs.writeFile(file, data, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
  })
}
function readFile(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
// Token du bot
client.login(config.token);