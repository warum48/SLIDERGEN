import React, { useRef, useState, useEffect } from "react";

const Html = ({ tag = "div", children, className = "htmlcontainer" }) => {
  const CustomTag = `${tag}`;

  return (
    <CustomTag
      className={className}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
};

export default Html;
