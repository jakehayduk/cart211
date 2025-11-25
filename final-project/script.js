$(document).ready(function() {

    let answers = []
    let question = 0;
    let soldValue = 0;
    let darkMode = false;

    let survey = ["What is your name?", "What city were you born in?", "How old are you?", "When looking for a new product or service, what is your primary decision-making criteria?", "What is your childhood friend's name?", "If you were guaranteed to succeed, what is one major life goal you would pursue in the next 12 months?"]

    $('.start-button').on('click', function() {
        $('.start-screen').hide();
        $('.survey').css('display', 'flex');
        
        $('.question').text(survey[question]);
        question++;
    })

    $('.next-button').on('click', function() {
        next();
    })

    $('.logo').on('click', function() {
        if (darkMode == false) {
            darkMode = true;
            $(':root').css('--primary', 'white');
            $(':root').css('--secondary', 'black');
            $('.logo').css('filter', 'invert()');
            $('.data-block-left img').css('filter', 'invert()');
        }

        else {
            darkMode = false;
            $(':root').css('--primary', 'black');
            $(':root').css('--secondary', 'white');
            $('.logo').css('filter', 'none');
            $('.data-block-left img').css('filter', 'none');
        }
    })

    $(document).on('keypress',function(e) {
        if(e.which == 13) {
            next();
        }
    });

    function next() {
        if ($('.answer').val().length > 1 && question < 7) {
            $('.question').text(survey[question]);
            answers.push($('.answer').val())
            $('.answer').val('');
            question++;
        }
        if (question > 6) {
            $('.survey').hide();
            $('.end-screen').css('display', 'flex');
            $('.data-1').text(answers[0]);
            $('.data-2').text(answers[1]);
            $('.data-3').text(answers[2]);
            $('.data-4').text(answers[3]);
            $('.data-5').text(answers[4]);
            $('.data-6').text(answers[5]);
            soldValue = Math.floor(Math.random() * (10 * 100 - 1 * 100) + 1 * 100) / (1*100)
            $('.sold-amount').text('+ $' + soldValue);
            $('.cube').css('animation', 'cube-in 1s');
            addData();
        }
    }

    $('.nav-button').on('click', function() {
        $('.modal').css('display', 'grid');
        $('.modal-close').show();
    })
    
    $('.modal-close').on('click', function() {
        $('.modal').hide();
        $('.modal-close').hide();
    })

    // CUBE

    let initialX = -20;
    let initialY = -20;
    let x = initialX;
    let y = initialY;
    let x2 = initialX;
    let y2 = initialY;
    let x3 = initialX;
    let y3 = initialY;
    let xSave = initialX;
    let ySave = initialY;
    let dragging = false;
    let zoom = 1.4;

    $(document).on('touchstart', function(e) {
        dragging = true;
        xSave = e.touches[0].clientX;
        ySave = e.touches[0].clientY;
    })

    $(document).on('touchend', function() {
        dragging = false;
        x2 = x;
        y2 = y;
    })

    $(document).on('touchmove', function(e) {
        if (dragging == true) {
            // divide by zoom variable instead of a static number like 10 so that the cube rotates faster when zoomed out and slower when zoomed in.
            x = ((e.touches[0].clientX - xSave)/(zoom*3)) + x2;
            y = -((e.touches[0].clientY - ySave)/(zoom*3)) + y2;
        }
    })

    $(document).mousedown(function(e) {
        dragging = true;
        xSave = e.pageX;
        ySave = e.pageY;
    })

    $(document).mouseup(function() {
        dragging = false;
        x2 = x;
        y2 = y;
    })

    $(document).on('mousemove', function(e) {
        if (dragging == true) {
            // divide by zoom variable instead of a static number like 10 so that the cube rotates faster when zoomed out and slower when zoomed in.
            x = ((e.pageX - xSave)/(zoom*5)) + x2;
            y = -((e.pageY - ySave)/(zoom*5)) + y2;
        }
    })

    setInterval(function() {
        x3 = lerp(x3, x, 0.03);
        y3 = lerp(y3, y, 0.03);

        $('.cube').css('transform', 'rotateY(' + x3 + 'deg)');
        $('.cube').css('rotate', 'x ' + y3 + 'deg');
    
    }, 1)

    function lerp(a, b, n) {
        return (1 - n) * a + n * b;
    }

    $(window).bind('mousewheel', function(event) {
        if (zoom <= 1.4 && zoom >= 0.5) {
            if (event.originalEvent.wheelDelta >= 0) {
                zoom = zoom + 0.2;
                $('.container').css('transform', 'scale(' + zoom + ')');
            }
    
            else {
                zoom = zoom - 0.2;
                $('.container').css('transform', 'scale(' + zoom + ')');
            }
        }

        else if (zoom > 1.4) {
            zoom = 1.4;
        }

        else if (zoom < 0.5) {
            zoom = 0.5;
        }
    });

    // FIREBASE DATABASE
    
    const db = firebase.firestore();

    let blocksRef;
    let unsubscribe;
    
    blocksRef = db.collection('blocks');

    function addData() {

        const { serverTimestamp } = firebase.firestore.FieldValue;

        blocksRef.add({
            name: answers[0],
            city: answers[1],
            age: answers[2],
            criteria: answers[3],
            friend: answers[4],
            goal: answers[5],
            price: soldValue,
            timestamp: serverTimestamp()
        })
    }

    blocksRef.onSnapshot(querySnapshot => {
        $('.modal-content').html('');
        
        querySnapshot.docs.forEach((doc) => {

            const data = doc.data();

            $('.modal-content').append("<div class='data-block' id='" + doc.id + "'><div class='data-block-left'><img src='./images/logo.png'><span>Sold for $" + data.price + "</span></div><div><h3>" + data.name + "</h3><small class='identifier'>" + doc.id + "</small><br><small>" + Date(data.timestamp) + "</small></div></div>")

            // $('.data-block').html($('.data-block').html() + '<li>' + data.name + '</li>');
        })
    })

    $('body').on('click', '.data-block', function() {
        
        let docRef = blocksRef.doc($(this).attr('id'));
        docRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                $('.modal-cube-data-1').text(data.name);
                $('.modal-cube-data-2').text(data.city);
                $('.modal-cube-data-3').text(data.age);
                $('.modal-cube-data-4').text(data.criteria);
                $('.modal-cube-data-5').text(data.friend);
                $('.modal-cube-data-6').text(data.goal);

                $('.modal-cube h2').text(data.name + '\'s data block');

                $('.modal-cube').css('display', 'flex');
                $('.modal-cube-close').show();
            }
            else {
                console.log('No such document.');
            }
        })
    })

    $('.modal-cube-close').on('click', function() {
        $('.modal-cube').hide();
        $('.modal-cube-close').hide();
    })
})