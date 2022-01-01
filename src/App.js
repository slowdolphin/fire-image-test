import {db, storage, storageRef} from './firebase-config'
import {getStorage, ref, uploadBytesResumable, getDownloadURL, uploadString, listAll, list} from "firebase/storage"

import { collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot} from 'firebase/firestore'
import {useState, useEffect, useRef} from 'react'
import QRCode from "qrcode.react";


function App() {
  const fileTestCollectionRef = collection(db, "fileTest")
//1
  const [fileTest, setFileTest] = useState([])
//2
  const [newTitle, setNewTitle] = useState("")
//3
  const [newDocInfo, setNewDocInfo] = useState("")
//4
  const [link, setLink] = useState("")
//5
  const [qrCode, setQrCode] =useState("")
//6
  const [image, setImage] = useState(null)
//7
  const [files, setFiles] = useState();


  // const handleChange = (e) =>{
  //   if(e.target.files[0]){
  //     setImage(e.target.files[0])
  //   }
  // }

const [qrName, setQrName] = useState("")
const [cubeFace, setCubeFace] = useState({
    link: ""
  });

//i have to set qrCode to the url String before uploading.
  const handleLinkUpload = (qrFile) => {
    // e.preventDefault();
    const metadata = {
      contentType: 'images/png'
    }
    // Data URL string
    //the qr code image that gets pushed is auto named QrImage if there is no name. Let's create two functions 1 strctly for links and 1 for files qr images. might be a bit redundent but should help clear up some questions going forward.
    const qrStorageRef = ref(storage, "Images/QrImage/" + qrName);
    const uploadTask = uploadString(qrStorageRef, qrFile, 'data_url')

    };

  const createQrImage = (e) => {
    //prevents reload obv
    // e.preventDefault();
    //gets the canvas from the "dom"
    let canvas = qrRef.current.querySelector("canvas");
    //converts the qrRef(the QR code) to an image
    //I might just need set "image" as something
    let qrFile = canvas.toDataURL("image/png");
    //this sets the url_string
    setQrCode(qrFile)
    //this passes the url_string to the handleLinkUpload function and pushes the qrcode to the firebase storage
    handleLinkUpload(qrFile)

    //clear states
    setCubeFace({
      link: ""
    });
    // setQrName("")
    setQrCode("");
  };

//this should delete the image, but first i'll have to list them out frist.
//directions say to use uuid, but i'm going to need to know how to get that, because all i know if the access token.
// const deleteQr = () =>{
//   const desertRef = ref(storage, "Images/QrImage/"+ qrName);
//   // Delete the file
//   deleteObject(desertRef).then(() => {
//     // File deleted successfully
//   }).catch((error) => {
//     // Uh-oh, an error occurred!
//   })
// }
//
// const deleteFile = () =>{
//   const desertRef = ref(storage, "Images/"+ qrName);
//   // Delete the file
//   deleteObject(desertRef).then(() => {
//     // File deleted successfully
//   }).catch((error) => {
//     // Uh-oh, an error occurred!
//   })
// }

const qrRef = useRef();
//this basically creates the image and allows us to download the image.
const downloadQRCode = (e, props) => {
  //prevents reload obv
  e.preventDefault();
  //gets the canvas from the "dom"
  let canvas = qrRef.current.querySelector("canvas");
  console.log(canvas);
  //converts the qrRef(the QR code) to an image
  //I might just need set "image" as something
  //so i cannot swap the png to svg. I can however redner the QrCode as a svg to begin with. I'll have to look into more options as well
  let image = canvas.toDataURL("image/png");
  console.log(image);
  //creates an anchor tag
  let anchor = document.createElement("a");
  //makes the href of the tag to be the image
  anchor.href = image;
  //the name of the download
  //does not work if just using {qrName}, just use qrName
  anchor.download = qrName
  console.log(qrName)
  //mounts the anchor
  document.body.appendChild(anchor);
  //this is function that causes the download
  anchor.click();
  //unmounts the anchor
  document.body.removeChild(anchor);

  setCubeFace({
    link: ""
  });
  setQrName("");
};

const handleQRChange = (e) => {
    setCubeFace({ ...cubeFace, [e.target.name]: e.target.value });
  };

const handleNameChange = (e)=>{
  setQrName(e.target.value )
}


  const code = (
     <QRCode
       level="Q"
       value={cubeFace.link}
     />
   );


// creating the storage, .ref is the refernce creating a new folder id, ".put" uploading.
// .on, snapshot = current progress, error checking,
const handleUpload = async () => {
  const metadata = {
    contentType: 'images/png'
  }
  const storageRef = ref(storage, "Images/" + image.name);
  const uploadTask = uploadBytesResumable(storageRef, image, metadata)
  uploadTask.on('state_changed',
  (snapshot) => {
    },
  (error) =>{
    console.log("oops")
  },
  () =>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      // setLink(downloadURL)
      setCubeFace({
        link: downloadURL
      })
      setQrName(image.name)

      createQrImage()
      console.log('File available at', downloadURL);
    })
  }
)

};


