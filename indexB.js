(function (window, document) {
  "use strict";

  // patch CustomEvent to allow constructor creation (IE/Chrome)
  if (typeof window.CustomEvent !== "function") {
    window.CustomEvent = function (event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined,
      };

      var evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(
        event,
        params.bubbles,
        params.cancelable,
        params.detail
      );
      return evt;
    };

    window.CustomEvent.prototype = window.Event.prototype;
  }

  document.addEventListener("touchstart", handleTouchStart, false);
  document.addEventListener("touchmove", handleTouchMove, false);
  document.addEventListener("touchend", handleTouchEnd, false);

  var xDown = null;
  var yDown = null;
  var xDiff = null;
  var yDiff = null;
  var timeDown = null;
  var startEl = null;

  function handleTouchEnd(e) {
    // if the user released on a different target, cancel!
    if (startEl !== e.target) return;

    var swipeThreshold = parseInt(
      startEl.getAttribute("data-swipe-threshold") || "20",
      10
    ); // default 10px
    var swipeTimeout = parseInt(
      startEl.getAttribute("data-swipe-timeout") || "500",
      10
    ); // default 1000ms
    var timeDiff = Date.now() - timeDown;
    var eventType = "";

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // most significant
      if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
        if (xDiff > 0) {
          eventType = "swiped-left";
        } else {
          eventType = "swiped-right";
        }
      }
    } else {
      if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
        if (yDiff > 0) {
          eventType = "swiped-up";
        } else {
          eventType = "swiped-down";
        }
      }
    }

    if (eventType !== "") {
      // fire event on the element that started the swipe
      startEl.dispatchEvent(
        new CustomEvent(eventType, { bubbles: true, cancelable: true })
      );

      // if (console && console.log) console.log(eventType + ' fired on ' + startEl.tagName);
    }

    // reset values
    xDown = null;
    yDown = null;
    timeDown = null;
  }

  function handleTouchStart(e) {
    // if the element has data-swipe-ignore="true" we stop listening for swipe events
    if (e.target.getAttribute("data-swipe-ignore") === "true") return;

    startEl = e.target;

    timeDown = Date.now();
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;
    xDiff = 0;
    yDiff = 0;
  }

  function handleTouchMove(e) {
    if (!xDown || !yDown) return;

    var xUp = e.touches[0].clientX;
    var yUp = e.touches[0].clientY;

    xDiff = xDown - xUp;
    yDiff = yDown - yUp;
  }
})(window, document);

document.addEventListener("swiped-left", function (e) {
  console.log(e.target.className); // the element that was swiped
  const element = e.target.className;
  if (element == "viewport lazyloaded") plusSlides(1);
});

document.addEventListener("swiped-right", function (e) {
  console.log(e.target.className); // the element that was swiped
  const element = e.target.className;
  if (element == "viewport lazyloaded") plusSlides(-1);
});

/* ***********************************  GLOBAL VARIABLES  **************************** */

let currentTab = 0;
const tabs = ["kitchen", "wardrobe", "bathroom", "other"];
let pageNum = 1;
let thePage = 1;

