
<h1 align="center">tg2md-bot</h1>

<p align="center">
<img width="50%" src="https://user-images.githubusercontent.com/8279655/216827515-bae89bc8-d00b-4b49-b913-747c31c89d1a.jpg">
</p>

Telegram bot converting Telegram's rich text to Markdown.

Relevant technical details can be found on the blog post [Rich-Text in Telegram: A Guide to Converting to Markdown and Understanding the Logic Behind Markup Languages](https://xirtam.cxumol.com/tg-to-md/).

## Preview

![image](https://user-images.githubusercontent.com/8279655/181170278-ff3b3f6e-f51a-4977-90ba-502ff1768bb1.png)

## Environment

The code is intended to run on [Deno Deploy](https://deno.com/deploy)

## Use

https://t.me/tg2mdBot

Send formatted meassage to the Telegram bot and the bot will send the message back in Markdown.

By default, "spoiler" and "underline" are ignored, because these styles are generally not available in Markdown (dialects).

To force convert "spoiler" and "underline" entities, add `!unstable` at the beginning of your rich text, and the bot will use HTML tags for convertion. But this feature can bring compatibility issues in edge cases.

## Contribution

Find bugs in edge cases? No problem. Pull requests are welcomed!

## Acknowledgement

- [@CodeHz](https://github.com/codehz/)
- [@yzqzss](https://github.com/yzqzss/) 
- [@gledos](https://github.com/gledos)
