import {
  Bot,
  webhookCallback
} from "https://deno.land/x/grammy@v1.9.1/mod.ts"
import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";

const bot = new Bot(Deno.env.get("BOTTOKEN") || "");

bot.command("start", (ctx) => ctx.reply("Welcome\\! You can send me *_RiCh TExt_* `now` \\.", { parse_mode: "MarkdownV2" })); 

bot.command("ping", (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`));

bot.command("help", (ctx) => ctx.reply(`Send me *rich* _text_ and I will send it back in Markdown\\.

By default, ||spoiler|| and __underline__ are ignored, because these styles are generally not available in Markdown \\(dialects\\)\\.

To force convert "spoiler" and "underline" entities, add \\!unstable at the beginning of your rich text, and the bot will use HTML tags for convertion\\. But this feature can bring compatibility issues in edge cases\\.`, { parse_mode: "MarkdownV2" }));

bot.command("source", (ctx) => ctx.reply("We can improve this bot togather on https://github.com/cxumol/tg2md-bot")); 

const entitiesWrap = {
"bold": "\*\*", // TG MarkdownV2  use single \*
"italic": "_",
//"underline": "__", // (most of) markdown does not support underline
"code": "`",
// "pre": "\n```\n",
"strikethrough": "~~" // TG MarkdownV2  use single \~
// "text_link" : "[]()"
// "url": undefined,
}
const toRemove = ["****", "__", "~~~~"]
//   
const entitiesBeforeAfter = {
"pre": {'before':'```\n', 'after':'\n```'},
}
const entitiesBeforeAfterHTML = {
"underline": {'before':'<u>', 'after':'</u>'},
"spoiler": {'before':'<span style="color:black;background:black;">', 'after':'</span>'},
}

function addInsertion(idx, sym, insertions, fn){
if (idx in insertions){
  if (fn==="unshift"){
    insertions[idx].beginning.unshift(sym)
  }else if(fn==="push"){
    insertions[idx].ending.push(sym)
  }
}else{
  if (fn==="unshift"){
    insertions[idx]={"beginning":[sym,],
                        "ending":[""]}
  }else if(fn==="push"){
    insertions[idx]={"beginning":[""],
                        "ending":[sym,]}
  }
}
}

String.prototype.escape = function (chars){
let s = this;
for (const char of chars){
  s = s.replaceAll(char, "\\"+char )
}
return s
};
const escapeChars = "_*[]()~`"; // #+-={}>.!|

bot.on("message:entities").filter(
(ctx) => ctx.senderChat === undefined,
(ctx) => {
 try {
          /*
          ctx.reply(`${ctx.msg.text}
     ${JSON.stringify(ctx.msg.entities)}`)
     */

  const entities = ctx.msg.entities
  const txt = ctx.msg.text //.replace('\n', '  \n')
  const txtlength = ctx.msg.text.length
  var insertions = {"0":{"beginning":[""],
                        "ending":[""]}
                    };
  insertions[ctx.msg.text.length]={"beginning":[""],
                        "ending":[""]}; 

  entities.sort((a,b)=>a.offset - b.offset || a.length-b.length//b["length"] - a["length"]
   )
  for ( let ett of entities){
    if (ett.type in entitiesWrap){ 
      addInsertion( ett.offset, entitiesWrap[ett.type], insertions, "unshift"); // 本来已经是数字类型, 不用转换
      addInsertion( ett.offset+ett.length, entitiesWrap[ett.type], insertions, "push");
    }else if (ett.type in entitiesBeforeAfter){
      addInsertion( ett.offset, entitiesBeforeAfter[ett.type].before, insertions, "unshift");
      addInsertion( ett.offset+ett.length, entitiesBeforeAfter[ett.type].after, insertions, "push");
    }else if (txt.startsWith('!unstable') && ett.type in entitiesBeforeAfterHTML){
      addInsertion( ett.offset, entitiesBeforeAfterHTML[ett.type].before, insertions, "unshift");
      addInsertion( ett.offset+ett.length, entitiesBeforeAfterHTML[ett.type].after, insertions, "push");
    }else if (ett.type=="text_link"){
      addInsertion( ett.offset, "[", insertions, "unshift"); 
      addInsertion( ett.offset+ett.length, `](${encodeURI(ett.url)})`, insertions, "push");
    }
  }

  
  let textArr = [];
  const sliceAts =  Object.keys(insertions).sort((a,b)=>Number(a)-Number(b))
  textArr.push(insertions[sliceAts[0]].ending.join("") + insertions[sliceAts[0]].beginning.join(""))
  for (let i=0; i<sliceAts.length-1;i++){
    textArr.push( ctx.msg.text.slice( Number(sliceAts[i]), Number(sliceAts[i+1]) ).escape(escapeChars) + insertions[sliceAts[i+1]].ending.join("") + insertions[sliceAts[i+1]].beginning.join("") )
  }
    let result = textArr.join("")
    for (const toremove of toRemove) {
      result = result.replaceAll(toremove, "")
    }
    
    ctx.reply( result ) // + "\n\n---DEBUG---\n" + JSON.stringify(insertions)
    //  console.log(ctx.msg)
} catch (err) {
  console.error(err, insertions, ctx.msg.entities);
}
}
);

const handleUpdate = webhookCallback(bot, "std/http");

serve({
["/" + Deno.env.get("BOTTOKEN")]: async (req) => {
  if (req.method == "POST") {
    try {
      return await handleUpdate(req);
    } catch (err) {
      console.error(err);
    }
  }
  return new Response();
},
"/": () => {
  return new Response("Hello world!");
},
});