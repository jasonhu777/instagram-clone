import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import { storage, db } from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

export default function ImageUpload({ username }) {
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState(null)
  const [progress, setProgress] = useState(0)

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image)

    uploadTask.on(

      "state_changed",

      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progress)
      },

      (error) => {
        console.log(error)
        alert(error.message)
      },

      () => {

        //Upload img to firebase, get a download link, use the link to upload to firebase database
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgURL: url,
              username: username
            })

            //after upload
            setProgress(0)
            setCaption("")
            setImage(null)
          })
      }
    )
  }

  return (
    <div className='imageUpload'>
      <progress className='imageUpload__progress' value={progress} max="100" />
      <input type="text"
        placeholder='Whats on your mind?'
        onChange={event =>
          setCaption(event.target.value)
        }
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>
        Upload
      </Button>

    </div>
  )
}
