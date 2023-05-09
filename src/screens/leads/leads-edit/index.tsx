import React from "react";

import { withAuthorize } from "../../../shared/hoc/authorize";
import { EnumScreens } from "../../../models/enums";
import { LeadsFormComponent } from "../leads-form";

const LeadsEditComponent = (props: any) => {
  console.log("from-edit-leads", props);
  return (
    <div className="edit-customer">
      <LeadsFormComponent {...props} />
    </div>
  );
};
export default withAuthorize(LeadsEditComponent, EnumScreens.ViewLeads);
