# Split Join texts

## Features
* Specify a separator and split the text into multiple lines.
* Specify a separator and join selected lines.

Split and join text.

![Split and join text.](./images/splitjoin01.gif)

Split, delete separator and join text.

![Split, delete separator and join text.](./images/splitjoin02.gif)


## Available command
* extension.splitText : Specify a separator and split the text into multiple lines.
* extension.splitTextAndDeleteSeparator : Specify a separator and split the text into multiple lines, and delete separators.
* extension.joinText : Specify a separator and join texts of a few rows of lines.
* extension.joinTextAndDeleteIndent : Specify a separator and join selected lines, and delete indent spaces.(/^\s*/)

  
## Extension Settings

| parameter name                 | description       | type   | default value |
| ------------------------------ | ----------------- | ------ | ------------- |
| splitJoinText.defaultSeparator | default separator | string | ","           |


