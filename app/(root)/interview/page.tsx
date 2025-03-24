"use client";
import React from "react";

import Agent from "@/components/Agent";

const Interview = () => {
  return (
    <>
      <h3>Interview Generation</h3>
      <Agent userName={"Filip"} userId={"user1"} type={"generate"} />
    </>
  );
};
export default Interview;
