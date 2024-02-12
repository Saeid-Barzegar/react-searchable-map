import React, { useRef, useState } from "react";
import { Button, Modal } from "antd";
import Draggable from "react-draggable";

const withModal = (Component) => {
  return function WithModal() {
    const draggableRef = useRef(null);
    const [state, setState] = useState({
      showModal: false,
      modalData: {
        title: "",
        content: null,
      },
      bounds: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
      },
    });

    const additionalProps = {
      showModal: (value) =>
        setState((state) => ({
          ...state,
          showModal: value,
        })),
      setModalData: (data) => {
        setState((state) => ({
          ...state,
          modalData: {
            title: data.title,
            content: data.content,
          },
        }));
      },
    };

    const onDragModal = (_event, uiData) => {
      const { clientWidth, clientHeight } = window.document.documentElement;
      const targetRect = draggableRef.current?.getBoundingClientRect();
      if (!targetRect) {
        return;
      }
      setState((state) => ({
        ...state,
        bounds: {
          left: -targetRect.left + uiData.x,
          right: clientWidth - (targetRect.right - uiData.x),
          top: -targetRect.top + uiData.y,
          bottom: clientHeight - (targetRect.bottom - uiData.y),
        },
      }));
    };

    const closeModal = () => {
      setState((state) => ({
        ...state,
        showModal: false,
      }));
    };

    return (
      <>
        <Component {...additionalProps} />
        <Modal
          title={state.modalData.title}
          open={state.showModal}
          onCancel={closeModal}
          mask={false}
          modalRender={(modal) => (
            <Draggable
              nodeRef={draggableRef}
              bounds={state.bounds}
              onStart={onDragModal}
            >
              <div ref={draggableRef}>{modal}</div>
            </Draggable>
          )}
          footer={
            <Button
              style={{ padding: "0 30px" }}
              size="middle"
              onClick={closeModal}
            >
              Ok
            </Button>
          }
        >
          {state.modalData.content}
        </Modal>
      </>
    );
  };
};

export default withModal;
