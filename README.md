              oooo   .o88o. oooo                           .o8  
              `888   888 `" `888                          "888  
     .ooooo.   888  o888oo   888   .ooooo.  oooo d8b  .oooo888  
    d88' `88b  888   888     888  d88' `88b `888""8P d88' `888  
    888ooo888  888   888     888  888   888  888     888   888  
    888    .o  888   888     888  888   888  888     888   888  
    `Y8bod8P' o888o o888o   o888o `Y8bod8P' d888b    `Y8bod88P" 

_"The Elflord knows what is undone."_

Elflord is a standalone or client/server command-line to-do manager.

Use Elflord as a standalone tool if you spend most of your time in the same
place. Or use it as a client/server application if you roam the land.
Elflord's server speaks REST so you can make all manner of things prod at it.
Elflord stores data using files so it's easy to deploy to cloud services such
as Heroku.

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

You can see how many tasks are assigned per category using the
`c/`/`categories` command.

    elflord c

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
access to to-do items can be protected by an optional password. If you want
your to-do items to be public, just leave the password blank.

## Heroku

The Elflord server runs very easily on Heroku, giving you a free place to
host it. First: sign up for an account, install the Heroku CLI tool, and log
into your account using the CLI tool. The steps needed to do these things
are available online (http://devcenter.heroku.com/articles/node-js).

Once you're set up on Heroku, create a clone of Elflord on your workstation.

    cd /some/working/directory
    git clone git://github.com/mcantelon/node-elflord.git
    cd node-elflord

Next, edit the `heroku/config` file, changing the password, and commit the
change.

    git add heroku/config
    git commit -m "Changed password."

Finally, create and launch a Heroku app by entering the following commands.

    heroku create --stack cedar
    git push heroku master
    heroku ps:scale web=1
    heroku open

Your browser should now open to your Elflord server's new home and you can
configure your Elflord client to connect to it.

## REST API

### List all tasks

Method: GET  
Params: password  
Path: /tasks  

### List categories

Method: GET
Params: password
Path: /categories

### List tasks in category

Method: GET
Params: password
Path: /categories/<category>

### Add task

Method: POST
Params: password, description, category (optional), priority (optional)
Path: /tasks

### Update task

Method: PUT
Params: password, description (optional), category (optional), priority (optional)
Path: /tasks/<task ID>

### Delete task

Method: DELETE
Params: password
Path: /tasks/<task ID>

## Underpinnings

Elflord uses the "express" and "express-resource" modules for HTTP responses
and the "request" module for HTTP requests.

Elflord uses the "dirty" module for storage.

Elflord uses the "optimist" module for command-line option parsing, the
"mingy" module for command parsing, and the "commander" module for interactive
prompting.
