var adjectives = ['Optimistic', 'Growing', 'Passionate', 'Persistent', 'Patient', 'Creative', 'Driven'],
    nouns = ['Creator', 'Programmer', 'Engineer', 'Scholar', 'Software Developer', 'Music Lover'],
    navBarConst = 300;

var getRandom = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var init = function() {
  var navBar = document.querySelector('.navbar'),
      navButtons = document.querySelector('.navbar-buttons'),
      navBarButtons = document.querySelectorAll('.navbar-button'),
      title = document.querySelector('.title'),
      adjective = '',
      noun = '',
      sections = document.querySelectorAll('section'),
      stars = document.querySelector('.stars'),
      twinkling = document.querySelector('.twinkling'),
      speed = .05,
      homePage = document.querySelector('.home-page'),
      info = document.querySelector('.info'),
      projects = document.querySelectorAll('.project');

  var changeNavBar = function(e) {
    var scroll = window.scrollY;

    if (scroll < 0) {
      navBar.style.backgroundColor = 'rgba(255, 255, 255, 0)';
      navBar.style.height = '80px';
      navBar.classList.remove('shadow');
      navButtons.style.height = '80px';
      [].forEach.call(navBarButtons, function(button) {
        button.style.margin = '25px 23px';
        button.style.color = '#FFF';
      })
    } else if (scroll > navBarConst) {
      navBar.style.backgroundColor = 'rgba(255, 255, 255, 1)';
      navBar.style.height = '60px';
      navBar.classList.add('shadow');
      navButtons.style.height = '60px';
      [].forEach.call(navBarButtons, function(button) {
        button.style.margin = '15px 23px';
        button.style.color = '#424242';
      })
    } else {
      var opacity = parseFloat((scroll / navBarConst).toFixed(2)),
          height = 80 - Math.round(20 * parseFloat(scroll / navBarConst)),
          margin = 25 - Math.round(10 * parseFloat(scroll / navBarConst));

      navBar.style.backgroundColor = 'rgba(255, 255, 255, ' + opacity + ')';
      navBar.style.height = height + 'px';
      navBar.classList.remove('shadow');
      navButtons.style.height = height + 'px';
      [].forEach.call(navBarButtons, function(button) {
        button.style.margin = margin + 'px 23px';
        button.style.color = opacity > .5 ? '#424242' : '#FFF';
      })
    }
  };

  var getNewWord = function(word, arr) {
    var newWord = getRandom(arr);
    return word !== newWord ? newWord : getNewWord(word, arr);
  };

  var changeTitle = function(interval) {
    title.classList.add('changing');
    setTimeout(function() {
      adjective = getNewWord(adjective, adjectives);
      noun = getNewWord(noun, nouns);
      title.innerHTML = adjective + ' ' + noun;
      title.classList.remove('changing');
    }, interval);
  };

  var scrollTo = function(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
  };

  var scrollToButton = function(e, button) {
    e.preventDefault();
    var section = document.querySelector('#' + button.dataset.link);
    scrollTo(document.body, section.offsetTop, 300);
  };

  var checkHighlight = function(e) {
    var scroll = window.scrollY;

    [].forEach.call(navBarButtons, function(button) {
      var section = document.querySelector('#' + button.dataset.link),
          highlightAt = section.offsetTop,
          unhighlightAt = section.offsetTop + section.offsetHeight;

      if (scroll < 0 && button.dataset.link === 'home') {
        button.classList.add('active');
      } else if (scroll >= highlightAt && scroll < unhighlightAt) {
        button.classList.add('active');
      } else {
        if (button.dataset.link === 'portfolio') {
          if (scroll < highlightAt) {
            button.classList.remove('active');
          }
        } else {
          button.classList.remove('active');
        }
      }
    });
  };

  var checkFade = function(e) {
    var scroll = window.scrollY;
    [].forEach.call(sections, function(section) {
      var sectionHeight = section.offsetHeight,
          sectionTop = section.offsetTop;
      var startFadeIn = sectionTop - sectionHeight;
      var endFadeOut = startFadeIn + (sectionHeight * 2);

      if (scroll < startFadeIn || scroll > endFadeOut) {
        section.style.opacity = '0';
      } else {
        var diff = Math.abs(scroll - sectionTop);
        if (diff > sectionHeight / 4) {
          diff = diff - (sectionHeight / 4);
          var opacity = 1 - Math.abs(parseFloat(diff / (sectionHeight / 2)).toFixed(2));
          section.style.opacity = opacity.toString();
        } else {
          section.style.opacity = '1';
        }
      }
    });
  };

  var scrollStars = function(e) {
    var windowYOffset = window.pageYOffset;
    var change = Math.round(windowYOffset * speed);
    var backgroundPos = "50% -" + change + "px";

    stars.style.backgroundPosition = backgroundPos;
    twinkling.style.backgroundPosition = backgroundPos;
  };

  var isInViewport = function(element) {
    element = element.parentElement;
    var top = window.scrollY;
    var bottom = top + window.innerHeight;

    var elemTop = element.offsetTop;
    var elemBottom = elemTop + element.offsetHeight;

    return bottom > elemTop && top < elemBottom;
  };

  var calcTilt = function(element, e) {
    var top = element.offsetTop;
    var left = element.offsetLeft;
    var elemY = top + (element.offsetHeight / 2);
    var elemX = left + (element.offsetWidth / 2);

    var x = e.clientX;
    var y = e.clientY;

    var rotateX = (elemY - y) / 40;
    var rotateY = (elemX - x) / 40;

    return `rotateX(${rotateX}deg) rotateY(${-rotateY}deg)`;
  };

  var mouseTilt = function(e) {
    if (isInViewport(homePage)) {
      homePage.style.transform = calcTilt(homePage, e);
    }

    if (isInViewport(info)) {
      info.style.transform = calcTilt(info, e);
    }

    [].forEach.call(projects, function(project) {
      if (isInViewport(project)) {
        project.style.transform = calcTilt(project, e);
      }
    });
  };

  window.addEventListener('scroll', changeNavBar);

  changeTitle(0);
  setInterval(changeTitle, 5000);

  [].forEach.call(navBarButtons, function(button) {
    button.addEventListener('click', (e) => scrollToButton(e, button));
  });

  checkHighlight();
  window.addEventListener('scroll', checkHighlight);

  window.addEventListener('scroll', checkFade);

  window.addEventListener('scroll', scrollStars);

  window.addEventListener('mousemove', mouseTilt);
};

window.onload = init();
