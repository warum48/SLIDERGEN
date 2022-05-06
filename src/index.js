import React, { useState, useEffect, useRef } from "react"; //
import "./styles.css";
import "./styles_add.css";
import ReactDOM from "react-dom";
import { ReduxWrapper } from "./redux/ReduxWrapper";
//import styled from "@emotion/styled";
import Html from "./Html";
import ImageUploader from "./ImageUploader";
import SortableList from "./SortableList";
import PrismCode from "react-prism";
import "prismjs";
import "prismjs/components/prism-jsx.min";
import "prismjs/themes/prism-okaidia.css";
import "prismjs/components/prism-json"; // need this
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useUpdateEffect } from "react-use";
import { Switch, useCheckboxState } from "pretty-checkbox-react";
import "@djthoms/pretty-checkbox";
import TextareaAutosize from "react-textarea-autosize";
import shortid from "shortid";
import { LangSwitch } from "./LangSwitch";
import { useSelector, useDispatch } from "react-redux";
import { LANG } from "./languages";

const sliderType = "slider1";
const uploadBase64ApiUrl = "https://sp.imweb.ru/api/canvas/upload.php";

const saveSliderApiUrl =
  "https://sp.imweb.ru/implant/sp/cosmoslider2022/templates/default/iframe/api/data/";
const initSliderScriptUrl =
  "https://sp.imweb.ru/implant/sp/assets/sliderinit/sliderinit.js";
const sliderIframeUrl = "https://sp.imweb.ru/implant/sp/spslider/iframe/";
const previewUrlBase =
  "https://sp.imweb.ru/implant/sp/spslider/preview.html?sliderid=";
const initial = {
  time: 3000,
  slides: [
    { text: "Текст первого слайда", id: "id-1", head: "Заголовок 01" },
    { text: "Текст второго слайда", id: "id-2", head: "Заголовок 02" }
  ]
};

/*function Slide({ slide, index, handleChange, handleImageChange }) {
  return (
    <div>
      <textarea
        type="text"
        id={slide.id}
        name={slide.id}
        onChange={handleChange}
        value={slide.text}
      >
        {slide.text}
      </textarea>

      <img src={slide.image} alt={slide.id} />
      <ImageUploader handleImageChange={handleImageChange} name={slide.id} />
    </div>
  );
}*/

//--------------------------------------------APPLICATION---------------

