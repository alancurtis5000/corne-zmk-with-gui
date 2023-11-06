
# Corne ZMK with GUI Project
This project is for bluetooth corne keyboard to quickly adjust button layouts and 
flash them onto device.

## How to get up an running.
1. get the repo run `yarn install`
2. copy the `.env.example` file and rename it to `.env`
3. Get the values for .env file.
   1. REACT_APP_GITHUB_OWNER= `Your github user name` 
   2. REACT_APP_GITHUB_REPO= `Name of the repo`
   3. REACT_APP_GITHUB_TOKEN= for this you need to generate a token in github follow these steps
       1. [Steps to get Token]( https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) 
       2. Generate token 
       3. copy it and paste it for the value of `REACT_APP_GITHUB_TOKEN`
 4. Now run `yarn start`
 5. App is now running.

## How it works.
This project is built with React.
It uses a fake database that is basically a json file `.\database.json`
Anytime you make changes it updates this file.
**If you want your changes saved you have to commit the changes made to that file** 
Once you make changes and hit save it updated the Database.
Now you can create the firmware for the keyboard.
Selecting `Create Firmware`
- this takes the Keymap of the App and commits to repo `config/corne.keymap` 
- When it completes it creates a Action in Github repo 
- once the action is complete it downloads the artifact
- you can now put that on the keyboard here is how you do that.

To flash the firmware on to keyboard:
- open up the firmware zip file. 
- it will have a left and a right uf2 file ( one for each half )
- Press the reset button twice. ( a blue light will start blinking on the nice nano )
- Plug in a usb cable to the half of the keyboard.(this will open up an explorer window )
- Drag the left file from the firmware zip to the keyboard usb explorer window.
- do the same for the right side. 


## This uses ZMK Firmware
[Documentation Here] (https://zmk.dev/docs/features/bluetooth#:~:text=To%20pair%20with%20a%20new,active%20profile%20will%20receive%20keystrokes.)
Bluetooth Connect
To pair with a new device select an unused profile with or clearing the current profile, using the &bt behavior on your keyboard.


# /////////// Markup examples below ////////////

# Header 1

## Header 2

In the project directory, you can run:

### Header 3 

Regular text

 `Code snip example`

**Note: Example  `eject`, you can't go back!**

Link Example [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

- ordered
- list
- example

