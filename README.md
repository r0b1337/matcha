# matcha

### synopsis
This school project is about creating a dating website.<br>
> You will need to create an app allowing two potential lovers to meet,from the registration to the final encounter.<br>
> A user will then be able to register, connect, fill his/her profile, search and look into the profile of other users, like them, chat with those that "liked" back.

### technologies we'll use
> **[Node.js](https://nodejs.org/)**<br>
> **[React](https://reactjs.org/)**<br>
> **[MySQL](https://www.mysql.com/)**<br>

### database structures
**users**
```
{
	"id": Number,
	"email": String,
	"username": String,
	"firstname": String,
	"lastname": String,
	"password": String,
	"status": Boolean, // email valid or not | default: false
	"localisation": String,
	"last_seen": String, // online, offline since...
	"date_of_birth": Date,
	"gender": String, // male, female
	"sexual_orientation": String, // default: bisexual | others: heterosexual, homosexual
	"bio": String,
	"popularity_score": Number,
	"admin": Boolean // default false
}
```

**interesets**
```
{
	"user_id": Number,
	"interest": String
}
```

**images**
```
{
	"user_id": Number,
	"image": String
}
```

**notifications**
```
{
	"user_id": Number,
	"details": String,
	"read": Boolean, // default false
	"date": Date
}
```

**likes**
```
{
	"user_id": Number,
	"target_id": Number,
	"date": Date
}
```

**looks**
```
{
	"user_id": Number,
	"target_id": Number,
	"date": Date
}
```

**reports**
```
{
	"user_id": Number,
	"reason": String,
	"details": String,
	"date": Date
}
```

**blocks**
```
{
	"user_id": Number,
	"target_id": Number,
	"date": Date
}
```

**chats**
```
{
}
```

### api endpoints
> **More details about requests/responses cases in [API.md](https://github.com/nyo/matcha/blob/master/API.md)**

```
/sign/up
/sign/in
/sign/out
```
```
/account/confirm
/account/reset_password
```
```
/profile/update
/profile/update/password
/profile/update/email
/profile/view
/profile/like
/profile/unlike
/profile/<userID>
/profile/report
/profile/block
```
```
/search
```
```
/get/location
/get/popularity_score
/get/suggestions
/get/last_seen
```
```
/notifications
/notifications/read
```
```
/chat/<userID>
/chat/send
/chat/...
```
```
/is_alive
```

### good practices, links & ressources
> see [node best practices](https://github.com/i0natan/nodebestpractices)
#### authentication
> see [json web tokens](https://jwt.io/)
- use [express-session](https://www.npmjs.com/package/express-session) middleware
- read [starting-with-nodejs-authentication](https://medium.com/createdd-notes/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359)
- read **[your-node-js-authentication-tutorial-is-wrong](https://hackernoon.com/your-node-js-authentication-tutorial-is-wrong-f1a3bf831a46)**
#### password storage
> see [password_storage_cheat_sheet](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet) from owasp
- use [bcrypt](https://www.npmjs.com/package/bcrypt) module for hashing passwords
#### password reset
- use true random to generate a token (not based on date or whatever predictable)
- must have expiration date
- must be encrypted in database, as tokens **are** credentials
#### proxy
- run the app at high port and [setup a nginx proxy](https://expressjs.com/en/advanced/best-practice-performance.html#use-a-reverse-proxy) to access it from classical http port
- use the [proxy for rate-limiting](https://www.nginx.com/blog/rate-limiting-nginx/) (or _[express-rate-limit](https://github.com/nfriedly/express-rate-limit)_, _[express-limiter](https://www.npmjs.com/package/express-limiter)_, _[express-brute](https://github.com/AdamPflug/express-brute)_ modules)
#### database
- use `SELECT… FOR UPDATE` or `SELECT… LOCK IN SHARE MODE` and read [concurrency-mysql-and-node-js](https://blog.nodeswat.com/concurrency-mysql-and-node-js-a-journey-of-discovery-31281e53572e)
#### general security
- _[set-up-a-secure-node-js-web-application](https://blog.nodeswat.com/set-up-a-secure-node-js-web-application-9256b8790f11)_
- _[implement-access-control-in-node-js](https://blog.nodeswat.com/implement-access-control-in-node-js-8567e7b484d1)_
- _[unvalidated-redirects](https://blog.nodeswat.com/unvalidated-redirects-b0a2885720db)_
- _[what-i-learned-from-analysing-1-65m-versions-of-node-js-modules-in-npm](https://blog.nodeswat.com/what-i-learned-from-analysing-1-65m-versions-of-node-js-modules-in-npm-a0299a614318)_
- _[what-do-you-know-about-clickjacking](https://blog.nodeswat.com/what-do-you-know-about-clickjacking-afc4c5522a34)_
