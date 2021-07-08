;(function () {
	
	'use strict';

	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
			BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
			iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
			Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
			Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
			any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	
	var fullHeight = function() {

		if ( !isMobile.any() ) {
			$('.js-fullheight').css('height', $(window).height());
			$(window).resize(function(){
				$('.js-fullheight').css('height', $(window).height());
			});
		}
	};

	// Parallax
	var parallax = function() {
		$(window).stellar();
	};

	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 100, 'easeInOutExpo' );
					});
					
				}, 50);
				
			}

		} , { offset: '85%' } );
	};



	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};

	var pieChart = function() {
		$('.chart').easyPieChart({
			scaleColor: false,
			lineWidth: 4,
			lineCap: 'butt',
			barColor: '#FF9000',
			trackColor:	"#f5f5f5",
			size: 160,
			animate: 1000
		});
	};

	var skillsWayPoint = function() {
		if ($('#fh5co-skills').length > 0 ) {
			$('#fh5co-skills').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( pieChart , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}

	};


	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	$(function(){
		Handlebars.registerHelper("isOdd", num => num % 2 != 0);
		Handlebars.registerHelper("isEven", num => num % 2 == 0);
		Handlebars.registerHelper("isModN", (x, y, n) => x % y == n);
		Handlebars.registerHelper("isLastItemOfArray", (index, array) => index == array.length - 1);
		Handlebars.registerHelper("formatDate", (dateString, pattern) => new Date(Date.parse(dateString)).format(pattern));
		Handlebars.registerHelper("arrayChunks", (array, size) => {
			var result = [];
			var lastIndex = -1;
			array.forEach((item, index) => {
				if(index % size == 0) result[++lastIndex] = [];
				result[lastIndex].push(item);
			});
			return result;
		});

		var onPageLoad = () => {
			contentWayPoint();
			goToTop();
			loaderPage();
			fullHeight();
			parallax();
			// pieChart();
			skillsWayPoint();
		};

		var loadedCount = 0;
		var attachTemplate = (name, data, target, onLoad) => {
			$.get(`/templates/${name}.handlebars`, templateHtml => {
				var template = Handlebars.compile(templateHtml);
				var compiledHtml = template(data);
				var htmlEl = $(compiledHtml);
				target.append(htmlEl);
				++loadedCount;
				onLoad();
			});
		};

		var attachSocialCards = data => {
			['facebook', 'twitter'].forEach(social => {
				$.get(`/templates/social/cards/${social}.handlebars`, templateHtml => {
					var template = Handlebars.compile(templateHtml);
					$('head').append($(template(data)));
				});
			});
		};

		$.get('/js/data.json').done(data => {
			const target = $('#page');
			const templates = [
				'header', 'about', 'resume', 'skills', 'strengths', 
				'achievements', 'blogs', 'jobRequest', 'connect', 'footer'
			];

			var attachNextTemplate = () => {
				if(loadedCount == templates.length) onPageLoad();
				else attachTemplate(templates[loadedCount], data, target, attachNextTemplate);
			};
			attachNextTemplate();
			attachSocialCards(data);
		});
	});

}());