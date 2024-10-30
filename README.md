# PatchThat

## Introduction

Welcome to PatchThat, the easy way to find out what your system is running and what needs to be patched! Manage your programs and services with ease and make everything transparent—but transparent only to you. This README document is for detailed and clear documentation for the intended use of this product and its implemented services. If there is anything you think is missing or incomplete, please message us!

## Proof of Value

Proof of Value tests can be found in the repository under [docs/PoVTests](docs/PoVTests).

## Features

The features implemented in this app are always growing and expanding, and should continue to do so as technology continues to evolve and as we attempt to give the clearest view possible of what is happening in your computer. This program is intended to work with all major operating systems (Windows, Mac, and Linux). Right now, we have these features implemented:

- Application and service scanning that outputs the default terminal output of these commands (based on your OS):
  - Windows: `tasklist`
  - Mac: `launchctl list`
  - Linux: `systemctl list-units --type=service --all --no-pager`

We also have these features that we intend to implement in our upcoming sprints:

- Formatting of output for an easier reading experience.
- Checking installed versions against posted newest versions.
- Analyzing local Python environments for installed library versions.
- Analyzing Node.js projects and the versions for their installed dependencies.

## Installation

Right now, the only way to install the project is to clone the repository and run `npm run start`. We plan to implement features for creating distributable installers using packages like _Electron Forge_ or _electron-builder_, though proper installation of these require developer accounts and certificates for Windows and Mac, which accounts and certificates we do not have. There are workarounds to this to allow the application to run on your computer, which workarounds will be put in this document once the feature is enabled.

For installation via cloning the repository, follow the steps below:

1. Create a folder in the location you would like to install the project.
2. In your terminal, type `git clone https://github.com/sethbr11/patchthat.git .` (don't forget the "."; this tells git to not create another folder within the folder you already created).
3. Go into the project with `cd patchthat/patchthat` (the first patchthat folder contains the project and docs).
4. Install [Node.js](https://nodejs.org/en/download/package-manager) on the computer if not already installed. On Linux, you can run `sudo apt get npm`
5. Run `npm install` to install dependencies for the project.
6. Run the program with `npm run start`, typed in the terminal.
    - If you are trying to run on Linux and are getting errors, you may need to update permissions from chrome-sandbox as part of your electron dependencies.This can be done by running `sudo chown root:root /home/.../patchthat/patchthat/node_modules/electron/dist/chrome-sandbox` followed by `sudo chmod 4755 /home/.../patchthat/patchthat/node_modules/electron/dist/chrome-sandbox` (replacing "..." with your specific path). You can then check that it worked with `ls -l /home/.../patchthat/patchthat/node_modules/electron/dist/chrome-sandbox`.


## Usage

At the current state of the project, when you open the app it will display a very basic page with a button that says "Scan Services". It may also open up with DevTools up, which you can close or investigate if you are interested (there's not much there). From there, the only functionality is pressing the button and examining the output that shows services and versions. If on Mac, the status code may be of interest while looking at the services: status code 0 means the process is running normally, status code 9 means the process has been terminated, status code 1 means the process stopped but with an error, and status code -6 means the process was aborted (usually an internal issue or deliberate termination due to fatal errors).

## License

This project is licensed with an [MIT License](https://opensource.org/license/mit), which is an open source license.

## Contributors

This project was started as part of an assignment for IS 565 at BYU, which is Digital Forensics for Organizations. The group assigned to this project and who contributed to it includes Seth Brock, Mason Perry, and Ethan Spilker, with notable help from AI sources like ChatGPT and Microsoft Copilot.
