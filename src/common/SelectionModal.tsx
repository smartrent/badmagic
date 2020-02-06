import React, { useState, useReducer, useEffect } from "react";

import PrintPage from "./PrintPage";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { get } from "lodash-es";
import helpers from "../lib/helpers";

interface ListSelectionReducerEvent {
  shiftActive?: boolean;
  selectAll?: boolean;
  deselectAll?: boolean;
  index?: number;
}

interface ListSelectionReducerState {
  items: Array<any>;
  selectedItems: number[];
  lastSelectedIndex?: number;
}

function listSelectionReducer(
  state: ListSelectionReducerState,
  event: ListSelectionReducerEvent
) {
  if (event.selectAll) {
    return {
      ...state,
      selectedItems: new Array(state.items.length)
        .fill(0)
        .map((_item, index) => index),
    };
  }

  if (event.deselectAll) {
    return {
      ...state,
      selectedItems: [],
    };
  }

  if (event.index === undefined && event.shiftActive === undefined) {
    throw new Error("Event must contain: index, shiftActive");
  }

  const isChecked = state.selectedItems.includes(event.index);

  let selectedItems = [...state.selectedItems];

  switch (event.shiftActive) {
    case true:
      if (state.lastSelectedIndex !== undefined) {
        if (state.lastSelectedIndex < event.index) {
          if (isChecked) {
            selectedItems = selectedItems.filter(
              (item) => item < state.lastSelectedIndex || item > event.index
            );
          } else {
            selectedItems = [
              ...new Set([
                ...selectedItems,
                ...new Array(event.index - state.lastSelectedIndex + 1)
                  .fill(state.lastSelectedIndex)
                  .map((item, index) => item + index),
              ]),
            ];
          }
        } else {
          if (isChecked) {
            selectedItems = selectedItems.filter(
              (item) => item > state.lastSelectedIndex || item < event.index
            );
          } else {
            selectedItems = [
              ...new Set([
                ...selectedItems,
                ...new Array(state.lastSelectedIndex + 1 - event.index)
                  .fill(event.index)
                  .map((item, index) => item + index),
              ]),
            ];
          }
        }
      } else {
        if (isChecked) {
          selectedItems = selectedItems.filter((item) => item !== event.index);
        } else {
          selectedItems.push(event.index);
        }
      }
      break;
    default:
      if (isChecked) {
        selectedItems = selectedItems.filter((item) => item !== event.index);
      } else {
        selectedItems.push(Number(event.index));
      }
      break;
  }
  return { ...state, lastSelectedIndex: event.index, selectedItems };
}

const SelectionModal = ({ darkMode, setModalShowing, workspaceRoutes }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [{ selectedItems }, dispatch] = useReducer(listSelectionReducer, {
    items: workspaceRoutes.map((_item, index) => index),
    selectedItems: [],
    lastSelectedIndex: undefined,
  });

  useEffect(() => {
    addEventListener("keydown", (event) => {
      if (event.key === "Escape") setModalShowing(false);
    });
    return function() {
      removeEventListener("keydown", (event) => {
        if (event.key === "Escape") setModalShowing(false);
      });
    };
  }, []);

  const renderList = () => {
    return (
      workspaceRoutes &&
      workspaceRoutes.map((item, index) => {
        const isSelected = selectedItems.includes(index);
        const method = item.method ? item.method : "GET";

        return (
          <div
            onClick={(event) => {
              dispatch({
                shiftActive: event.shiftKey,
                index,
              });
            }}
            className={`items-center flex border rounded overflow-x-hidden py-2 px-4 my-2 ${
              darkMode
                ? isSelected
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-900 border-gray-700"
                : isSelected
                ? "bg-gray-300 border-gray-400"
                : "bg-white border-gray-300"
            }`}
            style={{
              cursor: "pointer",
            }}
            key={index}
          >
            <span style={{ flex: 0, paddingRight: 18 }}>
              <svg
                viewBox="0 0 24 24"
                className={`fill-current ${
                  isSelected ? "text-orange-500" : ""
                }`}
                height="18"
                width="18"
              >
                {isSelected ? (
                  <path d="M10.041 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591zm-5.041-15c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z" />
                ) : (
                  <path d="M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z" />
                )}
              </svg>
            </span>

            <div style={{ display: "flex", flex: 7 }}>
              <div
                className={`w-16 flex flex-shrink-0 items-center justify-center text-xs text-gray-700 font-semibold p-1 mr-2 border rounded ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
                style={{
                  backgroundColor: get(
                    helpers.colors.routes,
                    method.toLowerCase()
                  ),
                }}
              >
                {method.toUpperCase()}
              </div>
              <p>{item.path}</p>
            </div>
            <div style={{ flex: 4, textAlign: "right" }}>{item.name}</div>
          </div>
        );
      })
    );
  };

  return (
    <div
      className={
        darkMode
          ? "absolute flex flex-col bg-gray-800 border border-gray-700 rounded p-2 z-10 text-gray-300"
          : "absolute flex flex-col bg-gray-100 border border-gray-300 rounded p-2 z-10 text-gray-700"
      }
      style={{
        left: 16,
        top: 16,
        bottom: 16,
        right: 16,
        position: "fixed",
        padding: 24,
      }}
    >
      <div
        style={{ cursor: "pointer", position: "absolute", top: 15, right: 15 }}
        onClick={() => setModalShowing(false)}
      >
        <svg
          clipRule="evenodd"
          fillRule="evenodd"
          viewBox="0 0 24 24"
          className={`fill-current ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
          height="24"
          width="24"
        >
          <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z" />
        </svg>
      </div>
      <div className="px-4 mb-2" style={{ height: 80 }}>
        <h1 className="text-xl">Choose Routes to Export</h1>
        <div className="flex items-stretch py-4">
          <div
            className="items-center pr-4 mt-2"
            onClick={() => {
              setSelectAll(!selectAll);
              dispatch(selectAll ? { deselectAll: true } : { selectAll: true });
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className={`fill-current ${selectAll ? "text-orange-500" : ""}`}
              height="18"
              width="18"
            >
              {selectAll ? (
                <path d="M10.041 17l-4.5-4.319 1.395-1.435 3.08 2.937 7.021-7.183 1.422 1.409-8.418 8.591zm-5.041-15c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z" />
              ) : (
                <path d="M5 2c-1.654 0-3 1.346-3 3v14c0 1.654 1.346 3 3 3h14c1.654 0 3-1.346 3-3v-14c0-1.654-1.346-3-3-3h-14zm19 3v14c0 2.761-2.238 5-5 5h-14c-2.762 0-5-2.239-5-5v-14c0-2.761 2.238-5 5-5h14c2.762 0 5 2.239 5 5z" />
              )}
            </svg>
          </div>
          {selectedItems.length > 0 && (
            <PDFDownloadLink
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
              document={
                <PrintPage
                  routes={workspaceRoutes.filter((route, index) =>
                    selectedItems.includes(index)
                  )}
                />
              }
              fileName="badmagic_export.pdf"

              // onClick={() => {
              //   setModalShowing(false);
              //   setPrintPageShowing(true);
              // }}
            >
              {({ blob, url, loading, error }) =>
                loading ? <p>Loading...</p> : <p>Export Selection</p>
              }
            </PDFDownloadLink>
          )}
        </div>
      </div>
      <div className="select-none" style={{ flex: 1, overflow: "scroll" }}>
        {workspaceRoutes && renderList()}
      </div>
    </div>
  );
};

export default SelectionModal;
