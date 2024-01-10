// import { Box } from "@material-ui/core";
// import styled from "styled-components";
// import StatsContainerWidgetViewMoreModal from "../StatsContainerWidgetViewMoreModal";
// export const DialogBox = ({ model, setModel }) => {
//   const closeModel = (event) => {
//     if (event.target.id === "backdrop") {
//       setModel((prev) => ({
//         ...prev,
//         dialog: false,
//       }));
//     }
//   };
//   const closeModel2 = () => {
//     setModel((prev) => ({
//       ...prev,
//       dialog: false,
//     }));
//   };

//   return (
//     <Backdrop id="backdrop" dropOff={model.dialog} onClick={closeModel}>
//       <StatsContainerWidgetViewMoreModal
//         id="backdrop"
//         closeModel={closeModel2}
//       />
//     </Backdrop>
//   );
// };

// const Backdrop = styled(Box)`
//   position: absolute;
//   width: 100vw;
//   height: 100vh;
//   z-index: 100;
//   display: ${(props) => (props.dropOff ? "grid" : "none")};
//   place-items: center;
//   background: rgba(0, 0, 0, 0.4);
// `;
