// console.log("2".localeCompare("1"));
// console.log("1".localeCompare("2"));

console.log("------TABLE---------");
//elm
const showDescriptionElm = document.querySelector("#descriptionId");
const selectShowElm = document.querySelector("#showId");
const paginationElm = document.querySelector("#paginationId");
const bodyTableElm = document.querySelector("#bodyTableId");
const nameElm = document.querySelector("#nameId");
const trElms = document.querySelectorAll("table tr th");
const searchInputElm = document.querySelector("#searchId");

//end elm

//varibale
let data = [];
data = [...mockData];
const defaultOptions = {
  show: 10,
  search: "",
  page: 1,
  sort: {
    title: "name",
    order: "asc", //tang dan --> (giam dan desc)
  },
};
let options = { ...defaultOptions };
let timer,
  searchValue = "";
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
  let { show, page, sort } = options;
  if (first) {
    console.log("first");
    changeUiSortTable(sort);
  }
  sortData(sort);
  // console.log(show);
  renderPagination(show, page);
  show = show < data.length ? show : data.length;
  let start = (page - 1) * show;
  let end = start + show < data.length ? start + show : data.length;
  console.log(start + "->" + end);
  showingDescripton(start, end);
  // if (start == 0 && end == 0) return;
  let htmlText = "";
  for (let i = start; i < end; i++) {
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
      ? _date1[1] - _date2[1] == 0
        ? 0
        : _date1[1] - _date2[1] > 0
        ? 1
        : -1
      : result;
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
  // console.log(date1, date2, result);
  return result;
};

const renderPagination = (show, page) => {
  const next = 0;
  const pre = -1;
  //many func handlePagination
  console.log({ page });
  let htmtPrevious = `<a class="${
    page == 1 ? "disable" : ""
  }" onclick="handlePagination(${pre})" href="#" >Previous</a>`;

  let htmtNext = `<a class="${
    page == Math.ceil(data.length / show) || (page == 1 && data.length < show)
      ? "disable"
      : ""
  }" onclick="handlePagination(${next})" href="#" >Next</a>`;

  let max = Math.ceil(data.length / show);
  let htmlPagination = "";
  for (let i = 0; i < max; i++) {
    htmlPagination += `<a onclick="handlePagination(${
      i + 1
    })" href="#" class="${i == page - 1 ? "selected" : ""}">${i + 1}</a>`;
  }
  paginationElm.innerHTML = htmtPrevious + htmlPagination + htmtNext;
};

const handlePagination = (newPageClick) => {
  // console.log(newPageClick );
  let newPage = newPageClick;
  newPage =
    newPage == 0 || newPage == "next"
      ? options.page + 1
      : newPage == -1 || newPage == "previous"
      ? options.page - 1
      : newPage;
  // console.log(options);
  options = { ...options, page: newPage };
  console.log(options);
  renderTable(data, options);
};

const showingDescripton = (start, end) => {
  showDescriptionElm.innerHTML = `Showing ${start} to  ${end} of  ${
    data.length
  } entries. <br> ${
    data.length < mockData.length ? "( filtered from 57 total entries)" : ""
  } `;
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
  // console.log("-newShow ", newShow);
  options = { ...options, show: newShow, page: 1 };
  console.log(options);
  renderTable(data, options);
  renderPagination(newShow, options.page);
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

// searchInputElm.addEventListener("change", (e) => {
//   console.log(e);
// });

//search
const inputHandler = function (e) {
  // performance
  clearTimeout(timer);
  timer = setTimeout(() => {
    changeData(e.target.value);
  }, 500);
};
searchInputElm.addEventListener("input", inputHandler);
searchInputElm.addEventListener("propertychange", inputHandler); // for IE8

const changeData = (value) => {
  options = { ...options, search: value, page: 1 };
  console.log(options);
  if (value == "") {
    data = [...mockData];
    renderTable(mockData, options);
    return;
  }
  value = value.toLowerCase();
  check = false;

  data = mockData.filter((item) => {
    check = false;
    check = item["name"].toLowerCase().includes(value);
    check = check ? check : item["position"].toLowerCase().includes(value);
    check = check ? check : item["office"].toLowerCase().includes(value);
    check = check ? check : String(item["age"]).includes(value);
    check = check ? check : item["startDate"].toLowerCase().includes(value);
    // console.log(check);
    if (check) return item;
  });

  // console.log({ newData: data });
  renderTable(data, options);
};

//End search

//End event