const pageMax = [7, 2, 2, 2];
const SubSlides = [
  [
    [4, 6, 5, 4, 7, 7, 7, 5, 7, 9, 5, 7],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [5, 6, 5, 4, 5, 6, 8, 4, 5, 4, 3, 7],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],

  [
    [3, 4, 4, 6, 6, 8, 7, 6, 5, 6, 5, 5],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

const galleryInitialState = document.getElementById("touchsurface").innerHTML;

const maxSlides = 48;
let slideIndex = 1;

//Open the Modal
function openModal() {
  document.getElementById("myModal").style.display = "block";
}

// Close the Modal
function closeModal() {
  document.getElementById("myModal").style.display = "none";
}

function morePhotos(clear = false) {
  const moreGallery = document.getElementById("touchsurface");
  const container = document.getElementById("gallery-container");
  const moreButton = document.getElementById("moreButton");

  let thisPage = "page1";
  if (!clear) {
    pageNum++;
  }

  let newPage = "page" + pageNum;
  let moreGalleryHTML = moreGallery.innerHTML;
  let newGallery = moreGalleryHTML.replaceAll(thisPage, newPage);
  if (!clear) {
    moreGallery.innerHTML += newGallery;
  } else {
    const returnToInitialStateGallery = galleryInitialState.replaceAll(
      "kitchen",
      tabs[currentTab]
    );

    moreGallery.innerHTML = returnToInitialStateGallery;
  }

  if (pageNum === pageMax[currentTab]) {
    moreButton.style.display = "none";
  }
}

function currentSlide(currentSlideNumber, slide) {
  let previewImageURL = slide.src;
  console.log("slide", slide);
  let newURL = slide.src.split("thumbnails");
  let newImageURL = newURL[1];

  const currentImageURL = document
    .getElementById("largeViewportImage")
    .src.split("gallery")[1];
  console.log("currentImageURL", currentImageURL);

  let newPictureDisplay = document.getElementById("modal-block-large");

  newPictureDisplay.innerHTML = newPictureDisplay.innerHTML.replaceAll(
    currentImageURL,
    newImageURL
  );
  newPictureDisplay.style.opacity = 1;

  const currentPageN = slide.src[Number(slide.src.indexOf("page")) + 4]; //Getting page number from slide data
  pageNum = currentPageN;

  let dots_element = document.getElementsByClassName("demo");

  const regex = /\/page\d\/?.\d_\d.jpg/g; //regex for updating images url
  for (let i = 0; i < dots_element.length; i++) {
    if (i == 0) dots_element[i].id = "active_dot";
    else dots_element[i].id = "";
    dots_element[i].src = dots_element[i].src.replaceAll(
      regex,
      `/page${currentPageN}/${currentSlideNumber}_${i + 1}.jpg`
    );
    if (i + 1 > SubSlides[currentTab][pageNum - 1][currentSlideNumber - 1]) {
      dots_element[i].style.display = "none";
    }

    console.log("dots_element", dots_element[i]);
  }
}

function showSubSlides(currentSubSlide) {
  let activeDot = document.getElementById("active_dot");
  console.log("activeDot", activeDot);
  activeDot.id = "";
  console.log("activeDot", activeDot.src);
  currentSubSlide.id = "active_dot";
  let mainViewImage = document.getElementById("modal-block-large");

  let positionNew = currentSubSlide.src.indexOf(".jpg") - 1;
  console.log(
    "currentSubSlide.src[positionNew]",
    currentSubSlide.src[positionNew]
  );
  mainViewImage.innerHTML = mainViewImage.innerHTML.replaceAll(
    /_..jpg/g,
    `_${currentSubSlide.src[positionNew]}.jpg`
  );
}

function hideText() {
  let downArrow = document.getElementById("arrow_down");
  let upArrow = document.getElementById("arrow_up");
  let text = document.getElementById("hide_text");

  downArrow.style.display = "block";
  upArrow.style.display = "none";

  text.style.opacity = "0%";
  setTimeout(() => {
    text.style.display = "none";
  }, 500);
}

function showText() {
  let downArrow = document.getElementById("arrow_down");
  let upArrow = document.getElementById("arrow_up");
  let text = document.getElementById("hide_text");
  text.style.display = "block";

  downArrow.style.display = "none";
  upArrow.style.display = "block";
  setTimeout(() => {
    text.style.opacity = "100%";
  }, 1);
}

function hideText2() {
  let downArrow = document.getElementById("more");
  let upArrow = document.getElementById("no_more");
  let text = document.getElementsByClassName("hide");

  downArrow.style.display = "block";
  upArrow.style.display = "none";

  setTimeout(() => {
    for (let i = 0; i < text.length; i++) {
      text[i].style.display = "none";
      text[i].style.opacity = "0%";
    }
  }, 300);
}

function showText2() {
  let downArrow = document.getElementById("more");
  let upArrow = document.getElementById("no_more");
  let text = document.getElementsByClassName("hide");
  for (let i = 0; i < text.length; i++) {
    text[i].style.display = "block";
  }

  downArrow.style.display = "none";
  upArrow.style.display = "block";
  setTimeout(() => {
    for (let i = 0; i < text.length; i++) {
      text[i].style.display = "block";
      text[i].style.opacity = "100%";
    }
  }, 300);
}

function plusSlides(n) {
  if (slideIndex + n == 13) {
    pageNum++;
    if (pageNum > pageMax[currentTab]) pageNum = 1;
    //turnpage(1);
    slideIndex = 1;
  } else if (slideIndex + n <= 12 && slideIndex + n > 0) {
    slideIndex += n;
  } else if (slideIndex + n == 0) {
    pageNum--;
    if (pageNum == 0) pageNum = pageMax[currentTab];

    slideIndex = 12;
  } else {
    console.log("slideIndex is strange");
    slideIndex = slideIndex + n;
  }
  let mainViewImage = document.getElementById("modal-block-large");

  mainViewImage.innerHTML = mainViewImage.innerHTML.replaceAll(
    /page\d.?.._\d.jpg/g,
    `page${pageNum}/${slideIndex}_1.jpg`
  );
  let allDots = document.getElementsByClassName("demo");
  let activeDot = document.getElementById("active_dot");
  activeDot.id = "";
  allDots[0].id = "active_dot";
  console.log("allDots", allDots);
  for (let i = 0; i < allDots.length; i++) {
    allDots[i].src = allDots[i].src.replaceAll(
      /page\d.?.._\d.jpg/g,
      `page${pageNum}/${slideIndex}_${i + 1}.jpg`
    );

    if (i + 1 > SubSlides[currentTab][pageNum - 1][slideIndex - 1]) {
      console.log(
        "maxSubSlides",
        SubSlides[currentTab][pageNum - 1][slideIndex - 1]
      );
      allDots[i].style.display = "none";
    } else allDots[i].style.display = "block";
  }
}

function turnTabs(tab) {
  let gallery = document.getElementsByClassName("hover-shadow");
  let lightbox = document.getElementsByClassName("viewport");
  let subimage = document.getElementsByClassName("demo");
  let pageText = document.getElementById("pageText");
  const moreButton = document.getElementById("moreButton");
  moreButton.style.display = "block";

  for (let i = 0; i < tabs.length; i++) {
    if (i == tab) document.getElementById(tabs[i]).className = "tabs-active";
    else document.getElementById(tabs[i]).className = "tabs";
  }

  for (let i = 0; i < gallery.length; i++) {
    gallery[i].src = gallery[i].src.replaceAll(/page\d/gi, "page1"); //Reverting to the first page
    gallery[i].src = gallery[i].src.replaceAll(tabs[currentTab], tabs[tab]);
  }

  for (let i = 0; i < lightbox.length; i++) {
    lightbox[i].src = lightbox[i].src.replaceAll(/page\d/gi, "page1"); //Reverting to the first page
    lightbox[i].src = lightbox[i].src.replaceAll(tabs[currentTab], tabs[tab]);
  }

  for (let i = 0; i < subimage.length; i++) {
    subimage[i].src = subimage[i].src.replaceAll(/page\d/gi, "page1"); //Reverting to the first page
    subimage[i].src = subimage[i].src.replaceAll(tabs[currentTab], tabs[tab]);
  }

  currentTab = tab;
  pageNum = 1;
  morePhotos(true);
}
/*




function hoverDescription() {
  let gallerySlides = document.getElementsByClassName("column");
  console.log(gallerySlides);

var style_rules = window.getComputedStyle(gallerySlides[0], "::before");
console.log(style_rules.content);

style_rules.setProperty("content", `"Hello"`);
console.log(style_rules.content);

}
hoverDescription();

*/
