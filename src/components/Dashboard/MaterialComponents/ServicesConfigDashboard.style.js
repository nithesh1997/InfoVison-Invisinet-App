import Box from "@material-ui/core/Box";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import styled from "styled-components";

const Styled = {
  SkeletonHolder: styled(Box)`
    padding: 1em;
  `,

  List: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex: 0 0 auto;
    width: 100%;
    padding: 0em 1.5em 1.5em 0.5em;
  `,

  ListItem: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex: 0 0 auto;
    width: 100%;
    margin: 0.75em 0em;
  `,

  ListItemText: styled(Box)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex: 1 0 auto;
    padding: 0em 0.75em;

    font-weight: 400;
    font-size: 0.85em;
    line-height: 0.85em;
    text-align: left;
    color: #000;
  `,
  StyledCancel: styled(HighlightOffIcon)`
    color: #e5e5e5;
    fontsize: 10px;
  `,

  ScrollContainer: styled(Box)`
    //overflow-x: hidden;

    height: 100%;
    width: 100%;

    overflow-y: scroll;
    overflow-y: overlay;

    /* Firefox */
    scrollbar-color: rgba(119, 119, 119, 0.8) rgba(0, 73, 122, 0) !important;
    scrollbar-width: thin !important;
    /* Firefox */

    /* Chrome & Edge */
    &::-webkit-scrollbar {
      width: 0.5em;
      height: 0.5em;
      opacity: 1;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 73, 122, 0);
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-track:hover {
      background: rgba(0, 73, 122, 0);
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb {
      background: ${({ theme }) =>
        theme.isHovered
          ? "rgba(119, 119, 119, 0.8)"
          : "rgba(119, 119, 119, 0)"};
      border-radius: 0.35em;
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${({ theme }) =>
        theme.isHovered ? "rgba(119, 119, 119, 1)" : "rgba(119, 119, 119, 0)"};
    }
    /* Chrome & Edge */
  `,
};

export default Styled;
