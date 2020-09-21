import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar"
import { db } from './firebase'
import firebase from 'firebase'

function Post({ postId, user, username, caption, imgURL }) {
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')

  useEffect(() => {
    let unsubscirbe
    if (postId) {
      unsubscirbe = db
        .collection("posts").doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()))
        })
    }
    return () => {
      unsubscirbe()
    }

  }, [postId])

  const postComment = (event) => {
    event.preventDefault()
    db.collection('posts').doc(postId).collection('comments').add({
      text: comment,
      user: user,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setComment('')
  }
  //console.log(user)
  return (
    <div className="Post">
      {/* header => avatar + username */}
      <div className="Post__header">
        <Avatar
          className="Post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img className="Post__image" src={imgURL} alt="" />

      <h4 className="Post__text"><strong>{username}</strong> {caption} </h4>

      <div className="Post__comments">
        <h4>Comments</h4>
        {comments.map((comment) =>

          (<p>
            <strong>{comment.user}   </strong>{comment.text}
          </p>)
        )}
      </div>

      {(user !== "Guest" && postId !== 'post1') &&
        <form className="Post__comment">
          <input
            className="Post__input"
            type='text'
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className='Post__button'
            disabled={!comment}
            type="submit"
            onClick={postComment}

          >Post</button>
        </form>}

    </div >
  )
}

export default Post
