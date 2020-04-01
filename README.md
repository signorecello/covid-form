# covid-form

## Why?

We're just starting 2020 and a pandemic is here. Everybody is doing what they can and I was just sitting on the couch doing nothing. I wanted to help. Local hospital needed it since they had some doctors 24/7 answering calls and filling out forms using just a simple MS Word sheet, then saving and manually sending to the respective family doctors. Also using a MS Word it would be hell to make any kind of statistic treatment or getting some other useful info.

If I could just make it faster to answer calls, fill forms and submit, all while giving useful information to the people answering the calls, I'd be releasing some doctors from that task so they can actually save lives instead of fiddling with emails and MS Word forms.

## How?

I needed something fast (about 10h) so I went for static pages and SSR. Sorry, no React today. It has:
  - Node.js + Express.js
  - Pug for templating
  - MongoDB + Mongoose
  
I also saved myself some time using these services:
  - Mlab to manage the DB
  - Auth0 to manage authentication
  - Sendgrid to send the e-mails
  - Heroku for fast deployment
  
## I want to use this

Great! Just clone the repository. Then install mongo, create an auth0 account, create Sendgrid account, and rename the .env.example file to .env and change values accordingly. `npm run start` and you're good to go.

If you want to make it to heroku, create a free account account on heroku, provision with Mlab and Auth0 addons. Check or add the .env variables on the `settings` tab. Follow the instructions for deployment using heroku cli, and deploy!

## I want to help too!

Much appreciated. Just clone, make the changes, and PR :)
