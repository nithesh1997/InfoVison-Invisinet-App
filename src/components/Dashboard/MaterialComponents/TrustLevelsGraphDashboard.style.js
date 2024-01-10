import Box from "@material-ui/core/Box";
import styled from "styled-components";

const Styled = {
  SkeletonHolder: styled(Box)`
    padding: 1em;
  `,

  Container: styled(Box)`
    display: flex;
    flex: 0 0 auto;
    width: 100%;
    min-height: 20em;
    padding: 0.8rem 2rem;
  `,
};

export default Styled;
