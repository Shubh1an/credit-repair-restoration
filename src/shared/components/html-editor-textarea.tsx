import React, { useEffect, useState } from "react";
import { CommonUtils } from "../../utils/common-utils";
import { ButtonComponent } from "./button";
import toastr from "toastr";
export const HTMlTextAreaEditor = (props: {
  html?: string;
  onSave: any;
  disableEdit?: boolean;
}) => {
  const [content, setContent] = useState<any>(props?.html);

  useEffect(() => {
    setContent(format(props?.html || ""));
  }, [props?.html]);

  const onChange = (e: any) => {
    if (props?.disableEdit) {
      return toastr.error("Not Editable");
    }
    setContent(e.target.value);
  };
  const format = (html: string) => {
    return CommonUtils.FormatHTML(html);
  };
  const onFormat = () => {
    const formattedHTML = format(content || "");
    setContent(formattedHTML);
  };
  return (
    <div className="textarea-editor">
      <div className="d-flex justify-content-between mb-2">
        <ButtonComponent
          className="btn btn-link"
          text="Beautify HTML"
          onClick={onFormat}
        >
          <i className="fa fa-refresh mr-2"></i>
        </ButtonComponent>
        <ButtonComponent
          className="btn btn-primary ml-3"
          text="Save HTML"
          onClick={(e: any) => {
            props?.onSave(content, e);
          }}
        >
          <i className="fa fa-floppy-o mr-2"></i>
        </ButtonComponent>
      </div>
      <textarea
        className="w-100"
        placeholder="html content here..."
        value={content}
        onChange={onChange}
      ></textarea>
    </div>
  );
};
