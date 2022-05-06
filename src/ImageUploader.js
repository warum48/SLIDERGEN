import React, { useState } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";

export default function ImageUploader({
  name = "myFile",
  handleImageChange,
  className = ""
}) {
  const apiUrl = "https://api.nahab.info/api/canvas/upload.php";
  const [postImage, setPostImage] = useState({
    myFile: ""
  });
  const [resizedImg, setResizedImg] = useState(null);

  /*const convertToBase64 = (file) => {
    console.log("type--", file.type);
    var type = file.type;
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (e) => {
        let res = fileReader.result;
        //ResizeImage(res, type);
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };*/
  /*const handleFileUpload = async (e) => {
    console.log("e.target.name", e.target);
    console.log("e.target.name", e.target.name);
    const name = e.target.name;
    const file = e.target.files[0];
    console.log("handleImageChange", handleImageChange);
    const _handleImageChange = handleImageChange;
    const base64 = await convertToBase64(file);
    //const base64 = convertToBase64(file);
    setPostImage({ ...postImage, myFile: base64 });
    //console.log("e.target.name", e.target);
    console.log("name", name);
    //console.log("base64", base64);
    _handleImageChange(name, base64);

    //handleImageChange(e.target, base64);
  };*/

  const onChange = async (event) => {
    const name = event.target.name;
    const file = event.target.files[0];
    const image = await resizeFile(file);
    //console.log(image);
    handleImageChange(name, image);
    //handleSubmitUrlencoded(image);
  };

  /*const handleSubmitUrlencoded = (image) => {
    const details = {
      sp: "testslider",
      canvas: image
    };
    const formBody = Object.keys(details)
      .map(
        (key) =>
          encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
      )
      .join("&");

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: formBody
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        console.log(data.result);
        //setResultId(data.result);
        //setThanxOpen(true);
      }) // if correct: data {result: '0f03a3888b75dddf57259318c09b2d56', status: 200, error: false}
      .catch((error) => {
        console.log("catch", error); // if wrong url in console we see: catch Error: 404      at eval (index.js:134)
      });
    //event.preventDefault();
  };*/

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1200,
        1200,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  return (
    <div className={className}>
      <form className="devutil">
        <input
          className="devutil"
          type="file"
          label="Image"
          name={name}
          accept=".jpeg, .png, .jpg"
          //onChange={(e) => handleFileUpload(e)}
          onChange={(e) => onChange(e)}
        />
      </form>
      <img src={resizedImg} alt="" />
    </div>
  );
}
