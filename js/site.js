$(function () {

    $('#controls').focus();

    $.backstretch(backgroundimages, {duration: 3000});

    var songTitles = [];
    $.each(songs, function (i, s) {
        songTitles.push(s.title);
    });

    $('#search').autocomplete({
        source: songTitles
    });

    $('.slides-wrapper').keydown(function (e) {
        var key = e.keyCode || e.which;
        if (key == 66 || key == 87) {
            switch (key) {
                case 66:
                    $('.block-wrapper').css('background-color', 'black');
                    break;
                case 87:
                    $('.block-wrapper').css('background-color', 'white');
                    break;
            }

            var isActive = parseInt($('.block-wrapper').attr('data-active'));
            if (isActive === 0) {
                $('.block-wrapper').show();
                $('.block-wrapper').attr('data-active','1');
            }
            else if (isActive === 1) {
                $('.block-wrapper').hide();
                $('.block-wrapper').attr('data-active','0');
            }
        }
    });

    $('#search').keyup(function (e) {
        var slides = '';
        var searchKeyword = $(this).val();
        var key = e.keyCode || e.which;
        if (key == 13) {
            $('.alert-wrapper').html('');
            $.each(songs, function (i_s, s) {
                if (s.title === searchKeyword) {
                    var randomNumber = Math.floor(Math.random() * backgroundimages.length + 1);
                    if (randomNumber === 0 || randomNumber > backgroundimages.length) {
                        randomNumber = 1;
                    }
                    $.backstretch(bgImagePath + randomNumber + '.jpg');
                    $('.slides-wrapper').css('background-color','rgba(0,0,0,0.5)');
                    slides = '<div class="song-title">' + s.title + '</div>';
                    $.each(s.artists_id, function (i_aId, aId) {
                        $.each(artists, function (i_a, a) {
                            if (aId === a.artist_id) {
                                slides += '<div class="song-artist">' + a.artist + '</div>';
                                return false;
                            }
                        });
                    });                    
                    slides += '<div class="song-released-year">(' + s.released + ')</div>';
                    $.each(s.sections_sequence, function (i_ss, section_id) {
                        slides += '<div class="slide" id="slide_' + i_ss + '" data-active-slide="';
                        if (i_ss > 0) {
                            slides += '0" style="display:none;"';
                        }
                        else {
                            slides += '1"';
                        }
                        slides += '>';
                        $.each(s.lyrics, function (i_l, l) {
                            if (section_id === l.section_id) {
                                slides += '<div class="song-section">' + l.section + '</div>';
                                slides += '<div class="section-contents-wrapper">';
                                $.each(l.text, function (i_t, lyrics) {
                                    slides += '<div class="section-content">' + lyrics + '</div>';
                                });
                                slides += '</div>';
                                return false;
                            }
                        });
                        slides += '</div>';
                    });
                    slides += '<div class="slide" id="slide_' + s.sections_sequence.length + '" data-active-slide="0" style="display:none;">';
                    slides += '<div class="section-contents-wrapper"><div class="section-content"></div></div></div>';
                    return false;
                }
                else {
                    if (i_s === songs.length - 1) {
                        if (searchKeyword === '') {
                            $.backstretch(backgroundimages, {duration: 3000});
                            $('.slides-wrapper').css('background-color','rgba(0,0,0,0)');
                        }      
                        else {
                            $.backstretch("destroy");
                            $('.slides-wrapper').css('background-color','green');
                            $('.alert-wrapper').html('<div class="alert-search">Search not found for \'' + searchKeyword + '\'.</div>');
                        }                          
                    }
                }
            });
            $('#slides').html(slides);
            $(this).blur();
            $('#controls').focus();
        }
    });

    $(window).keydown(function (e) {
        var key = e.keyCode || e.which;
        if ((key == 39) || (key == 40)) {
            slider('next');
        }
        if ((key == 37) || (key == 38)) {
            slider('prev');
        }
    });

});

function slider(action) {
    $('.slide').each(function () {
        var slideIsActive = parseInt($(this).attr('data-active-slide'));
        if (slideIsActive === 1) {
            var currentSlideNum = parseInt($(this).attr('id').replace('slide_',''));
            if (action === 'next') {
                currentSlideNum = currentSlideNum + 1;
            }
            else if (action === "prev") {
                currentSlideNum = currentSlideNum - 1;
            }
            if (currentSlideNum >= 0 && currentSlideNum < $('.slide').length) {
                $('.slide').hide();
                $('.slide').attr('data-active-slide', '0');
                $('#slide_' + (currentSlideNum).toString()).show();
                $('#slide_' + (currentSlideNum).toString()).attr('data-active-slide', '1');
            }
            return false;
        }
    });
}