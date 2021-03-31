console.log("2".localeCompare("1"));
console.log("1".localeCompare("2"));

console.log("------TABLE---------");
//elm
let selectShowElm = document.querySelector("#showId");
let bodyTableElm = document.querySelector("#bodyTableId");
let nameElm = document.querySelector("#nameId");
let trElms = document.querySelectorAll("table tr th");
//end elm

//varibale
let data = [];
data = mockData;
let defaultOptions = {
  show: 10,
  search: "",
  page: 1,
  sort: {
    title: "name",
    order: "asc", //tang dan --> (giam dan desc)
  },
};
let options = { ...defaultOptions };
//End varibale

// console.log(data);

// function readTextFile(file, callback) {
//   var rawFile = new XMLHttpRequest();
//   rawFile.overrideMimeType("application/json");
//   rawFile.open("GET", file, true);
//   rawFile.onreadystatechange = function () {
//     if (rawFile.readyState === 4 && rawFile.status == "200") {
//       return callback(rawFile.responseText);
//     }
//   };
//   rawFile.send(null);
// }

// mockData = readTextFile("MOCK_DATA.json", function (text) {
//   mockData = JSON.parse(text);
//   // console.log(mockData);
//   return mockData;
// });

const fetchData = new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve(mockData);
    }, 300);

    // resolve("khanh");
  } catch (error) {
    reject(error);
  }
});

const renderTable = (data, options, first) => {
  let { show, sort } = options;
  if (first) {
    console.log("first");
    changeUiSortTable(sort);
    sortData(sort);
  }
  // console.log(show);
  show = show < data.length ? show : data.length;
  let htmlText = "";
  for (let i = 0; i < show; i++) {
    htmlText += `
    <tr key=${data[i].id}>
                 <td>${data[i].name}</td>
                 <td>${data[i].position}</td>
                 <td>${data[i].office}</td>
                 <td>${data[i].age}</td>
                 <td>${data[i].startDate}</td>
             </tr>
    `;
  }
  bodyTableElm.innerHTML = htmlText;
};

const changeUiSortTable = (sort) => {
  const { title, order } = sort;
  // console.log(`#${title}Id`);
  let elmSelected = document.querySelector(`#${title}Id`);
  // console.log(elmSelected);
  trElms.forEach((elm) => (elm.className = ""));
  elmSelected.classList.add(order);
};

const sortData = (sort) => {
  const { title, order } = sort;
  if (data.length > 1 && title != "age" && title != "startDate") {
    // console.log(data);
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = i + 1; j < data.length; j++) {
        // console.log(
        //   data[i][title] +
        //     "----" +
        //     data[j][title] +
        //     "===" +
        //     data[i][title].localeCompare(data[j][title])
        // );
        // );
        if (
          String(data[i][title]).localeCompare(String(data[j][title])) ==
          (order == "asc" ? 1 : -1)
        ) {
          let tmp = data[i];
          data[i] = data[j];
          data[j] = tmp;
        }
      }
    }

    // console.log(data);
  } else if (data.length > 1 && title == "age") {
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (
          order == "asc"
            ? data[i][title] > data[j][title]
            : data[i][title] < data[j][title]
        ) {
          let tmp = data[i];
          data[i] = data[j];
          data[j] = tmp;
        }
      }
    }
  } else if (data.length > 1 && title == "startDate") {
    for (let i = 0; i < data.length - 1; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (
          order == "asc"
            ? compareDate(data[i][title], data[j][title]) == 1
            : compareDate(data[i][title], data[j][title]) == -1
        ) {
          let tmp = data[i];
          data[i] = data[j];
          data[j] = tmp;
        }
      }
    }
  }
};

const compareDate = (date1, date2) => {
  //date = "mm/dd/yyyy"

  let _date1 = date1.split("/").map((item) => Number(item));
  let _date2 = date2.split("/").map((item) => Number(item));
  // console.log(_date1, _date2);
  let result =
    _date1[2] - _date2[2] == 0 ? 0 : _date1[2] - _date2[2] > 0 ? 1 : -1;
  // console.log(result);
  result =
    result == 0
      ? _date1[0] - _date2[0] == 0
        ? 0
        : _date1[0] - _date2[0] > 0
        ? 1
        : -1
      : result;
  // console.log(result);
  result =
    result == 0
      ? _date1[1] - _date2[1] == 0
        ? 0
        : _date1[1] - _date2[1] > 0
        ? 1
        : -1
      : result;
  // console.log(result);
  // console.log(date1, date2, result);
  return result;
};

//usage:

// fetchData.then((data) => {
//   console.log(data);
//   let htmlText = "";
//   let totalItem = data.length;

//   data.forEach((item) => {
//     htmlText += `
//     <tr key=${item.id}>
//                  <td>${item.name}</td>
//                  <td>${item.position}</td>
//                  <td>${item.position}</td>
//                  <td>${item.age}</td>
//                  <td>${item.startDate}</td>
//              </tr>
//     `;
//   });

//   bodyTableElm.innerHTML = htmlText;
// });

window.onload = renderTable(data, options, true);

//event

selectShowElm.addEventListener("change", (e) => {
  let newShow = e.target.value;
  console.log("-newShow ", newShow);
  options = { ...options, show: newShow };
  renderTable(data, options);
});

trElms.forEach((elm) => {
  elm.addEventListener("click", () => {
    let newTitle = elm.getAttribute("key");
    // console.log(newTitle);
    options = {
      ...options,
      sort: {
        title: newTitle,
        order: options.sort.order == "asc" ? "desc" : "asc",
      },
    };
    console.log(options);
    let { sort } = options;
    changeUiSortTable(sort);
    sortData(sort);
    // console.log(data);
    renderTable(data, options);
  });
});

//End event
