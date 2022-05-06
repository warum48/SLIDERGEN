import React, { useState, useEffect } from "react"; //
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";
const grid = 8;
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default function SortableList({
  //initial = { time: 0, slides: [] },
  updateState,
  state
}) {
  const QuoteItem = styled.div`
    width: ${100 / state.slides.length}%;
    border: 1px solid grey;
    margin-bottom: ${grid}px;
    background-color: white;
    padding: ${grid}px;
  `;

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lavender" : "lightgrey",
    display: "flex",
    padding: grid,
    overflow: "auto"
  });

  function Quote({ slide, index }) {
    return (
      <Draggable draggableId={slide.id} index={index}>
        {(provided) => (
          <QuoteItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {/*slide.id}_{slide.content}_{slide.text*/}
            <img
              className="img-responsive"
              src={slide.imgurl || slide.imagebase64 || "images/img.jpg"}
              alt=""
            />
          </QuoteItem>
        )}
      </Draggable>
    );
  }

  const QuoteList = React.memo(function QuoteList({ slides }) {
    return slides.map((slide, index) => (
      <Quote slide={slide} index={index} key={slide.id} />
    ));
  });
  /*const [state, setState] = useState({
    time: initial.time,
    slides: initial.slides
  });

  useEffect(() => {
    console.log("state", state);
  }, [state]);*/

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const slides = reorder(
      state.slides,
      result.source.index,
      result.destination.index
    );

    console.log(" slides ", slides);

    //setState({ ...state, slides: slides });
    updateState({ ...state, slides: slides });
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <QuoteList slides={state.slides} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
