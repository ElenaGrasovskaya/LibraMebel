

(function (window, document) {

    'use strict';

    // patch CustomEvent to allow constructor creation (IE/Chrome)
    if (typeof window.CustomEvent !== 'function') {

        window.CustomEvent = function (event, params) {

            params = params || { bubbles: false, cancelable: false, detail: undefined };

            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };

        window.CustomEvent.prototype = window.Event.prototype;
    }

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    var xDown = null;
    var yDown = null;
    var xDiff = null;
    var yDiff = null;
    var timeDown = null;
    var startEl = null;

    function handleTouchEnd(e) {

        // if the user released on a different target, cancel!
        if (startEl !== e.target) return;

        var swipeThreshold = parseInt(startEl.getAttribute('data-swipe-threshold') || '20', 10);    // default 10px
        var swipeTimeout = parseInt(startEl.getAttribute('data-swipe-timeout') || '500', 10);      // default 1000ms
        var timeDiff = Date.now() - timeDown;
        var eventType = '';

        if (Math.abs(xDiff) > Math.abs(yDiff)) { // most significant
            if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
                if (xDiff > 0) {
                    eventType = 'swiped-left';
                }
                else {
                    eventType = 'swiped-right';
                }
            }
        }
        else {
            if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
                if (yDiff > 0) {
                    eventType = 'swiped-up';
                }
                else {
                    eventType = 'swiped-down';
                }
            }
        }

        if (eventType !== '') {

            // fire event on the element that started the swipe
            startEl.dispatchEvent(new CustomEvent(eventType, { bubbles: true, cancelable: true }));

            // if (console && console.log) console.log(eventType + ' fired on ' + startEl.tagName);
        }

        // reset values
        xDown = null;
        yDown = null;
        timeDown = null;
    }

    function handleTouchStart(e) {

        // if the element has data-swipe-ignore="true" we stop listening for swipe events
        if (e.target.getAttribute('data-swipe-ignore') === 'true') return;

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

}(window, document));

document.addEventListener('swiped-left', function(e) {
  console.log(e.target.className); // the element that was swiped
  const element = e.target.className;
  if(element == "viewport")
  plusSlides(1);
  else if(element == "hover-shadow")
  turnpage(1);
});

document.addEventListener('swiped-right', function(e) {
  console.log(e.target.className); // the element that was swiped
  const element = e.target.className;
  if(element == "viewport")
  plusSlides(-1);
  else if(element == "hover-shadow")
  turnpage(-1);
});

/* ***********************************  GLOBAL VARIABLES  **************************** */


let tabs = ["kitchen","wardrobe","bathroom","other"];
let currentTab = 0;
let pageNum=1;
let thePage=1;

const pageMax=[6,1,1,2];
const noThumbPage= 
[
[0,0,0,0,0,1],
[1],
[1],
[1,1]
];


const maxSlides = 48;
let slideIndex = 1;
let page = document.getElementById("touchsurface");

let pageLoad = false;


// Open the Modal
function openModal() {
  document.getElementById("myModal").style.display = "block";
}

// Close the Modal
function closeModal() {
  document.getElementById("myModal").style.display = "none";


   }


//showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  
   if ((slideIndex+n)==13)
  {
    pageNum++;
    if(pageNum>pageMax[currentTab])
    pageNum=1;
    //turnpage(1);
    slideIndex=1;
    showSlides(slideIndex);
    

  }
  else if((slideIndex+n)<=12&&(slideIndex+n)>0)
  {
    slideIndex+=n;
    showSlides(slideIndex);

  }
  else if((slideIndex+n)==0)
  {
    pageNum--;
    if(pageNum==0)
    pageNum=pageMax[currentTab];
    //turnpage(-1);
    slideIndex=12;
    showSlides(slideIndex);
  }
  else
  {
    console.log("slideIndex is strange");
    showSlides(slideIndex+n);
  }
  console.log("pageNum="+thePage + " currentTab="+currentTab+ " slideIndex"+slideIndex);
 
}

