# Endpoints requests & responses details
> **[wiki/List_of_HTTP_status_codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)**

--------------------------------------------------------------------------------
### /sign/up
#### request
_type_ `POST`<br>
_description_ `Register a new account on the application.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"email": String,
	"username": String,
	"password": String,
	"firstname": String,
	"lastname": String
}
```
#### response
_status_ `200`<br>
_description_ `New account registered with success.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /sign/in
#### request
_type_ `POST`<br>
_description_ `Log-in into a user account.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"login": String, // can be either email or username
	"password": String
}
```
#### response
_status_ `200`<br>
_description_ `Logged into the user account with success.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /sign/out
#### request
_type_ `POST`<br>
_description_ `Log-out of a user account.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
}
```
#### response
_status_ `200`<br>
_description_ `Logged out of the user account with success.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /account/confirm
#### request
_type_ `POST`<br>
_description_ `Confirm the email of user account.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"token": String
}
```
#### response
_status_ `200`<br>
_description_ `Confirmed email with success.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /account/reset_password
#### request
_type_ `POST`<br>
_description_ `Send a password-reset-link to a user's email.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"email": String
}
```
#### response
_status_ `200`<br>
_description_ `Email found, sent password-reset-link with success.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters (also: "email not found" case).`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /profile/update
#### request
_type_ `POST`<br>
_description_ `Update most of a user profile information.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"username": String, // optional
	"firstname": String, // optional
	"lastname": String, // optional
	"username": String, // optional
	"date_of_birth": Date, // optional
	"gender": String, // optional
	"sexual_orientation": String, // optional
	"bio": String, // optional
	"interests": [String], // optional
	"images": [String] // optional
}
```
#### response
_status_ `200`<br>
_description_ `Updated the requested profile information(s) with success.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /profile/update/password
#### request
_type_ `POST`<br>
_description_ `Update a user password.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"old_password": String,
	"new_password": String
}
```
#### response
_status_ `200`<br>
_description_ `Updated user password with success.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /profile/update/email
#### request
_type_ `POST`<br>
_description_ `Update a user email.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"new_email": String
}
```
#### response
_status_ `200`<br>
_description_ `Updated user email with success.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /profile/view
#### request
_type_ `POST`<br>
_description_ `Add a 'view' to a user profile.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Integer,
	"target_id": Integer
}
```
#### response
_status_ `200`<br>
_description_ `Profile has been 'viewed'.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /profile/like
#### request
_type_ `POST`<br>
_description_ `Adding a 'like' to a user profile.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Integer,
	"target_id": Integer
}
```
#### response
_status_ `200`<br>
_description_ `Profile has been 'liked'.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /profile/unlike
#### request
_type_ `POST`<br>
_description_ `Removing a 'like' from a user profile.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Integer,
	"target_id": Integer
}
```
#### response
_status_ `200`<br>
_description_ `Profile has been 'unliked'.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /profile/\<user_id\>
#### request
_type_ `GET`<br>
_description_ `Retrieving profile information for a specific user.`<br>
#### response
_status_ `200`<br>
_description_ `Profile information has been retrieved.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK",
	"data": Array // contains profile informations
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /profile/report
#### request
_type_ `POST`<br>
_description_ `Report a specific user.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Integer,
	"target_id": Integer,
	"reason": String,
	"details": String // optional
}
```
#### response
_status_ `200`<br>
_description_ `User has been reported.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /profile/block
#### request
_type_ `POST`<br>
_description_ `Block a specific user.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Integer,
	"target_id": Integer
}
```
#### response
_status_ `200`<br>
_description_ `User has been blocked.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /search
#### request
_type_ `POST`<br>
_description_ `Search the most matching profiles for a specific user`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"filters": Array // optional, searching without filters if not set
}
```
#### response
_status_ `200`<br>
_description_ `Search was made.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK",
	"data": Array // containing most matching profile's user_ids
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /get/location
#### request
_type_ `POST`<br>
_description_ `Retrieving a user's location.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Number,
	"location": String, // optional, if not set -> use request.ip_addr
}
```
#### response
_status_ `200`<br>
_description_ `Succesfully found location.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK",
	"data": Array // containing location's coordinates
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /get/popularity_score
#### request
_type_ `POST`<br>
_description_ `Retrieving popularity score for a specific user.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": String
}
```
#### response
_status_ `200`<br>
_description_ `Succesfully calculated popularity score.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK",
	"data": Number // popularity score for the asked user
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /get/suggestions
#### request
_type_ `POST`<br>
_description_ `Retrieving profile suggestions for a specific user.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Number
}
```
#### response
_status_ `200`<br>
_description_ `Retrieved suggestions for the user.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK",
	"data": Array // containing profiles that might be suggested to the asked user.
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /get/last_seen
#### request
_type_ `POST`<br>
_description_ `Retrieve whether a user is online or not, if user is offline, retrieve last seen date.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Number
}
```
#### response
_status_ `200`<br>
_description_ ``<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK",
	"data": String // "online" OR timestamp (date)
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /notifications
#### request
_type_ `POST`<br>
_description_ `Retrieving notifications for a specific user (with history).`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Number
}
```
#### response
_status_ `200`<br>
_description_ `Retrieved notifications for the asked user.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK",
	"data": Array // containing the notification list
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /notifications/read
#### request
_type_ `POST`<br>
_description_ `Mark as 'read' all the notifications that a user hasn't currently read.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Number
}
```
#### response
_status_ `200`<br>
_description_ `Notifications has been marked has 'read'.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /chat/\<user_id\>
#### request
_type_ `POST`<br>
_description_ `Retrieving chat history for a specific user to another.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Number,
	"target_id": Number
}
```
#### response
_status_ `200`<br>
_description_ `Chat history has been retrieved.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK",
	"data": Array // containing chat history for the asked users
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /chat/send
#### request
_type_ `POST`<br>
_description_ `Send a chat message from a specific user to another.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Number,
	"target_id": Number,
	"message": String
}
```
#### response
_status_ `200`<br>
_description_ `Message has been succesfully sent.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
--------------------------------------------------------------------------------
### /am_alive
#### request
_type_ `POST`<br>
_description_ `Request sent every 30 seconds from the browser to check if the user is still online. If the entry 'last_seen' hasn't been updated after a minute in the database, user is set as offline.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"user_id": Number
}
```
#### response
_status_ `200`<br>
_description_ `The asked user is still connected.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": true,
	"message": "OK"
}
```
_status_ `200`<br>
_description_ `The asked user isn't connected anymore.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 200,
	"success": false,
	"message": "OK"
}
```
_status_ `400`<br>
_description_ `Missing or/and wrong request parameters.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 400,
	"success": false,
	"message": "Bad Request"
}
```
_status_ `500`<br>
_description_ `Internal server error while processing request.`<br>
_mime_ `application/json`<br>
_model_<br>
```
{
	"status": 500,
	"success": false,
	"message": "Internal Server Error"
}
```