const handleTitleChange = e => {
  setNewTitle({ ...newTitle, [e.target.name]: e.target.value });
};

const handleDocInfoChange = e => {
  setNewDocInfo({ ...newDocInfo, [e.target.name]: e.target.value});
};

const updateTest = async (id, docInfo)=>{
  const testDoc = doc(db, "fileTest", id)
  const newFields = {docInfo: ""}
  await updateDoc(testDoc, newFields)
}

const deleteTest = async (id) =>{
  const testDoc = doc(db, "fileTest", id)
  await deleteDoc(testDoc)
}

const getFileTest = async () =>{
  const abc = onSnapshot(fileTestCollectionRef, (querySnapshot)=>{
    const items = []
    querySnapshot.forEach((doc)=>{
      items.push(doc.data())
    })
    setFileTest(items)
  })
}

  useEffect(()=>{
    getFileTest()
  },[])
// have to look at this. Changed the onChange from the scaleable functino to a prop. It messed up because of the "name"
  const createTest = async () => {
    await addDoc(fileTestCollectionRef, {Title: newTitle, docInfo: newDocInfo})
  }


  const [dataB, setDataB] = useState(false);
  const closeDataList = () =>{
    setDataB(!dataB)
  }
  const [file, setFile] = useState(false);
  const closeFile = () =>{
    setFile(!file)
  }
  return (
    <div className="App">
    {dataB ? <></> : <>
    <input
      placeholder="Title"
      onChange={(event) => {
         setNewTitle(event.target.value);
       }}
    />
    <input
      placeholder="DocInfo"
      onChange={(event) => {
         setNewDocInfo(event.target.value);
       }}
    />
    <button onClick={createTest}> Create User</button>

    {//this is itterating through the array of items in the collection. There is only 1 atm.
    //things to build out is the rest of the CRUD.
    }
      {fileTest.map((item, index)=>{
        return(
          <div key={index}>
          {""}
          <h1>Title: {item.Title}</h1>
          <h1>Doc Info: {item.docInfo}</h1>
          <button
             onClick={() => {
               updateTest(item.id, item.Title);
             }}
           >
             {" "}
             Increase Age
           </button>
          <button
             onClick={() => {
               deleteTest(item.id);
             }}
           >
             {" "}
             Delete User
           </button>
          </div>
        )
      })}
      </>}
    {file ? <></> :
    <>
    <div>
    {""}
    <div> Uploading an image to storage</div>
    <input type="file"

    onChange={(e) => {
       setImage(e.target.files[0]);
     }}

     />
    <button type="button" onClick={handleUpload} >UpLoad</button>
    {/* basically the handleupload needs to be recreated for the new image to work.
      basically, once it creates a the image with downloadQRcode i would then need to fill this input as with that new file?
      maybe if i just do an if statement of like
      "If value state is 0 then "", else valueState?" Can I even do something like this?
      Maybe it'd just be best to create a second input pass the value into that like regular

      */}
    <h1>Here is your Link: {link} </h1>

    <input
      placeholder="Title"
      value={link}
      onChange={(event) => {
         setNewTitle(event.target.value);
       }}
    />
    <button onClick={createTest}> Create User</button>

    </div>
    <img src={link} alt="..." />
    </>}

    <>
    <form onSubmit={downloadQRCode}>
       <h1>Hello QRCode Test</h1>
       <input
        id="title"
        type="text"
        name="name"
        placeholder="name your file"

        value={qrName}
        onChange={handleNameChange}
       />
       <label htmlFor="qrName">Image Name </label>
       <input
       id="link"
       type="text"
       name="link"
       placeholder="add your link"

       value={cubeFace.link}
       onChange={handleQRChange}
       />
       <label htmlFor="link"> Link </label>
       <input
       id="test"
       type="text"
       name="link"
       placeholder="add your link"

       value={qrCode}
       onChange={(e) => setQrCode(e.target.value)}
       />
       <label htmlFor="link"> base64 </label>

     <h2>Add a link!</h2>

     {""}

     <button type="submit"> Just download a png of the qr code </button>
     <button type="button" onClick={createQrImage}> convert qr code to an image and push to database</button>
     <button type="button" onClick={handleLinkUpload}>  push to database </button>

   </form>
     <div className="qr-container__qr-code" ref={qrRef}>
      {code}
     </div>
    </>

    </div>
  )
}

export default App;
