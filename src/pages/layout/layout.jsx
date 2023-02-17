import React, { useEffect, useContext } from "react";
import { getLayout } from "../../api/layouts.api";
import { LayoutContext } from "../../providers/layout/layout.provider";
import { useParams } from "react-router-dom";
import { LayerTabs } from "../../components/layer-tabs/layer-tabs.component";

export const Layout = () => {
  const { setLayout, setLayoutOriginal } = useContext(LayoutContext);
  const params = useParams();
  const layoutId = params.id * 1;

  useEffect(() => {
    const apiCallGetLayout = async () => {
      try {
        const response = await getLayout(layoutId);
        setLayout(response.data);
        setLayoutOriginal(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    apiCallGetLayout();
  }, [layoutId, params, setLayout, setLayoutOriginal]);

  return (
    <div className="page">
      <LayerTabs />
    </div>
  );
};
