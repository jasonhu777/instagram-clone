import React, { useState, useEffect } from 'react'
import { db, auth } from './firebase'

//styles 
import { makeStyles } from "@material-ui/core/styles"
import './App.css'

//Components
import Post from './Post'
import { Button, Input } from '@material-ui/core'
import Modal from "@material-ui/core/Modal"
import ImgageUpload from './ImageUpload'


function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

function App() {
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle)

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user-logged-in

        setUser(authUser)

      } else {
        // !user-logged-in
        setUser(null)
      }

    })
    return () => {
      unsubscribe()
    }
  }, [user, username])

  useEffect(() => {
    db
      .collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })))
      })
  }, [])

  const signUp = (event) => {
    event.preventDefault()
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch(
        (error) => alert(error.message)
      )
  }

  const signIn = (event) => {
    event.preventDefault()

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => { alert(error.message) })

    setOpenSignIn(false)

  }

  return (
    <div className="App">
      <Modal
        open={openSignIn}
        onClose={() => { setOpenSignIn(false) }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="App__signup">
            <center>
              <img
                className="App__headerImg"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                alt=""
              />
            </center>

            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>

          </form>
        </div>
      </Modal>

      <Modal
        open={open}
        onClose={() => { setOpen(false) }}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="App__signup">
            <center>
              <img
                className="App__headerImg"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>

          </form>
        </div>
      </Modal>

      <div className="App__header">
        <img
          className="App__headerImg"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : (
            <div className="App__login">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )
        }
      </div>

      <div className='App__posts'>
        <Post key='post1' postId='post1' user="Jason Hu" username="Jason Hu" caption="Hey there, welcome to my instagram project." imgURL='https://nicetogeekyou.files.wordpress.com/2013/07/cropped-nicetogeekyou.png' />
        {
          posts.map(({ id, post, username }) =>
            <Post key={id} postId={id} user={user ? user.displayName : "Guest"} username={post.username} caption={post.caption} imgURL={post.imgURL} />
          )
        }

      </div>


      {user?.displayName ? (
        <ImgageUpload username={user.displayName} />
      ) : (<h3>Login to post sth</h3>)}

    </div>
  )
}

export default App
