import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { parse } from "querystring";

export const useQueryString = () => {
  const location = useLocation();

  const qs = useMemo(
    () => parse(location.search.replace("?", "")),
    [location.search]
  );

  if (qs.path) {
    qs.path = decodeURIComponent(qs.path as string);
  }

  return qs;
};
