# tg2md-bot
Telegram bot converting Telegram's rich text to Markdown

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

- [@CodeHZ](https://github.com/codehz/)
