The task is to display the results of a feed onto a page, and provide a basic form to filter those results.

There is no time restriction on this.  The expectation of code quality level should be similar to “proof of concept” or “example app” not “production-ready code”.  It does not need to scale outside of the description below.  There doesn’t need to be any build process, tooling or frameworks that distract from the core code.  This is purely about the user facing features described below.  (But do feel free to use anything you think will speed up the task, such as jQuery, lodash, Bootstrap, etc.)

When you come into the office, we will go over the code with you and you can explain decisions you made in the implementation.

## Get the feed
To get the feed, go to https://developer.vimeo.com/api/playground/channels/top/videos
select:

```json
{
page: 1,
per_page: 50,
query: null,
filter: null,
filter_embeddable: null,
sort: ‘likes’,
direction: ‘desc’
}
```

The resulting `GET` line should be `https://api.vimeo.com/channels/top/videos?page=1&per_page=50&sort=likes&direction=desc`

Click “Make call” and copy the resulting object into your code.

## Display the results
The display should be similar to a twitter feed.  (https://twitter.com/onedirection)  Note the authors image on the left, with content on the right.  The displayed information should include   author image and link; the video name with link; the video description; number of plays, comments, and likes.  The text should not wrap below the author image.

1. The default view should only be 10 results.
1. Provide the ability to view 10, 25, or 50 maximum results.
1. Provide the ability to filter videos from users that have more than 10 likes. (not videos that have more than 10 1 likes.)  A simple checkbox with description is fine for UI.
1. Provide the ability to filter videos based on text in the description.
1. Provide a next button if there are more results than what is shown (e.g. no filters, and only 10 displayed)
