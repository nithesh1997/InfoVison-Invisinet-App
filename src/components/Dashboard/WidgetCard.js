import { Link } from "@material-ui/core";
import { useContext } from "react";
import { InfoCircle } from "react-bootstrap-icons";
import Config from "../../Config";
import Styled from "./MaterialComponents/WidgetCard.style";
import { dashboard } from "../../utils/GeneralComponentNames";
import Tooltip from "../../utils/Tooltip/Tooltip";
import { useSelector } from "react-redux";
import Widegetdropdown from "./Widgetdropdown";

const WidgetCard = (props) => {
  const AppConfig = useContext(Config);
  const AppTheme = AppConfig.themes[AppConfig.theme];

  const { chassis_model } = useSelector(($) => $.gatewayConfig);

  return (
    <Styled.WidgetBox
      bg={AppTheme.__default.dashboardWidgetCard.bg}
      boxShadow={AppTheme.__default.dashboardWidgetCard.boxShadow}
    >
      <Styled.WidgetHeader>
        <Styled.WidgetHeading
          component={"h2"}
          color={AppTheme.__default.dashboardWidgetHeading.color}
        >
          <Link style={{ color: "black" }} underline="none" href={props.url}>
            {props.title}
          </Link>
        </Styled.WidgetHeading>

        <Styled.WidgetToolBar>
          <Widegetdropdown
            chassis_model={chassis_model}
            toggleHandler={props.toggleHandler}
            toggleName={props.toggleName}
            toggleShow={props.toggleShow}
            MenuItemOne={"Trusted"}
            MenuItemTwo={"Untrusted"}
            title={props._title}
            toggleHandlerServices={props.toggleHandlerServices}
            serviceToggle={props.serviceToggle}
            setServiceToggle={props.setServiceToggle}
          />

          <Tooltip
            id={`${dashboard}-widget-tooltip`}
            label={props.info}
            placement="bottom"
          >
            <Styled.IconButton
              hoverBg={AppTheme.__default.dashboardWidgetIcon.hoverBg}
            >
              <InfoCircle size={"0.65em"} />
            </Styled.IconButton>
          </Tooltip>
        </Styled.WidgetToolBar>
      </Styled.WidgetHeader>
      {props.content}
    </Styled.WidgetBox>
  );
};

export default WidgetCard;