function SliderApp() {
  const editMode = useCheckboxState({ state: true });
  const debugMode = useCheckboxState({ state: false });
  const [imgUploadedNum, setImgUploadedNum] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCoping, setIsCoping] = useState(false);
  const [state, setState] = useState(initial);
  const [finalSliderJSON, setFinalSliderJSON] = useState({});
  const [resultSliderId, setResultSliderId] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(previewUrlBase);
  const [resultCode, setResultCode] = useState("");
  const [slickSettings, setSlickSettings] = useState({
    dots: false,
    draggable: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  });
  const [redrawCounter, setRedrawCounter] = useState(0);
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const language = useSelector((state) => state.lang.value);

  useEffect(() => {
    //console.log("state", state);
    const slidesNoImgData = state.slides.map((ob) => {
      let nOb = {
        id: ob.id,
        text: ob.text,
        head: ob.head,
        image: ob.imageurl || ""
      };
      return nOb;
    });
    const finalOb = { data: { type: sliderType, slides: slidesNoImgData } };
    setFinalSliderJSON(finalOb);
  }, [state]);

  useEffect(() => {
    if (editMode.state) {
      setSlickSettings((prevState) => ({
        ...prevState,
        dots: true,
        draggable: false
      }));
    } else {
      //console.log("ne---", editMode.state);
      setSlickSettings((prevState) => ({
        ...prevState,
        dots: true,
        draggable: true
      }));
    }
  }, [editMode.state]);

  useUpdateEffect(() => {
    //console.log("-ef-imgUploadedNum", imgUploadedNum);
    if (imgUploadedNum < state.slides.length && imgUploadedNum != 0) {
      uploadBase64(state.slides[imgUploadedNum].imagebase64);
    } else {
      setIsUploading(true);
      saveSlider();
    }
  }, [imgUploadedNum]);

  function addSlide() {
    const copy = [...state.slides];
    const id = shortid.generate();
    copy.push({ text: "Текст", id: id, head: "Заголовок" }); //id: "id-" + (copy.length + 1),
    setState((prevState) => ({ ...prevState, slides: copy }));
  }

  const deleteSlide = (id) => {
    //console.log("delete", id);
    setState((prevState) => ({
      ...prevState,
      slides: prevState.slides.filter((slide) => slide.id !== id)
    }));
    setRedrawCounter((prevState) => prevState + 1);
  };

  const handleChange = (event) => {
    //console.log("event.target.name", event.target.name);
    const text = event.target.value;
    const name = event.target.name;

    setState((prevState) => ({
      ...prevState,
      slides: prevState.slides.map((el) =>
        el.id === name ? { ...el, text } : el
      )
    }));
  };

  const handleChangeHead = (event) => {
    //console.log("event.target.name", event.target.name);
    const head = event.target.value;
    const name = event.target.name;

    setState((prevState) => ({
      ...prevState,
      slides: prevState.slides.map((el) =>
        el.id === name ? { ...el, head } : el
      )
    }));
  };

  const uploadBase64 = (image) => {
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

    fetch(uploadBase64ApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: formBody
    })
      .then((res) => {
        //console.log("res", res);
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          slides: prevState.slides.map((el, index) =>
            index === imgUploadedNum
              ? {
                  ...el,
                  /*["imgname"]: data.data.name,
                  ["imgfile"]: data.data.file,
                  ["imageurl"]: data.data.url*/
                  imgname: data.data.name,
                  imgfile: data.data.file,
                  imageurl: data.data.url
                }
              : el
          )
        }));
        setImgUploadedNum((prevNum) => prevNum + 1);
      })
      .catch((error) => {
        console.log("catch", error); // if wrong url in console we see: catch Error: 404      at eval (index.js:134)
      });
  };

  const saveSlider = () => {
    setIsSaving(true);
    setIsUploading(false);
    fetch(saveSliderApiUrl, {
      method: "POST",
      body: JSON.stringify(finalSliderJSON)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setImgUploadedNum(0);
        setIsSaving(false);
        setResultSliderId(data.response);
        setResultCode(`
        <script src="${initSliderScriptUrl}"></script>
        <iframe src="${sliderIframeUrl}" scrolling="no" style="width: 100%; height: 970px; border: 0px; overflow: hidden; " class="spSlider" data-sliderid="${data.response}"></iframe>
        `);
        setPreviewUrl(previewUrlBase + data.response);
        setIsCoping(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const copyResultToClipboard = () => {
    document.addEventListener(
      "copy",
      function (e) {
        e.clipboardData.setData("text/plain", resultCode);
        e.preventDefault();
      },
      true
    );

    document.execCommand("copy");
    setIsCoping(false);
  };

  const uploadImages = () => {
    for (var i = 0; i < state.slides.length; i++) {
      if (
        !state.slides[i].imagebase64 ||
        state.slides[i].imagebase64.indexOf("data") === -1
      ) {
        alert("Изображение " + (i + 1) + " не загружено");
        return;
      }
    }
    setIsUploading(true);
    uploadBase64(state.slides[0].imagebase64);
  };

  const handleImageChange = (name, base64) => {
    const imagebase64 = base64;
    setState((prevState) => ({
      ...prevState,
      slides: prevState.slides.map((el) =>
        el.id === name ? { ...el, imagebase64 } : el
      )
    }));
  };

  /*const loadSlider = (url) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          slides: data.slides
        }));
      })
      .catch((error) => {
        console.log("er", error);
      });
  };*/

  const reset = () => {
    setState(initial);
    setRedrawCounter((prevState) => prevState + 1);
  };

  return (
    <div className="mainWrapper">
      {(isUploading || isSaving || isCoping) && (
        <div className="blocker">
          <div className="inblocker">
            {isUploading && (
              <div className="waitinfo">
                Подождите, сохраняем.
                <br />
                Загружено изображений: {imgUploadedNum} из {state.slides.length}
              </div>
            )}
            {isSaving && <div className="waitinfo">Сохранение данных</div>}
            {isCoping && (
              <div className="waitinfo resultcode">
                <div>
                  Слайдер сохранен. Предпросмотр по&nbsp;
                  <a href={previewUrl} target="_blank" rel="noreferrer">
                    ссылке
                  </a>
                  .
                </div>
                <button
                  className="devutil closeresult"
                  onClick={() => setIsCoping(false)}
                >
                  ✖
                </button>
                <div>Или сразу скопируйте код:</div>
                <div className="codetocopy">{resultCode}</div>
                <button className="devutil" onClick={copyResultToClipboard}>
                  Скопировать код
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="topnav">
        <div className="switchbg">
          <Switch {...editMode}>{LANG.editMode[language]}</Switch>
        </div>
        <div className="switchbg">
          <Switch {...debugMode}>{LANG.developerMode[language]}</Switch>
        </div>

        <button className="devutil" onClick={reset}>
          Reset
        </button>
        <LangSwitch />
      </div>
      <div className="vspace"></div>
      <div className="implantWrapper">
        <div className="sliderbox">
          <Slider
            {...slickSettings}
            key={"slick" + redrawCounter}
            asNavFor={nav2}
            ref={(slider1) => setNav1(slider1)}
          >
            {state.slides.map((slide, index) => (
              <div className="sliderbox-content" key={"slc" + index}>
                <div className="sliderbox-content_img">
                  <img
                    className="img-responsive"
                    src={
                      editMode.state
                        ? slide.imagebase64 || "images/img.jpg"
                        : slide.imgurl || "images/img.jpg"
                    }
                    alt=""
                  />
                  {editMode.state && (
                    <>
                      <ImageUploader
                        className="imginput"
                        handleImageChange={handleImageChange}
                        name={slide.id}
                      />
                      <button
                        className="devutil delete_slide"
                        onClick={() => deleteSlide(slide.id)}
                      >
                        {LANG.deleteThisSlide[language]}
                      </button>
                    </>
                  )}
                  {debugMode.state && (
                    <div className="slide_id">{slide.id}</div>
                  )}
                </div>
                <div className="sliderbox-content_dotspace"></div>
              </div>
            ))}
          </Slider>

          <Slider
            {...slickSettings}
            key={"secondslick" + redrawCounter}
            asNavFor={nav1}
            dots={false}
            arrows={false}
            ref={(slider2) => setNav2(slider2)}
          >
            {state.slides.map((slide, index) => (
              <div className="sliderbox-content" key={"secondslc" + index}>
                {editMode.state ? (
                  <TextareaAutosize
                    className="sliderbox-content_head sliderbox-content_head_textarea"
                    type="text"
                    id={slide.id}
                    name={slide.id}
                    onChange={handleChangeHead}
                    value={slide.head}
                  ></TextareaAutosize>
                ) : (
                  <div className="sliderbox-content_head">{slide.head}</div>
                )}

                {editMode.state ? (
                  <TextareaAutosize
                    className="sliderbox-content_about sliderbox-content_about_textarea"
                    type="text"
                    id={slide.id}
                    name={slide.id}
                    onChange={handleChange}
                    value={slide.text}
                  ></TextareaAutosize>
                ) : (
                  <div className="sliderbox-content_about">
                    <Html>{slide.text}</Html>
                  </div>
                )}
              </div>
            ))}
          </Slider>
        </div>
        {editMode.state && (
          <>
            <button className="devutil addslide" onClick={addSlide}>
              <span className="plus_add">+&nbsp;</span>
              {LANG.addNewSlide[language]}
            </button>
            <div className="sortbg">
              <h3 className="devutil sorthead">{LANG.sorting[language]}</h3>
              <div className="devutil">{LANG.dragBlocks[language]}</div>
              <SortableList
                updateState={setState}
                initial={initial}
                state={state}
              />
            </div>
            <div className="saveCont">
              <button className="devutil save_slider" onClick={uploadImages}>
                {LANG.saveSlider[language]}
              </button>
              {debugMode.state && (
                <button className="devutil save_slider" onClick={saveSlider}>
                  {LANG.saveSliderWithoutImages[language]}
                </button>
              )}
            </div>
          </>
        )}

        {debugMode.state && (
          <>
            <h3 className="devutil">slider array</h3>
            <div className="prismcode">
              <PrismCode className="language-javascript">
                {JSON.stringify(state.slides)}
              </PrismCode>
            </div>
            <h3 className="devutil">final json</h3>
            <div className="prismcode">
              <PrismCode className="language-javascript">
                {JSON.stringify(finalSliderJSON)}
              </PrismCode>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <ReduxWrapper>
    <SliderApp />
  </ReduxWrapper>,
  rootElement
);
