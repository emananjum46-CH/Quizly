import { Notyf } from "notyf";
import "notyf/notyf.min.css";

class Helpers {
  static localhost = "https://quizly-backend-8di5.onrender.com";
  static server = "https://api.clockin.services";
  static basePath = `${this.localhost}`;
  static apiUrl = `${this.basePath}/api/`;

  static authUser = JSON.parse(localStorage.getItem("user")) ?? {};
  static user_id = JSON.parse(localStorage.getItem("user_id")) ?? {};

  static serverImage = (name) => {
    return `${this.basePath}/storage/${name}`;
  };

  static authHeaders = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  };

  static authFileHeaders = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  };

  static getItem = (data, isJson = false) => {
    if (isJson) {
      return JSON.parse(localStorage.getItem(data));
    } else {
      return localStorage.getItem(data);
    }
  };
  static removeItem = (data) => {
    localStorage.removeItem(data);
  };

  static setItem = (key, data, isJson = false) => {
    if (isJson) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, data);
    }
  };

 static Toast = new Notyf({
    duration: 3000,
    position: {
        x: "right",
        y: "top",
    },
    types: [
        {
            type: "warning",
            background: "orange",
            icon: false
        }
    ]
});
static toast(type, message) {

    if(type === "success") {
        this.Toast.success(message);
    }

    else if(type === "warning") {
        this.Toast.open({
            type: "warning",
            message: message
        });
    }

    else {
        this.Toast.error(message);
    }

}

  static toggleCSS() {
    const path = window.location.pathname;

    const mainCSS = document.getElementById("mainCSS");
    const dashboardCSS = document.getElementById("dashboardCSS");

    if (path.includes("/user") || path.includes("/admin")) {
      mainCSS.setAttribute("disabled", "true");
      dashboardCSS.removeAttribute("disabled");
    } else {
      dashboardCSS.setAttribute("disabled", "true");
      mainCSS.removeAttribute("disabled");
    }
  }

  static encryptObject = (obj) => {
    const str = JSON.stringify(obj);
    const encrypted = btoa(str);
    return encrypted;
  };

  static decryptObject = (str) => {
    const decrypted = atob(str);
    const obj = JSON.parse(decrypted);
    return obj;
  };

  static encryptString = (str) => {
    const encrypted = btoa(str);
    return encrypted;
  };

  static decryptString = (str) => {
    try {
      const decrypted = atob(str);
      return decrypted;
    } catch (error) {
      return "";
    }
  };

  // static decryptObject = (str) => {
  //   const encrypted = btoa
  // }
  // static decryptString = () => {
  //   const encrypted = btoa(str)
  //   return encrypted
  // }
  static paginate = (data) => {
    let pageSize = 10;
    let paginated = [];
    let startIndex = 0;
    let totalPages = Math.ceil(data.length / pageSize);
    for (let i = 0; i < totalPages; i++) {
      let lastIndex = pageSize + startIndex;
      let pageData = data.slice(startIndex, lastIndex);
      paginated.push(pageData);
      startIndex += pageSize;
    }
    return paginated;
  };

  static getContentValue = (dataString) => {
    try {
      let data = JSON.parse(dataString);
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].delta.content;
      } else {
        return "";
      }
    } catch (error) {
      return "";
    }
  };

  static countWords = (str) => {
    if (str) {
      let words = str.split(" ");
      return words.length;
    } else {
      return 0;
    }
  };
  static chunkArray = (array, chunkSize) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };
}

export default Helpers;
