// change history
// hs005 add code moderation and restructure code 


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// hs005 for moderation service
const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
      const { id, title } = data;
  
      posts[id] = { id, title, comments: [] };
    }
  
    if (type === 'CommentCreated') {
      const { id, content, postId, status } = data;
  
      const post = posts[postId];
      post.comments.push({ id, content, status });
    }
  
    if (type === 'CommentUpdated') {
      const { id, content, postId, status } = data;
  
      const post = posts[postId];
      const comment = post.comments.find(comment => {
        return comment.id === id;
      });
  
      comment.status = status;
      comment.content = content;
    }
};

app.get('/posts',(req,res)=> {
    console.log(posts);
    res.send(posts);
}); 

app.post('/events',(req,res)=> {
  //hs005
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, () => {
    console.log('Listening on 4002');
});