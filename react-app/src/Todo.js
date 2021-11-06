/*
Add topic:
document:
Topic:
 Name 
 Id
 Categories:
 {
   name:"politics",
  id:12345,
  Categories:[
    News,
    Conversations,
    Media,
    People
  ],
  Top:[
    {
      id:1234,
      category:Media,
      headline:"He's an ass",
      url:"blah.png",
      conversations:20
      comments:200,
      points:10,
      added:7/3/2020 17:06,
    }
  ]
 }


VS    
1. Modify model (Add fridndly)
2. Add "New Tag"- service outputs to submit via logic app
4. Add "Confirm New Tag" -adds the tag
React:
1. Add confirm screen (includes reddit, etc)
2. Add submit screen (only includes topic name)
DB
1. Modify schema
Add search  
fix video resolution
fix video resolution
Add create your own category
change url to include headline  
Add replace link with better one
  child comments
  add rich text support
  start migrating to cosmos
  Add friendly name
  <topic doc>
    -Friendly name(s)
    -public?

    <news story doc>
    <images>
    <discussions>
    <exchanges/stores>
    <people>
  add sign in / sign up
  
  --add points to story page  
  --add save / share
  --submit button
  --Button on header for submit
  --Modal class
  --show hide with buttons
  --form in modal class
  --submit 
  --show success by going to post page
  

  --Render comments
  --Show/hide reply form
  ==add a comment id to reply form
  --add to git
  --if the kind of story is pic show the pic
  --if the kind of story is video show the video
  --deploy to app service
  --setperate storycard and story list
  -- make videos full screen-able
  --move selector to nav bar
  -- add thumbnails
  -- add stupid button
  -- no pic privew on image links
  --get voting to work
  --voting backend
  --user name on comment is strange
  --Don't let blank comments submit / persist
  --make reply box go away on submit
  --change sort order
  --add function to generate blobs by default
  --handle reply submission
  --hide pills on comments
  --stop cron job
  --flip to point to front instead
  --if story.json gets 404- call pc? equivalent
  --if tag.json 2 gets 404 get 2nd page, etc
  --add page 2
  -- sort tags aphabetically
  --make votes toggle correctly (only up, down, or stupid)
  --fix story page to show images and text and headline
*/

/* Long term
Modernize:

graphQL?
maybe make it so that it all just writes to blob?
Make a function to pull a single story from DB /api/story
  Make a function that updates a blob if it's not thatere
TXT 	@ 	eff5front.azurewebsites.net
A 	@ 	104.43.142.33
ID: 3d2d1001-f4f1-4486-9df9-4d005d5d7442
Sec: tapSRmnMKbRHzhXj2@@Yqx8tGr@bA2]4 
AzureWebJobsDashboard
DefaultEndpointsProtocol=https;AccountName=eff5;AccountKey=131WA8s1b0M75bsFVru8JMbh33j1XWtQkkZOcZs7Ai6DSmEY+UaYu5RXIIChXMiwLLKU8XQascTIc8ded90GgQ==;EndpointSuffix=core.windows.net
*/