// Thumbnail image controls
function currentSlide(n, slide) {
  
  let pos = Number(slide.src.search("page"))+4;
  thePage= Number(slide.src[pos]);
    

  slideIndex=n;
  showSlides(slideIndex);
}

function showSlides(n) {
  

  
  let i;
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("demo");
  const slideNum = document.getElementsByClassName("numbertext");

  

  showSubSlides(1);
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideNum[slideIndex-1].innerHTML = Number(Number(slideIndex) + (thePage-1)*12) + " / " + maxSlides;
    
  for (i = 0; i < dots.length; i++) {
    
    dots[i].className = dots[i].className.replace(" active", "");
    
    dots[i].src = "thumbnails/"+tabs[currentTab]+"/page"+thePage+"/"+n+"_"+(i+1)+".jpg";
    dots[i].style.display = "block";
  }
  slides[slideIndex-1].innerHTML =slides[slideIndex-1].innerHTML.replace(/page./i,"page"+thePage);  //Вот тут я меняю номер страницы если вдруг пролистывание завело на следующую


  if(dots[0])
  dots[0].className+=" active";
  if(slides[slideIndex-1])
  slides[slideIndex-1].style.display = "block";
  
  if(noThumbPage[currentTab][thePage-1])
  {
    for (i = 0; i < dots.length; i++)
    {
      dots[i].style.display = "none";
    }
   }
console.log("Image URL "+slides[slideIndex-1].innerHTML);
   
  
  //captionText.innerHTML = dots[slideIndex-1].alt;
 
 
  
}


function showSubSlides(k)
{
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var activeDot = document.getElementsByClassName("demo active");
  var captionText = document.getElementById("caption");
  if (k==1)
  {
    activeDot.className = "demo";
  }

  
  
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  dots[k-1].className = dots[k-1].className.replace("demo", "demo active");
  var inHTML = slides[slideIndex-1].innerHTML;
  var pos = inHTML.search(".jpg");
  var num = inHTML[pos-1];
  var newInHTML = inHTML.replace(num+".jpg",k+".jpg");
  
  slides[slideIndex-1].innerHTML = newInHTML;
  
  
  slides[slideIndex-1].style.display = "block";
 
  //captionText.innerHTML = dots[slideIndex-1].alt;
  
  
}


function animatePageOff()
{
 
  page.style.animationName = "newPageOff";
  console.log(page.style.animationName);
  
}
function animatePageOn()
{
 
  page.style.animationName = "newPageOn";
  console.log(page.style.animationName);

}


function turnpage(k)
{
  
  
  let thumbnails = document.getElementsByClassName("hover-shadow");
  let slides = document.getElementsByClassName("mySlides");
  
  animatePageOff(); 
  page.style.opacity = 0;
    
  let newPageNum=0;
  if(k===100)
  {
    newPageNum=1;
  }
  else
  {
  if(pageNum+k===0)
  newPageNum=pageMax[currentTab];
  else if(pageNum===pageMax[currentTab])
  {
    if(k===1)
    newPageNum=1;
    else
    newPageNum=pageNum-1;
  }
  
  else
  newPageNum=pageNum+k;

 }
 for (let i = 0; i < thumbnails.length; i++)
 {
   thumbnails[i].visibility="hidden";
        
 }

        
 for (let i = 0; i< slides.length; i++)
  {
    let inHTML= slides[i].innerHTML;
    let newInHTML = inHTML.replace("page"+pageNum,"page"+newPageNum);
    slides[i].innerHTML = newInHTML;
    
  }

  setTimeout(change, 500);
  function change()
  {
    for (let i = 0; i < thumbnails.length; i++)
    {
      thumbnails[i].src=thumbnails[i].src.replace("page"+pageNum,"page"+newPageNum);
    }

  
   for (let i = 0; i < thumbnails.length; i++)
    {
      thumbnails[i].visibility="visible";
           
    }
    pageText.innerHTML = newPageNum+"/"+pageMax[currentTab]; 
    

     animatePageOn();
     page.style.opacity = 1;
     
    pageNum=newPageNum;
  
  }
     
  
}

