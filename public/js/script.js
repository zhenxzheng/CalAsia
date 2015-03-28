/*

CalAsia.Org Custom JS
============

Author:  
Updated: March 2015
Notes:	 Hand coded for California-Asia Business Council (Cal-Asia)

*/

$(document).ready(function() {
	$(".menubox").hide();

	$(".menuitem").click(function(event) {
		event.preventDefault();
		$(".menubox").hide();
		var relatedDivID = $(this).attr('href');

		$("" + relatedDivID).fadeToggle("fast", "linear");

	});
});

    
    $('#toggle-view li h3, #toggle-view li strong').click(function () {
        var text = $(this).parent().children('div.panel');
        if (text.is(':hidden')) {
            text.slideDown('200');
            $(this).children('span').html('-');        
        } else {
            text.slideUp('200');
            $(this).children('span').html('+');        
        }
        
    });
