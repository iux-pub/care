
$(function(){

  menu();
  maintab();
  outlink();
  anifocus();


  $("nav#main-menu .menus ul li:first-child a").attr('id','menus-focus');
  
  
  $("section.sub-content #sub-menu li.on a").on("click", function(e){

      $("nav#sub-menu").toggleClass("active");
      e.preventDefault();

  });

  $(window).on("resize", function(){
      $("nav#main-menu h3 a").unbind();
      menu();
  });


  $("div.find-form").last().hide();

  var radioContent = $("div.find-form");


  $("div.find-type input[type='radio']").click(function() {

      radioContent.hide();
      radioContent.eq($("input[type='radio']").index(this)).show();


  });



  $(" button.close,youtube").on("click",function(){
    $(".youtube").removeClass("on")
  })

  

  let thisSlide, // Swiper Slide
  focusOut, // 슬라이드 키보드 접근 확인
  slideFocus = {}, // 슬라이드 내부 탭 포커스 가능한 요소 저장
  swiperWrapper = document.querySelector('.swiper-wrapper'),
  slideAll, // 전체 슬라이드 저장
  slideLength, // 슬라이드 갯수
  onClickNavigation, // 슬라이드 이전/다음 버튼으로 슬라이드 전환 확인
  navigations = {}, // 슬라이드 이전 다음 버튼
  prevEnter; // 이전 버튼 키보드 엔터로 접근 확인
  const slideKeyDownEvt = (e, idx) => {
    // back tab : 첫 번째 슬라이드 포커스 시
    if (e.key == 'Tab' && e.shiftKey && thisSlide.activeIndex === 0) {
      focusOut = false;
      // back tab : 그 외 슬라이드 포커스 시
    } else if (e.key == 'Tab' && e.shiftKey && e.target === slideFocus[idx][0]) {
      e.preventDefault();
      focusOut = true;
      slideAll[thisSlide.activeIndex - 1].setAttribute('tabindex', '0');
      thisSlide.slideTo(thisSlide.activeIndex - 1);
      removeSlideTabindex();
    } else if (e.key == 'Tab' && !e.shiftKey && e.target === slideFocus[idx][slideFocus[idx].length - 1]) {
      if (idx >= slideLength) {
        // tab : 마지막 슬라이드 내 마지막 요소 포커스 시
        focusOut = false;
      } else {
        // tab : 그 외 슬라이드 내 마지막 요소 포커스 시
        e.preventDefault();
        if (slideAll[thisSlide.activeIndex + 1] <= slideLength) slideAll[thisSlide.activeIndex + 1].setAttribute('tabindex', '0');
        focusOut = true;
        thisSlide.slideTo(thisSlide.activeIndex + 1);
        removeSlideTabindex();
      }
    };
  };
  
  // 슬라이드 내부 클릭 요소 tabindex 값 삭제
  const removeSlideTabindex = () => {
    slideAll.forEach((element, i) => {
      let focusTarget = Array.prototype.slice.call(element.querySelectorAll('a, button, input, [role="button"], textarea, select, [tabindex="0"]'));
      focusTarget.forEach((el, idx) => {
        if (el.closest('.swiper-slide') === slideAll[thisSlide.activeIndex]) el.removeAttribute('tabindex');
      });
    });
  };
  const slideFocusAct = (e, idx, next) => {
    if (onClickNavigation) {
      if (e.key == 'Enter' && !next) prevEnter = true;
      else if (e.key == 'Tab') {
        if (!e.shiftKey && next) {
          e.preventDefault();
          slideFocus[idx][0].setAttribute('tabindex', '0');
          slideFocus[idx][0].focus();
          removeSlideTabindex();
          onClickNavigation = false;
        } else if (prevEnter && !next) {
          if (idx === 0) idx = 1;
          slideFocus[idx - 1][0].setAttribute('tabindex', '0');
          slideFocus[idx - 1][0].focus();
          removeSlideTabindex();
          onClickNavigation = false;
          prevEnter = false;
        };
      };
    };
  };

  /* ----- slider ----- */

  const banerSwiper = new Swiper('.banner-swiper', {
    autoplay:false,
    loop: false, // 반복 재생 여부
    slidesPerView: 1, // 한 번에 보여줄 슬라이드 개수
    spaceBetween: 30, // 슬라이드 사이 여백
    navigation: {
      nextEl: '.banner-next',
      prevEl: '.banner-prev',
    },
    pagination: {
      el: ".banner-pagination",
      type: "fraction",
    },
    observer: true,
    observeParents: true,
    a11y: {
      prevSlideMessage: '이전 슬라이드',
      nextSlideMessage: '다음 슬라이드',
      slideLabelMessage: '총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.',
  },on: {
    init: function() {
      thisSlide = this;
      slideAll = document.querySelectorAll('.swiper-slide');
      slideLength = slideAll.length - 1;
      navigations['prev'] = document.querySelector('.banner-prev');
      navigations['next'] = document.querySelector('.banner-next');
      slideAll.forEach((element, idx) => {
        slideAll[thisSlide.activeIndex].setAttribute('tabindex', '0');
        let focusTarget = Array.prototype.slice.call(element.querySelectorAll('a, button, input, [role="button"], textarea, select, [tabindex="0"]'));
        focusTarget.forEach((el, i) => {
          if (el.closest('.swiper-slide') !== slideAll[thisSlide.activeIndex]) {
            el.setAttribute('tabindex', '-1');
          };
        });
        slideFocus[idx] = Array.prototype.slice.call(element.querySelectorAll('a, button, input, [role="button"], textarea, select, [tabindex="0"]')); 
        slideFocus[idx].unshift(element);
        slideFocus[idx][0].addEventListener('keydown', (e) => slideKeyDownEvt(e, idx));
      });
      Object.values(navigations).forEach((navigation) => {
        navigation.addEventListener('keydown', () => {
          onClickNavigation = true;
        });
      });
      navigations['next'].addEventListener('keydown', (e) => slideFocusAct(e, thisSlide.activeIndex, true));
      navigations['prev'].addEventListener('keydown', (e) => slideFocusAct(e, thisSlide.activeIndex, false));
    },
    touchMove: function() {
      return onClickNavigation = false;
    },
    slideNextTransitionEnd: function() {
      // 키보드 탭 버튼으로 인한 슬라이드 변경 시 동작
      if (focusOut) {
        slideFocus[this.realIndex][0].focus();
        focusOut = false;
      };
    },
    slidePrevTransitionStart: function() {
      // 키보드 탭 버튼으로 인한 슬라이드 변경 시 동작
      if (focusOut) {
        slideFocus[this.realIndex][slideFocus[this.realIndex].length - 1].focus();
        focusOut = false;
      };
    },
  },
  })

  $(".banner-stop").click(function(){
    banerSwiper.autoplay.stop()
    $(".banner-stop").addClass("on")
    $(".banner-play").removeClass("on")
  })
  $(".banner-play").click(function(){
    banerSwiper.autoplay.start()
    $(".banner-play").addClass("on")
    $(".banner-stop").removeClass("on")
  })






});


