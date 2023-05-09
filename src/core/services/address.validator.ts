const getAddress = async (props: any) => {
  try {
    const data: any = fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${props.add}&type=address&components=country:us&key=AIzaSyAiVaogRmqgtfU-EqhkKVp6bzJBBasOt5U`
    )
      .then((response) => {
        return response.json();
      })
      .then((res: any) => {
        return res.predictions;
      })
      .catch((e: any) => {
        console.log("Error on Google API --> ", e);
      });
    return data;
  } catch (e: any) {
    console.log("error --> ", e);
  }
};

const getZipCode = async (props: any) => {
  try {
    const data: any = fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${props.id}&key=AIzaSyAiVaogRmqgtfU-EqhkKVp6bzJBBasOt5U`
    )
      .then((response) => {
        return response.json();
      })
      .then((res: any) => {
        console.log("Zip code response--> ", JSON.stringify(res.result));
        let address = res.result.address_components;
        let zipAddress: any = {};
        address.map((singleAddress: any, index: any) => {
          if (singleAddress.types[0] == "postal_code") {
            zipAddress = {
              data: props.data,
              state: props.state,
              city: props.city,
              pin: singleAddress.long_name,
            };
          }
        });
        return zipAddress;
      })
      .catch((e: any) => {
        console.log("Error on Google API --> ", e);
      });
    return data;
  } catch (e: any) {
    console.log("error --> ", e);
  }
};

export { getAddress, getZipCode };
