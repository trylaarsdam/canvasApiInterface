# Assignment Canvas v2 API

This is the complete API documentation for Assignment Canvas v2 at [https://canvas.toddr.org](https://canvas.toddr.org). A few notes:

Docs are available at [https://canvasapi.toddr.org/docs](https://canvasapi.toddr.org/docs).

All requests (except for creating new users and requesting login sessions) require an authentication header. This header should be in the form of Basic Authentication with the users' Assignment Canvas email and password SHA256 hash.

Some endpoints are restricted to just users with the `Administrator` role. Calling these endpoints with credentials that only have user privileges will result in errors.

There are rate limits on this API configured through NGINX, but under normal use you should not hit them. If you have issues, contact `support@toddr.org.`However you may encounter rate limiting with Canvas' API. In this case you will be returned errors from the Assignment Canvas API. Canvas does not specify specifically what will trigger rate limiting, but again under normal usage I have not had any issues with Canvas rate limiting requests.