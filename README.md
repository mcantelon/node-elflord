              oooo   .o88o. oooo                           .o8  
              `888   888 `" `888                          "888  
     .ooooo.   888  o888oo   888   .ooooo.  oooo d8b  .oooo888  
    d88' `88b  888   888     888  d88' `88b `888""8P d88' `888  
    888ooo888  888   888     888  888   888  888     888   888  
    888    .o  888   888     888  888   888  888     888   888  
    `Y8bod8P' o888o o888o   o888o `Y8bod8P' d888b    `Y8bod88P" 

CURRENTLY IN DEVELOPMENT SO DON'T EXPECT A LOT.

_"The Elflord knows what is undone."_

Elflord is a standalone or client/server command-line to-do manager.

Use Elflord as a standalone tool if you spend most of your time in the same
place. Or use it as a client/server application if you roam the land.
Elflord's server speaks REST so you can make all manner of things prod at it.

## Tasks

Each task has a description, category, priority, and ID.

A category is just a word and a priority is just a number: the higher the
more important (default is 0).

## Usage

When adding a task you can just specify a task description, if you want,
or you can optionally specify a category and/or priority.

You can add a task using the `a`/`add`/ command.

    elflord add Stare into the eyes of seething darkeness. -c personal -p 3

You can list all tasks using the `l`/`ls`/`list` command.

    elflord ls

You can list tasks in a category:

    elflord ls personal

When you list tasks the ID will be listed and you can use the ID to Do
Things.

The ID can be used to Update a task's description, category, or priority.
You can update a task using the `u`/`update` command.

    elflord u 34 priority 2

The ID can also be used to destroy a task.
You can update a task using the `d`/`delete` command.

    elflord delete 5

## Installation

Elflord is installed using npm, as shown below.

    npm install -g elflord

## Configuration

To configure the Elflord client, enter `elflord` into the command-line
then enter information into the prompts to create a client configuration file.
The configuration file will be written to `.elflord` in your home directory.

To configure the Elflord server, enter `elflord-server`. The configuration
file will be written to `.elflord-server` in your home directory.

You can specify an arbitrary configuration file, if you want, by running
either the client or the server with the `-f` flag.

Ho ho ho.

## Server

If you want to run an Elflord server, start it somewhere by entering
`elflord-server`. You can run it in the "cloud" or in a "sewer".

The server serves to-do items as JSON using a REST-ish interface. Unauthorized
modifications to to-do items can be protected by an optional password. There
is currently nothing to prevent anyone from listing your tasks and finding
out about your ways.

## Underpinnings

Elflord uses the "express" and "express-resource" modules for HTTP responses
and the "request" module for HTTP requests.

Elflord uses the "dirty" module for storage.

Elflord uses the "optimist" module for command-line option parsing, the
"mingy" module for command parsing, and the "commander" module for interactive
prompting.
