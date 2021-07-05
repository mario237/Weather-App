
$(window).on('load', () => {
    if ($('.page-load').length) {
        $('.page-load').delay(100).fadeOut('slow', () => {
            $(this).remove();
        });
    }
});


$('nav .container .mobile-nav-icon').on('click', function () {

    $('.mobile-nav ul').slideToggle();
})

const baseURL = 'https://api.weatherapi.com/v1/forecast.json?key=b0f2570530464a8eb1f75542212904&days=3&q=';


function setDates() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


    let date = new Date();

    let currentDay = date.getDay();


    $('.today .head .day').html(dayNames[currentDay])

    $('.today .head .date').html(date.getDate() + monthNames[date.getMonth()])

    if (currentDay == dayNames.length - 1) {
        $('.tomorrow .head .day').html(dayNames[0])

        $('.day-after .head .day').html(dayNames[1])
    }
    else {
        $('.tomorrow .head .day').html(dayNames[currentDay + 1])

        if (currentDay + 1 == dayNames.length - 1) {
            $('.day-after .head .day').html(dayNames[0])
        } else {
            $('.day-after .head .day').html(dayNames[currentDay + 2])
        }
    }

};


setDates()

getWeatherDataFromApi(baseURL + 'cairo')
    .then(function (data) {
        updateUI(data);
    })


$('#findLocation').on('input', getInputData)



function getInputData() {
    getWeatherDataFromApi(baseURL + this.value)
        .then(function (data) {
            updateUI(data);
        })
}


async function getWeatherDataFromApi(url) {
    try {
        let data = await fetch(url);

        let convert = await data.json();

        return convert;

    } catch (error) {
        console.log('error ' + error);
    }

}





function updateUI(data) {
    if (!data.error) {

        //today
        $('.today .info .city').html(data.location.name)
        $('.today .degree').html(`${data.current.temp_c}<sup>o</sup>C`);
        $('.today .weather-icon').attr('src', `https:${data.current.condition.icon}`);
        $('.today .state').html(data.forecast.forecastday[0].day.condition.text);

        //tomorrow
        $('.tomorrow .weather-icon').attr('src', `https:${data.forecast.forecastday[1].day.condition.icon}`);
        $('.tomorrow .high-degree').html(`${data.forecast.forecastday[1].day.maxtemp_c}<sup>o</sup>C`);
        $('.tomorrow .low-degree').html(`${data.forecast.forecastday[1].day.mintemp_c}<sup>o</sup>C`);
        $('.tomorrow .state').html(data.forecast.forecastday[1].day.condition.text);


        //day-after
        $('.day-after .weather-icon').attr('src', `https:${data.forecast.forecastday[2].day.condition.icon}`);
        $('.day-after .high-degree').html(`${data.forecast.forecastday[2].day.maxtemp_c}<sup>o</sup>C`);
        $('.day-after .low-degree').html(`${data.forecast.forecastday[2].day.mintemp_c}<sup>o</sup>C`);
        $('.day-after .state').html(data.forecast.forecastday[2].day.condition.text);

    }

}