/* ----- Window Size ----- */
var windowh = $(window).height();
var windowW = $(window).width();


$(window).on("resize", function(){
  windowh = $(window).height();
  windowW = $(window).width();
});


/* ----- menu ----- */
function menu() {

  $(document).on("mousemove", function(e){
      if (windowW > 1200 && e.pageY > 410) {
          $("nav#main-menu").removeClass("on");
          $("#header").removeClass("on");
          $("button.main-menu").removeClass("on");
          $("nav#main-menu button.close").removeClass("on");
          $("div.shadow").removeClass("on");
      }
  });

  

  $("div.tools-open button.main-menu").on("click", function () {
      $("nav#main-menu").addClass("on");
      $("#header").addClass("on");
      $("button.main-menu").addClass("on");
      $("nav#main-menu button.close").addClass("on");
      $("div.shadow").addClass("on");
  });

  $("nav#main-menu button.close").on("click", function () {
      $("nav#main-menu").removeClass("on");
      $("#header").removeClass("on");
      $("button.main-menu").removeClass("on");
      $("nav#main-menu button.close").removeClass("on");
      $("div.shadow").removeClass("on");
  });

  $("nav#main-menu h3 a").on("click", function (e) {
      
      $("nav#main-menu h3").removeClass("on");



      if (windowW < 1200 && $(this).parent().parent().find("ul").length) {

          $(this).parent().addClass("on");
          e.preventDefault();

      }
      else {
          $("nav#main-menu h3 a").unbind();

      }
  });

  $("nav#main-menu h3 ").on("mouseenter", function(){
      $("#main-menu").addClass("on");
      $("#header").addClass("on");
      $("button.main-menu").addClass("on");
      $("nav#main-menu button.close").addClass("on");
  });
  $("div#content").on("mouseover", function(){
      $("nav#main-menu button.close").removeClass("on");
  });

  //focus
  $("nav#main-menu .menus ul li:first-child a").on("focus",function(){
    $("nav#main-menu").addClass("on");
      $("#header").addClass("on");
      $("button.main-menu").addClass("on");
      $("nav#main-menu button.close").addClass("on");
      $("div.shadow").addClass("on");
  })
  $("nav#main-menu button.close").on("blur",function(){
    $("nav#main-menu").removeClass("on");
      $("#header").removeClass("on");
      $("button.main-menu").removeClass("on");
      $("nav#main-menu button.close").removeClass("on");
      $("div.shadow").removeClass("on");
  })


  var subToggle = "0";

  $(".sub-head a.depth2-link").on("click", function(){

    if (windowW < 1200) {

        if (subToggle == "1") {
    
            $(this).parent().removeClass("on");
            $(".shadow").removeClass("active");
            subToggle = "0";
    
        } else if (windowW < 1200 || subToggle == "0") {
    
            $(this).parent().addClass("on");
            $(".shadow").addClass("active");
            subToggle = "1";
    
        }
    
        if ($(this).parent().hasClass("depth2")) {
            $(".sub-head div.depth1").removeClass("on");
        }
    


    }


  });





}



/* ----- main tab ----- */ 
function maintab() {

  $(".main-content .news h3").on("click", function(){
      $(".main-content .news h3").removeClass("active");
      $(this).addClass("active");

      $(".main-content .news .tab-data").removeClass("active");
      
      $(".main-content .news ."+ $(this).attr("data") +"").addClass("active");

  });
}

// 포커스
function anifocus(){

  // 메인 메뉴
  $("section.main-menu ul li a").on("focusin",function(){
    $(this).parent().addClass("focus")
    
  });
  $("section.main-menu ul li a").on("focusout",function(){
    $(this).parent().removeClass("focus")
    
  });

  //푸터
  
  $(".agency-open").focusin(function() {
    $(this).addClass("on");
});
  $(".agency-link a").last().focusout(function() {
    $(".agency-open").removeClass("on");
});
}

/* ----- outlink ----- */ 
function outlink() {
  $(".agency-open").click(function() {
      $(this).toggleClass("on");
  });
}
















