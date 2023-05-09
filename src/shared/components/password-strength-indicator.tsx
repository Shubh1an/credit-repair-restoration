import React from "react";
import "./../../assets/styles/password-strength-meter.scss";
export const PasswordStrengthIndicator = (props: {
  options: any;
  value: string | undefined;
}) => {
  const createPasswordLabel = (result: any) => {
    switch (result.id) {
      case 0:
        return "Too Weak";
      case 1:
        return "Weak";
      case 2:
        return "Medium";
      case 3:
        return "Strong";
      default:
        return "Weak";
    }
  };
  return (
    <>
      <div className="password-strength-meter">
        <progress
          className={`password-strength-meter-progress strength-${createPasswordLabel(
            props?.options
          )}`}
          value={props?.options.id}
          max="3"
        />
        {props?.value && (
          <>
            <label
              className={`password-strength-meter-label f-10 ${createPasswordLabel(
                props?.options
              )}`}
            >
              {createPasswordLabel(props?.options)}
            </label>
          </>
        )}
      </div>
    </>
  );
};
