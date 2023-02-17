import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "../pages/layout/layout";
import { Layouts } from "../pages/layouts/layouts";
import { Page2 } from "../pages/page-2/page-2";

export const AppRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Layouts />} />
      <Route path="/layout/:id" element={<Layout />} />
      <Route path="/2" element={<Page2 />} />
    </Routes>
  );
};
