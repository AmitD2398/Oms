//@ts-nocheck
import { Alert } from "react-native";
import { ApiUrl, TOKEN } from "../constants/Constant";
// import { post_params } from "./Validator";
import { showToastWithGravity } from "../components/Common/SnackBar";

const post_params = (params: {}) => {
    var dataToSend: any = params;
    var formBody: any = [];
    for (var key in dataToSend) {
        var encodedKey = encodeURIComponent(key);
        var encodedValue = encodeURIComponent(dataToSend[key]);
        formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    return formBody;
}

export const fetchUrl = (params: any, AccessToken: string, urlEndPint: string) => {
    // console.log("wwwwwwwwwwwww", params, "iiiiiiii", post_params(params), AccessToken);
    // console.log("fetchUrl>>>>===", AccessToken, typeof AccessToken, urlEndPint);

    return new Promise(function (myResolve, myReject) {
        // "Producing Code" (May take some time)
        let formBody = post_params(params);
        fetch(ApiUrl + urlEndPint, {
            method: 'POST', //Request Type
            body: formBody, //post body
            headers: {
                //Header Defination
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                "token": TOKEN,
                tokenid: AccessToken  //access token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log(' endpoint ==  ', urlEndPint)
                // console.log(' data -   ', responseJson)
                myResolve(responseJson)
            })
            //If response is not in json then in error
            .catch((error) => {
                showToastWithGravity(error.message == "Network request failed" ? "Please check your internet connection" : error.message)
                console.log('error endpoint ==  ', urlEndPint)
                console.log('error data --- ', error)
                myReject(error);
            })
    });
}

export const fetchFormData = (data: any, AccessToken: string, urlEndPint: string) => {
    // console.log("urlTotal::", ApiUrl + urlEndPint, AccessToken, data);

    return (
        fetch(ApiUrl + urlEndPint, {
            method: 'POST',
            body: data,
            headers: {
                // "accept": "application/json",
                'Content-Type': 'multipart/form-data',
                "Token": TOKEN,
                tokenid: AccessToken
            }
        })
            .then((response) => response.json())
        //If response is in json then in success

        // .then((responseJson) => {
        //     responseJson
        //     // if (mount) setScreenLoader(true);
        //     // console.log('KycUpdateResult==== ', responseJson);
        //     // if (responseJson.status === 200) {
        //     // } else if (responseJson.status === 400) {
        //     // } else if (responseJson.status === 603) {
        //     // }

        // }
        // )

        //If response is not in json then in error
        // .catch((error) => {
        //     console.log("ErrorKycUpdate", error);
        // })
    )
}
