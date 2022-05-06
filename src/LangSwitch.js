import React from "react";
//import styled from "styled-components";
//import css from "styled-components";
import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
//import { decrease, increase } from "./counterSlice";
import { setEn, setRu } from "./redux/langSlice";

const Switcher = styled.div`
  display: flex;
  margin: 0 7px;
  margin-left: auto;
`;

const Button = styled.div`
  /* This renders the buttons above... Edit me! */
  display: flex;
  /*border-radius: 3px;
  border: 2px solid white;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 6rem;
  height: 3rem;*/
  background: transparent;
  background-color: #ffffff66;
  &:hover {
    background-color: #ffffffff;
  }
  transition: background-color 0.5s;
  color: black;
  margin: 2px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: ${(props) =>
    props.lang === props.curlang.toUpperCase() ? "2px solid white;" : ""};
`;

const LangName = styled.div`
  display: flex;
  margin: 5px;
  /*width: 3rem;*/
  align-items: center;
  justify-content: center;
`;
const LangFlag = styled.div`
  margin: 5px;
  display: flex;
  width: 30px;
  height: 18px;
  align-items: center;
  justify-content: center;
  background-size: 100% 100%;
  background-image: ${(props) =>
    props.lang === "EN"
      ? "url('images/flag_en.png')"
      : "url('images/flag_ru.png')"};
`;

export function LangSwitch() {
  //const count = useSelector((state) => state.counter.value);
  const language = useSelector((state) => state.lang.value);
  // in our slice, we provided the name property as 'counter'
  // and the initialState with a 'value' property
  // thus to read our data, we need useSelector to return the state.counter.value
  const dispatch = useDispatch();
  // gets the dispatch function to dispatch our actions

  return (
    <Switcher className="switchbggggg">
      <div className="d-flex">
        <Button
          onClick={() => dispatch(setEn())}
          lang={"EN"}
          curlang={language}
        >
          <LangName>EN</LangName>
          <LangFlag lang={"EN"} curlang={language} />
        </Button>
        {/*<p>{language}</p>
      <button onClick={() => dispatch(setRu())}>RU</button>*/}
        <Button
          onClick={() => dispatch(setRu())}
          lang={"RU"}
          curlang={language}
        >
          <LangName>RU</LangName>
          <LangFlag lang={"RU"} curlang={language} />
        </Button>
      </div>
    </Switcher>
  );
}
