        $(document).ready(function() {
            // Animate accordion items when they open
            $('.accordion-button').on('click', function() {
                if (!$(this).hasClass('collapsed')) {
                    $(this).find('i').addClass('animate__animated animate__pulse');
                    setTimeout(() => {
                        $(this).find('i').removeClass('animate__animated animate__pulse');
                    }, 1000);
                }
            });
            
            // Back to top button
            $(window).scroll(function() {
                if ($(this).scrollTop() > 300) {
                    $('.back-to-top').addClass('active');
                } else {
                    $('.back-to-top').removeClass('active');
                }
            });
            
            $('.back-to-top').click(function(e) {
                e.preventDefault();
                $('html, body').animate({scrollTop: 0}, '300');
            });
            
            // Add animation to elements when they come into view
            function animateOnScroll() {
                $('.accordion-item').each(function() {
                    var position = $(this).offset().top;
                    var scroll = $(window).scrollTop();
                    var windowHeight = $(window).height();
                    
                    if (scroll + windowHeight > position + 100) {
                        $(this).addClass('animate__animated animate__fadeInUp');
                    }
                });
            }
            
            $(window).scroll(animateOnScroll);
            animateOnScroll();
            
            // Add ripple effect to buttons
            $('.accordion-button, .btn').on('click', function(e) {
                var x = e.pageX - $(this).offset().left;
                var y = e.pageY - $(this).offset().top;
                
                var ripple = $('<span class="ripple-effect"></span>');
                ripple.css({
                    'top': y,
                    'left': x
                });
                
                $(this).append(ripple);
                
                setTimeout(function() {
                    ripple.remove();
                }, 1000);
            });
        });