import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { DROPDOWN } from "../styled-materials/variants/DROPDOWN";

export const Dropdown = (props) => {
  const value = props.dirtyValue;

  const [newItems, setNewItems] = useState([]);

  const [options, setOptions] = useState([]);
  const [orgOptions, setOrgOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [lastIndex, setLastIndex] = useState(0);
  const [isChanged, setIsChanged] = useState(false);

  const [singleValueState, setSingleValueState] = useState("");
  const [multipleValueState, setMultipleValueState] = useState("");
  const [multipleValuesState, setMultipleValuesState] = useState([]);

  // # Set Options
  useEffect(() => {
    const stringOptions = props.options
      .map((option) => `${option ?? ""}`)
      .filter((opt) => !!opt);

    if (
      props.type === "dropdown-free-single" ||
      props.type === "dropdown-free-multiple"
    ) {
      setOptions(stringOptions.length ? stringOptions : ["Type to add ..."]);
      setOrgOptions(stringOptions.length ? stringOptions : ["Type to add ..."]);
    } else {
      setOptions(stringOptions);
      setOrgOptions(stringOptions);
    }
    setLastIndex(stringOptions.length || 1);
  }, []);

  // # Set Single Value State
  useEffect(() => {
    setSingleValueState(`${value || ""}`);
  }, [value]);

  // # Set Multiple Values State
  useEffect(() => {
    setMultipleValueState(`${value || ""}`);
  }, [value]);

  // # Set Multiple Values State
  useEffect(() => {
    const values = multipleValueState.split(", ").join(", ").split(", ") || [];

    setMultipleValuesState(
      values[0] === [""][0] || values[0] === "Type to add ..." ? [] : values,
    );
  }, [multipleValueState]);

  return props.type === "dropdown-single" ? (
    <DROPDOWN
      id={props.id}
      _type={props.type}
      name={props.name}
      className={props.className}
      disabled={props.disabled}
      options={options}
      value={singleValueState}
      style={{ width: "100%" }}
      getOptionLabel={(option) => option}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            inputRef={props.inputRef}
            label={props.label}
            variant={props.variant}
          />
        );
      }}
      onMouseOver={(event) => {
        const newEvent = { ...event };
        props.onMouseOver(newEvent, props.setStore, props.inputRef);
      }}
      onMouseLeave={(event) => {
        const newEvent = { ...event };
        props.onMouseLeave(newEvent, props.setStore, props.inputRef);
      }}
      onFocus={(event) => {
        const newEvent = { ...event };
        props.onFocus(newEvent, props.setStore, props.inputRef);
      }}
      onBlur={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: singleValueState },
        };
        props.onBlur(newEvent, props.setStore, props.inputRef);
      }}
      onChange={(event, option) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: option || "" },
        };
        props.onChange(newEvent, props.setStore, props.inputRef);
      }}
      onKeyPress={(event) => props.onKeyPress(event)}
      /* Color */
      labelColor={props.labelColor}
      borderColor={props.borderColor}
      backgroundColor={props.backgroundColor}
      /* Color on Hover */
      labelColorOnHover={props.labelColorOnHover}
      borderColorOnHover={props.borderColorOnHover}
      backgroundColorOnHover={props.backgroundColorOnHover}
      /* Color on Focus */
      labelColorOnFocus={props.labelColorOnFocus}
      borderColorOnFocus={props.borderColorOnFocus}
      backgroundColorOnFocus={props.backgroundColorOnFocus}
      /* can override everything above and able to add new props */
      // {...override}
    />
  ) : props.type === "dropdown-multiple" ? (
    <DROPDOWN
      /* Base Attributes */
      id={props.id}
      _type={props.type}
      name={props.name}
      className={props.className}
      disabled={props.disabled}
      options={options}
      value={multipleValuesState}
      style={{ width: "100%" }}
      limitTags={2}
      multiple
      filterSelectedOptions
      disableCloseOnSelect={true}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={props.inputRef}
          variant={props.variant}
          label={props.label}
        />
      )}
      /* Handlers */
      onMouseOver={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onMouseOver(newEvent, props.setStore, props.inputRef);
      }}
      onMouseLeave={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onMouseLeave(newEvent, props.setStore, props.inputRef);
      }}
      onFocus={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onFocus(newEvent, props.setStore, props.inputRef);
      }}
      onBlur={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onBlur(newEvent, props.setStore, props.inputRef);
      }}
      onChange={(event, options) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: (options || []).join(", ") },
        };

        props.inputRef.current.focus();
        props.onChange(newEvent, props.setStore, props.inputRef);
      }}
      onKeyPress={(event) => props.onKeyPress(event)}
      /* Color */
      labelColor={props.labelColor}
      borderColor={props.borderColor}
      backgroundColor={props.backgroundColor}
      /* Color on Hover */
      labelColorOnHover={props.labelColorOnHover}
      borderColorOnHover={props.borderColorOnHover}
      backgroundColorOnHover={props.backgroundColorOnHover}
      /* Color on Focus */
      labelColorOnFocus={props.labelColorOnFocus}
      borderColorOnFocus={props.borderColorOnFocus}
      backgroundColorOnFocus={props.backgroundColorOnFocus}
      /* can override everything above and able to add new props */
      // {...override}
    />
  ) : props.type === "dropdown-free-single" ? (
    <DROPDOWN
      id={props.id}
      _type={props.type}
      name={props.name}
      className={props.className}
      disabled={props.disabled}
      options={options}
      getOptionDisabled={(option) => option === "Type to add ..."}
      value={singleValueState}
      style={{ width: "100%" }}
      getOptionLabel={(option) => option}
      freeSolo
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            inputRef={props.inputRef}
            label={props.label}
            variant={props.variant}
            onChange={(event) => {
              setOptions((options) => {
                let input = event.target.value.trim();
                let lastIndex = options.length - 1;
                if (options.indexOf(input) === -1 && input !== "") {
                  if (lastIndex > -1) {
                    if (options[lastIndex].includes('Add "')) {
                      options[lastIndex] = `Add "${input}"`;
                    } else {
                      options.push(`Add "${input}"`);
                    }
                  } else {
                    options.push(`Add "${input}"`);
                  }
                } else {
                  if (lastIndex > -1) {
                    if (options[lastIndex].includes('Add "')) {
                      options.splice(lastIndex, 1);
                    }
                  }
                }
                options = options.filter(
                  (val) =>
                    val.trim() !== "" && val.trim() !== "Type to add ...",
                );
                if (options.length === 0) {
                  options.push("Type to add ...");
                }

                return options;
              });
            }}
            onBlur={(event) => {
              const newEvent = {
                ...event,
                target: { ...event.target, value: singleValueState },
              };

              const validation = props.onValidation(
                newEvent,
                {},
                props.setStore,
                {
                  current: { value: singleValueState },
                },
              );

              if (!validation.isValid && singleValueState) {
                setOptions((oldState) => {
                  const newState = [...oldState].filter(
                    (option) => option !== singleValueState,
                  );

                  return newState;
                });
              }

              props.onBlur(newEvent, props.setStore, props.inputRef);
            }}
          />
        );
      }}
      onMouseOver={(event) => {
        const newEvent = { ...event };
        props.onMouseOver(newEvent, props.setStore, props.inputRef);
      }}
      onMouseLeave={(event) => {
        const newEvent = { ...event };
        props.onMouseLeave(newEvent, props.setStore, props.inputRef);
      }}
      onFocus={(event) => {
        const newEvent = { ...event };
        props.onFocus(newEvent, props.setStore, props.inputRef);
      }}
      onBlur={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: singleValueState },
        };
        props.onBlur(newEvent, props.setStore, props.inputRef);
      }}
      onChange={(event, selectedOption) => {
        // setIsChanged(true);

        if (
          selectedOption === null ||
          selectedOption === undefined ||
          typeof selectedOption !== "string"
        ) {
          selectedOption = "";
        }

        if (selectedOption.includes('Add "')) {
          selectedOption = selectedOption.match(/Add "(.+)"/)[1];
        }
        setSingleValueState(selectedOption);

        setOptions((options) => {
          let lastIndexForOptionsList = options.length - 1;
          if (lastIndexForOptionsList > -1) {
            if (options[lastIndexForOptionsList].includes('Add "')) {
              options.splice(lastIndexForOptionsList, 1);
            }
          }
          if (options.indexOf(selectedOption) === -1) {
            options.push(selectedOption);
          }

          options = options.filter(
            (val) => val.trim() !== "" && val.trim() !== "Type to add ...",
          );

          if (options.length === 0) {
            options.push("Type to add ...");
          }
          return options;
        });

        const newEvent = {
          ...event,
          target: { ...event.target, value: selectedOption || "" },
        };

        props.onChange(newEvent, props.setStore, props.inputRef);
      }}
      onKeyPress={(event) => props.onKeyPress(event)}
      /* Color */
      labelColor={props.labelColor}
      borderColor={props.borderColor}
      backgroundColor={props.backgroundColor}
      /* Color on Hover */
      labelColorOnHover={props.labelColorOnHover}
      borderColorOnHover={props.borderColorOnHover}
      backgroundColorOnHover={props.backgroundColorOnHover}
      /* Color on Focus */
      labelColorOnFocus={props.labelColorOnFocus}
      borderColorOnFocus={props.borderColorOnFocus}
      backgroundColorOnFocus={props.backgroundColorOnFocus}
      /* can override everything above and able to add new props */
      // {...override}
    />
  ) : props.type === "dropdown-free-multiple" ? (
    <DROPDOWN
      /* Base Attributes */
      id={props.id}
      _type={props.type}
      name={props.name}
      className={props.className}
      disabled={props.disabled}
      options={options}
      value={multipleValuesState}
      style={{ width: "100%" }}
      limitTags={2}
      freeSolo
      multiple
      filterSelectedOptions
      disableCloseOnSelect={true}
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={props.inputRef}
          variant={props.variant}
          label={props.label}
          onChange={(event) => {
            setOptions((options) => {
              let input = event.target.value.trim();
              let lastIndex = options.length - 1;

              if (options.indexOf(input) === -1 && input !== "") {
                if (lastIndex > -1) {
                  if (options[lastIndex].includes('Add "')) {
                    options[lastIndex] = `Add "${input}"`;
                  } else {
                    options.push(`Add "${input}"`);
                  }
                } else {
                  options.push(`Add "${input}"`);
                }
              } else {
                if (lastIndex > -1) {
                  if (options[lastIndex].includes('Add "')) {
                    options.splice(lastIndex, 1);
                  }
                }
              }
              return options;
            });
          }}
        />
      )}
      /* Handlers */
      onKeyPress={(event) => props.onKeyPress(event)}
      onMouseOver={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onMouseOver(newEvent, props.setStore, props.inputRef);
      }}
      onMouseLeave={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onMouseLeave(newEvent, props.setStore, props.inputRef);
      }}
      onFocus={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onFocus(newEvent, props.setStore, props.inputRef);
      }}
      onBlur={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onBlur(newEvent, props.setStore, props.inputRef);
      }}
      onChange={(event, selectedOptions) => {
        let lastIndex = selectedOptions.length - 1;

        if (lastIndex > -1) {
          if (selectedOptions[lastIndex].includes('Add "')) {
            selectedOptions[lastIndex] =
              selectedOptions[lastIndex].match(/Add "(.+)"/)[1];
          }
        }

        setOptions((options) => {
          let lastIndexForOptionsList = options.length - 1;

          if (lastIndexForOptionsList > -1) {
            if (options[lastIndexForOptionsList].includes('Add "')) {
              options.splice(lastIndexForOptionsList, 1);
            }
          }

          if (lastIndex > -1) {
            if (options.indexOf(selectedOptions[lastIndex]) === -1) {
              options.push(selectedOptions[lastIndex]);
            }
          }

          return options;
        });

        const newEvent = {
          ...event,
          target: {
            ...event.target,
            value: (selectedOptions || []).join(", "),
          },
        };

        props.inputRef.current.focus();
        props.onChange(newEvent, props.setStore, props.inputRef);
      }}
      /* Color */
      labelColor={props.labelColor}
      borderColor={props.borderColor}
      backgroundColor={props.backgroundColor}
      /* Color on Hover */
      labelColorOnHover={props.labelColorOnHover}
      borderColorOnHover={props.borderColorOnHover}
      backgroundColorOnHover={props.backgroundColorOnHover}
      /* Color on Focus */
      labelColorOnFocus={props.labelColorOnFocus}
      borderColorOnFocus={props.borderColorOnFocus}
      backgroundColorOnFocus={props.backgroundColorOnFocus}
      /* can override everything above and able to add new props */
      // {...override}
    />
  ) : (
    <DROPDOWN
      /* Base Attributes */
      id={props.id}
      _type={props.type}
      name={props.name}
      className={props.className}
      disabled={props.disabled}
      options={options}
      value={multipleValuesState}
      style={{ width: "100%" }}
      limitTags={2}
      multiple
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          inputRef={props.inputRef}
          variant={props.variant}
          label={props.label}
        />
      )}
      /* Handlers */
      onMouseOver={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onMouseOver(newEvent, props.setStore, props.inputRef);
      }}
      onMouseLeave={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onMouseLeave(newEvent, props.setStore, props.inputRef);
      }}
      onFocus={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onFocus(newEvent, props.setStore, props.inputRef);
      }}
      onBlur={(event) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: multipleValueState },
        };

        props.onBlur(newEvent, props.setStore, props.inputRef);
      }}
      onChange={(event, options) => {
        const newEvent = {
          ...event,
          target: { ...event.target, value: (options || []).join(", ") },
        };

        props.onChange(newEvent, props.setStore, props.inputRef);
      }}
      onKeyPress={(event) => props.onKeyPress(event)}
      /* Color */
      labelColor={props.labelColor}
      borderColor={props.borderColor}
      backgroundColor={props.backgroundColor}
      /* Color on Hover */
      labelColorOnHover={props.labelColorOnHover}
      borderColorOnHover={props.borderColorOnHover}
      backgroundColorOnHover={props.backgroundColorOnHover}
      /* Color on Focus */
      labelColorOnFocus={props.labelColorOnFocus}
      borderColorOnFocus={props.borderColorOnFocus}
      backgroundColorOnFocus={props.backgroundColorOnFocus}
      /* can override everything above and able to add new props */
      // {...override}
    />
  );
};
