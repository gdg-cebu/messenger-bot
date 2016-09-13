# GDG Cebu Messenger Bot

Facebook Messenger Platform bot to handle inquiries about upcoming GDG Cebu events.


## Setting Up

1. Clone this repository.

   ```
   $ git clone https://github.com/gdg-cebu/messenger-bot
   ```

1. Install dependencies.

   ```
   $ cd messenger-bot
   $ npm install
   ```


## Configuration

Create a `config.json` file inside the project's `config` directory, which looks something like this:

```
{
  "FB_VERIFY_TOKEN": "some-value"
}
```

Here are the different configurations that you can set inside `config.json`:

- `FB_VERIFY_TOKEN`: Used when setting up the Facebook App to verify the webhook url. Make sure that the value of this the same as the value that you set when setting up the Facebook App.
- `FB_PAGE_ACCESS_TOKEN`: The access token to use when sending messages from the bot.
- `THREAD_GREETING_TEXT`: The greeting text to show for new conversations with the Facebook Page. To set the greeting text, run this command: `./bin/thread-settings.js`
- `FIREBASE_DATABASE_URL`: The database url to a Firebase app, where the bot will fetch events.


### Configuring Thread Settings

To set the thread settings for new conversations with the Facebook Page, run the following command:

```
$ ./bin/thread-settings
```

This will set the greeting text, get started postback, and persistent menu for new conversation threads. Check out the `bin/thread-settings` file to see what it is setting these values to.


## Running the Server

To run the application server, execute the following command:

```
$ npm start
```



## License

MIT License