function turnTabs(tab)
{
 let gallery = document.getElementsByClassName("hover-shadow"); 
 let lightbox = document.getElementsByClassName("viewport");
 let subimage = document.getElementsByClassName("demo");
 let pageText = document.getElementById("pageText");
 
 animatePageOff();

 page.style.opacity = 0;


 
  
 for(let i=0; i<tabs.length; i++)
 {
   if(i==tab)
   document.getElementById(tabs[i]).className = "tabs-active";
   else
   document.getElementById(tabs[i]).className = "tabs";

 }

   setTimeout(replaceTab(),500);
      function replaceTab()  
      {
        animatePageOn();
       
          for (let i=0; i<gallery.length; i++)
        {
         gallery[i].src = gallery[i].src.replace("page"+pageNum,"page1");  //Reverting to the first page
         gallery[i].src = gallery[i].src.replace(tabs[currentTab],tabs[tab]);
         

        }
        page.style.opacity = 1;
      }
    
    for (let i=0; i<lightbox.length; i++)
    {
       lightbox[i].src = lightbox[i].src.replace("page"+pageNum,"page1"); //Reverting to the first page
       lightbox[i].src = lightbox[i].src.replace(tabs[currentTab],tabs[tab]);
       
        
    }

    for (let i=0; i<subimage.length; i++)
    {
      
        subimage[i].src = subimage[i].src.replace("page"+pageNum,"page1"); //Reverting to the first page
        subimage[i].src = subimage[i].src.replace(tabs[currentTab],tabs[tab]);
       
    }
    
    pageText.innerHTML = "1"+"/"+pageMax[tab];

    currentTab=tab;
    pageNum=1;
   
  
    
  
  
 
}


function hideText()
{
  let downArrow = document.getElementById("arrow_down");
  let upArrow = document.getElementById("arrow_up");
  let text = document.getElementById("hide_text");
  
  downArrow.style.display= "block";
  upArrow.style.display= "none";
  
  text.style.opacity = "0%";
  setTimeout(() => { text.style.display = "none"; }, 500);
  
}

function showText()
{
  let downArrow = document.getElementById("arrow_down");
  let upArrow = document.getElementById("arrow_up");
  let text = document.getElementById("hide_text");
  text.style.display = "block";
   
  downArrow.style.display= "none";
  upArrow.style.display= "block";
  setTimeout(() => { text.style.opacity = "100%"; }, 1);
  
 
}

function hideText2()
{
  let downArrow = document.getElementById("more");
  let upArrow = document.getElementById("no_more");
  let text = document.getElementsByClassName("hide");
  
  downArrow.style.display= "block";
  upArrow.style.display= "none";

  
  
  setTimeout(() => { 
    for(let i=0; i<text.length; i++)
    {
      text[i].style.display="none";
      text[i].style.opacity = "0%"; 
    }
  }, 300);
  
}

function showText2()
{
  let downArrow = document.getElementById("more");
  let upArrow = document.getElementById("no_more");
  let text = document.getElementsByClassName("hide");
  for(let i=0; i<text.length; i++)
  {
    text[i].style.display="block";
  }
   
  downArrow.style.display= "none";
  upArrow.style.display= "block";
  setTimeout(() => { 
    for(let i=0; i<text.length; i++)
    {
      text[i].style.display="block";
      text[i].style.opacity = "100%"; 
    }
    
  }, 300);
   
}


function morePhotos(moreButton)
{
  let moreGallery = document.getElementById("touchsurface");
  let container = document.getElementById("gallery-container");
    
  let thisPage = "page1";
  pageNum++;
  let newPage = "page"+ pageNum;
  let moreGalleryHTML = moreGallery.innerHTML;
  let newGallery = moreGalleryHTML.replaceAll(thisPage,newPage);
 
  container.innerHTML+=newGallery;

  if(pageNum===pageMax[0])
  {
    moreButton.style.display = "none";
    
  }


}
