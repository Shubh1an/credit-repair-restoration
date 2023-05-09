import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AuthService from "../../../../core/services/auth.service";
import { EnumScreens } from "../../../../models/enums";
import { ButtonComponent } from "../../../../shared/components/button";
import SelectSearch from "../../../../shared/components/SearchSelect";
import { withAuthorize } from "../../../../shared/hoc/authorize";
import { DashboardWidget } from "../../../dashboard/components/dashboard-widget";
import {
  getAllPostGridContacts,
  getAllPostGridTemplates,
  getPostGridLetter,
} from "../../../../actions/postgrid-templates.actions";
import { HiBadgeCheck } from "react-icons/hi";
import { RxLapTimer } from "react-icons/rx";
import { GiCancel } from "react-icons/gi";
import { GrCompliance } from "react-icons/gr";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardBody, CardHeader, CardText, CardTitle } from "reactstrap";

type Props = {};
const mapStateToProps = (state: any) => {
  return {
    contactList: state?.postGridModel?.contactList,
    letterTemplateList: state?.postGridModel?.templateList,
    currentAccessibleScreens: state?.sharedModel?.currentAccessibleScreens,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      getAllPostGridContacts,
      getAllPostGridTemplates,
      getPostGridLetter,
    },
    dispatch
  );
};

const CreateLetter = (props: any) => {
  const [formData, setFormData] = useState<any>({});
  const [letterDetails, setLetterDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [axiosSource] = useState(axios.CancelToken.source());
  const { id } = useParams() as any;
  useEffect(() => {
    getPostgridLetterbyId(id);
  }, [id]);
  const handleChange = (evt: any) => {
    console.log("value->>>>>", evt);
    if (evt?.name === "to" || evt?.name === "from") {
      let value = evt?.data?.value;
      // getAllSuggestion(value);

      let contactObj = {
        addressLine1: value?.addressLine1,
        addressLine2: value?.addressLine2,
        city: value?.city,
        companyName: value?.companyName,
        firstName: value?.firstName,
      };
      return setFormData({
        ...formData,
        [evt?.name]: contactObj,
      });
    } else {
      const value = evt?.name ? evt?.value : evt.target.value;
      setFormData({
        ...formData,
        [evt.target.name]: value,
      });
    }
  };

  const getPostgridLetterbyId = async (id: any) => {
    setLoading(true);
    const letter = await props.getPostGridLetter(id);
    if (letter) {
      setLetterDetails(letter);
    }
    setLoading(false);
  };
  const handleStauts = (status: any) => {
    switch (status) {
      case "ready":
        {
          return <GrCompliance fontSize={"50px"} />;
        }
        break;
      case "processed_for_delivery":
        return <RxLapTimer fontSize={"50px"} />;
        break;
      case "cancelled":
        return <GiCancel fontSize={"50px"} />;
        break;
      case "completed":
        return <HiBadgeCheck fontSize={"50px"} />;
        break;

      default:
        break;
    }
  };
  console.log("resp->>>", formData);
  return (
    <div className="tab-personal-details">
      <DashboardWidget
        hideHeader={props?.isPublic}
        rootClassName={props?.isPublic ? "nostyle-public" : ""}
        title={"Letter Details"}
        allowFullscreen={true}
        allowMaximize={true}
        allowMinimize={true}
        reload={false}
        isLoading={loading}
      >
        <form className="top-form">
          <div className="row justify-content-between">
            <div className="col d-flex justify-content-center for-public">
              <Card
                className="my-2"
                style={{
                  width: "18rem",
                }}
              >
                <CardHeader
                  style={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    backgroundColor: "#374767",
                    color: "white",
                  }}
                >
                  Sender
                </CardHeader>
                <CardBody>
                  <CardTitle className="font-weight-bold" tag="h5">
                    {letterDetails?.from?.firstName}
                  </CardTitle>
                  <CardText style={{ fontSize: "14px", marginBottom: "0.8px" }}>
                    {letterDetails?.from?.addressLine1}
                  </CardText>
                  <CardText style={{ fontSize: "14px", marginBottom: "0.8px" }}>
                    {letterDetails?.from?.city}
                  </CardText>
                  <CardText style={{ fontSize: "14px", marginBottom: "0.8px" }}>
                    {letterDetails?.from?.country}
                  </CardText>
                  <CardText style={{ fontSize: "14px", marginBottom: "0.8px" }}>
                    {letterDetails?.from?.companyName}
                  </CardText>
                </CardBody>
              </Card>
            </div>
            <div
              style={{
                height: "200px",
                aspectRatio: "1/1",
                display: "grid",
                placeContent: "center",
                placeItems: "center",
              }}
              className="border  my-2  "
            >
              <h5 style={{ fontWeight: 600, marginBottom: "5px" }}>STATUS</h5>

              {handleStauts(letterDetails?.status)}

              <p style={{ fontSize: "12px", marginTop: "5px" }}>
                {letterDetails?.status}
              </p>
            </div>

            <div className="col d-flex justify-content-center for-public">
              <Card
                className="my-2"
                style={{
                  width: "18rem",
                }}
              >
                <CardHeader
                  style={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    backgroundColor: "#374767",
                    color: "white",
                  }}
                >
                  Recipient
                </CardHeader>
                <CardBody>
                  <CardTitle className="font-weight-bold" tag="h5">
                    {letterDetails?.to?.firstName}
                  </CardTitle>
                  <CardText style={{ fontSize: "14px", marginBottom: "0.8px" }}>
                    {letterDetails?.to?.addressLine1}
                  </CardText>
                  <CardText style={{ fontSize: "14px", marginBottom: "0.8px" }}>
                    {letterDetails?.to?.city}
                  </CardText>
                  <CardText style={{ fontSize: "14px", marginBottom: "0.8px" }}>
                    {letterDetails?.to?.country}
                  </CardText>
                  <CardText style={{ fontSize: "14px", marginBottom: "0.8px" }}>
                    {letterDetails?.to?.companyName}
                  </CardText>
                </CardBody>
              </Card>
            </div>
          </div>
        </form>
      </DashboardWidget>
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthorize(CreateLetter, EnumScreens.ViewPostgridLetter));
