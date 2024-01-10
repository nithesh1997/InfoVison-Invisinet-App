import styled from "styled-components";

export const Form = styled.form`
  position: relative;
  background: transparent;
  width: 100%;
  padding: ${(props) =>
    props.gridConfig.editMode === "popup" ? `0em 1em` : `1em 0em 0.5em 0em`};

  & .MuiFormLabel-root {
    max-width: 100%;
    /* font-family: Montserrat; */
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.8rem;
    margin-top: -0.6em;
    font-weight: 500;
    line-height: 1.5em;
  }

  & .MuiFormLabel-root.MuiInputLabel-shrink {
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: -0.1em;
  }
`;
