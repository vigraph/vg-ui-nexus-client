# ViGraph Nexus Client

This is a Web app for the public to control interactive lighting projects
created in ViGraph, connecting through the ViGraph Nexus server.

## How to run it

This is a React+TypeScript Web app built with [Create React App](https://create-react-app.dev/) (CRA).  To run it, clone this repository and run `npm install` and `npm start` in the directory:

        $ git clone git@github.com:vigraph/vg-ui-nexus-client.git
        $ cd vg-ui-nexus-client
        $ npm install
        $ npm start

You'll need npm installed, of course (`sudo apt install npm`) but it will take care of the rest!

By default the Web app will connect to http://localhost:33480 which is the default REST interface port provided by the local ViGraph Nexus server on the same machine.  If you want to connect to another server, you can change the URL in `src/config.json`.

## Contributions

Yes please!

If it's a bug-fix, test or tidy, please just go ahead and send a PR.  If it's anything major, please discuss it with me first...

I ask all contributors to sign a standard, FSF-approved [Contributor License Agreement](http://contributoragreements.org/) to make the project easier to manage.  You can sign it when you generate a PR, or in advance [here](https://cla-assistant.io/vigraph/vg-server).  You only have to do this once for all of ViGraph and ObTools.

Thanks!
