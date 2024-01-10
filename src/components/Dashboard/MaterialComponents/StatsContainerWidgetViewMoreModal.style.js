import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components";

const Styled = {
  SelectButtonComponent: styled.button`
    cursor: pointer;
    padding-right: 1rem;
    padding-left: 1rem;
    margin-right: 1rem;
    margin-left: 1rem;
    float: right;
    background-color: rgb(0, 148, 253);
    color: transparent;
    font-size: 0.7rem;
    border-radius: 0.25rem;
    line-height: 1;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    padding: 0.375rem 0.75rem;
    border: 1px solid rgb(70, 153, 179);
    opacity: 0;
    &.hide {
      font-size: 0.7rem;
      line-height: 1;
      height: 30px;
      width: 80px;
    }
  `,

  TdComponent: styled.td`
    //color: #fff;
    border-bottom: 1px solid #dee2e6;
    padding: 1em;
    line-height: 1.5;
    font-size: 0.75rem;

    &:nth-child(odd) {
      background: #f1fdfc;
    }
  `,
  TrComponent: styled.tr`
    &:hover .selecthide {
      opacity: 1;
      color: #fff;
      background-color: #eff2f7;
      font-size: 0.75rem;
      &:hover {
        cursor: pointer;
        opacity: 1;
        color: #fff;
        background-color: #eff2f7;
        font-size: 0.75rem;
      }

      &input:checked[type="checkbox"] {
        background-image: url(../images/tickicon.png);
        background-size: 10px auto;
        border: 1px solid rgb(143 220 106);
      }
    }

    & .selected {
      opacity: 1;
      color: #fff;
      background-color: #eff2f7;
      font-size: 0.75rem;
      cursor: default;
      pointer-events: none;
    }
    &:nth-child(odd) {
      background-color: #f9fafb;
    }
  `,
  CloseIconComponent: styled(CloseIcon)`
    padding: 0.25em;
    margin: -0.5rem -0.5rem -0.5rem auto;
    color: rgb(0, 0, 0);
    cursor: pointer;
    box-sizing: content-box;
    width: 1em;
    height: 1em;
    border: 0px;
    border-radius: 0.25rem;
    opacity: 0.5;
    color: black;
    &:hover {
      background: #d6eeff;
      border-radius: 50%;
    }
  `,

  ModalHeader: styled.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid rgba(2, 147, 254, 1);
    border-top-left-radius: calc(0.3rem - 1px);
    border-top-right-radius: calc(0.3rem - 1px);
  `,

  SearchDivComponent: styled.div`
    border: 1px solid #dee2e6;
    border-radius: 10px;
    align-items: center;
    display: flex;
    float: left;
    &.hide {
      //height: 35px;
      opacity: 0.5;
    }
  `,
  ScrollContainer: styled.div`
    max-height: 200px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgb(179, 177, 177, 0.1);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgb(136, 136, 136);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: rgb(100, 100, 100);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:active {
      background: rgb(68, 68, 68);
      border-radius: 10px;
    }
  `,
  ThComponent: styled.th`
    //color: #0094fd;
    border-bottom: 1px solid #dee2e6;
    text-align: left;
    padding: 1em;
    line-height: 1.5;
    font-size: 0.9rem;

    background: #fff;
    position: sticky;
    top: 0;
  `,

  SearchInputComponent: styled.input`
    border: 0;
    margin-bottom: 0px;
    background-color: transparent;
    width: 100;
    width: 100%;
    outline: none;
    box-shadow: none;

    font-size: 1rem;
    font-weight: 400;
    //color: white;
    padding: 10px 10px 9px 20px;
    //color: #fff;
    outline: none !important;
    box-shadow: none !important;
    font-size: 11px;
    line-height: 24px;
    padding: 4px 15px;
  `,

  IComponent: styled(SearchIcon)`
    color: #0d6efd;
    font-size: 1.25rem;
    margin-right: 1rem;
    margin-left: 1rem;
    cursor: pointer;
  `,
  DivComponent: styled.div`
    //padding-top: 1rem;
    padding-bottom: 1rem;
    overflow: auto;
    //padding-left: 20px;
    &.hide {
      //padding-left: 12px;
      opacity: 0.5;
    }
  `,
  TrHead: styled.tr`
    &:hover {
      background-color: transparent;
    }
  `,
};

export default Styled;
