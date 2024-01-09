# wp-login

## ```npm i --force```

wp-login is a Wordpress login interface (not using Wordpress provided API), that is written in React Native.
It is a simple demo that can login (persistent) a user against Worpdress user database; it can be useful to make Apps that can access to protected content on a Wordpress powered website.
For example a protected company website with a database of products (or other product details made with custom posts), a database of contents with access levels and so on.
This app is minimal, it was made using Expo and only handle the logged in state (showing a welcome page with username and avatar) and a logged out state (showing a login form).
It has only little error handling, just generic user/password error, server connection error and asyncstorage error
It could be used as a starting point for more complex project.
Beside Expo the app uses React Navigation and react-native-paper for basic styling.

We also provide the PHP file that shoud be place in your Wordpress root, as the rest the PHP file have no security check and shouldn't be used in production environment.
