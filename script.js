const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies'),
    api = 'a5fbea0d07b256ed534002b62cae1500',
    urlPoster = 'https://image.tmdb.org/t/p/w500';

// Получения и обработка события
const apiSearch = event => {
        event.preventDefault();
        const searchText = document.querySelector('.form-control').value;
        if (searchText.trim().length === 0) {
            movie.innerHTML = '<h2 class="col-12 text-center text-danger">Поле поиска не должно быть пустым</h2>';
            return;
        }
        const server = `https://api.themoviedb.org/3/search/multi?api_key=${api}&language=ru&query=${searchText}`;
        movie.innerHTML = '<div class="spiner"></div>';
        fetch(server)
            .then(value => {
                if (value.status !== 200) {
                    return Promise.reject(new Error(value.status));
                }

                return value.json();
            })
            .then(outPut => {
                const url = '';
                let inner = '';
                if (outPut.results.length === 0) {
                    inner = '<h2 class="col-12 text-center text-info">По вашему запросу ничего не найдено</h2>';
                }
                ;
                outPut.results.forEach(item => {
                    let nameItem = item.name || item.title,
                        dateItem = item.release_date || item.first_air_date,
                        dataInfo = '';
                    if (item.media_type !== 'person') dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                    const poster = item.poster_path ? urlPoster + item.poster_path : 'img/not_poster.jpg',
                        relise = dateItem ? getDate(dateItem) : 'Дата неизвестна';
                    inner += `<div class="col-12 col-md-6 col-xl-3 item"> <img src="${poster}" 
                alt="${nameItem}" ${dataInfo} class="img-poster"> 
                <h5>${nameItem}</h5>
                ${relise}</div>`;
                });
                movie.innerHTML = inner;

                addEventMedia();
            })
            .catch(reason => {
                movie.innerHTML = 'Упс, что-то пошло не так...';
                console.log('error:' + reason);
            });
    },

    // Изменение формата времени
    getDate = date => {
        return new Date(date).toLocaleString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

// Отслеживание события
searchForm.addEventListener('submit', apiSearch);

const addEventMedia = () => {
    const media = movie.querySelectorAll('img[data-id]');
    media.forEach(elem => {
        elem.style.cursor = 'pointer';
        elem.addEventListener('click', showFullInfo);
    });
}

function showFullInfo() {
    let urlServer = '';
    if (this.dataset.type === 'movie') {
        urlServer = `https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=${api}&language=ru`;
    } else if (this.dataset.type === 'tv') {
        urlServer = `https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=${api}&language=ru`;
    } else {
        urlServer = '<h2 class="col-12 text-center text-danger">Произошла ошибка повторите позже</h2>';
    }
    ;

    fetch(urlServer)
        .then(value => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }

            return value.json();
        })
        .then(outPut => {
            console.log(outPut);
            movie.innerHTML = `<h4 class="col-12 text-center text-info">${outPut.name || outPut.title}</h4>
            <div class="col-4">
                <img src="${outPut.poster_path ? urlPoster + outPut.poster_path : 'img/not_poster.jpg'}" alt="${outPut.name || outPut.title}">
                ${(outPut.homepage) ? `<p class"text-center"><a href="${outPut.homepage}" target="_blank">Официальная страница</a></p>` : ''}
                ${(outPut.imdb_id) ? `<p class"text-center"><a href="https://imdb.com/title/${outPut.imdb_id}" target="_blank">Страница на IMDB.com</a></p>` : ''}
            </div>
            <div class="col-8">
                <p><strong>Рейтинг:</strong> ${outPut.vote_average}</p>
                <p><strong>Статус:</strong> ${outPut.status}</p>
                <p><strong>Премьера:</strong> ${getDate(outPut.release_date || outPut.first_air_date)}</p>
                <p><strong>Описание:</strong> ${outPut.overview}</p>

                <br>

                <div class="youtube"></div>
            </div>
            `;
            getVideo(this.dataset.type, this.dataset.id);

        })
        .catch(reason => {
            movie.innerHTML = 'Упс, что-то пошло не так...';
            console.log('error:' + reason);
        });

};

document.addEventListener('DOMContentLoaded', () => {
    fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${api}&language=ru`)
        .then(value => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }

            return value.json();
        })
        .then(outPut => {
            const url = '';
            let inner = '<h2 class="col-12 text-center text-info">Популярные сегодня</h2>';

            outPut.results.forEach(item => {
                console.log(item.type);
                let nameItem = item.name || item.title,
                    dateItem = item.release_date || item.first_air_date,
                    dataInfo = `data-id="${item.id}" data-type="${item.media_type}"`;
                const poster = item.poster_path ? urlPoster + item.poster_path : 'img/not_poster.jpg',
                    relise = dateItem ? getDate(dateItem) : 'Дата неизвестна';
                inner += `<div class="col-12 col-md-6 col-xl-3 item"> <img src="${poster}" 
                alt="${nameItem}" ${dataInfo} class="img-poster"> 
                <h5>${nameItem}</h5>
                ${relise}</div>`;
            });
            movie.innerHTML = inner;

            addEventMedia();
        })
        .catch(reason => {
            movie.innerHTML = 'Упс, что-то пошло не так...';
            console.log('error:' + reason);
        });
});

function getVideo(type, id) {
    let youtube = movie.querySelector('.youtube');

    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${api}&language=ru`)
        .then(value => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }

            return value.json();
        })
        .then(outPut => {

            let videoFrame = '<h5 class="text-info">Трейлеры</h5>';
            if (outPut.results.length === 0) {
                videoFrame = '<p>Видео отсутствует!</p>'
            }
            outPut.results.forEach(item => {
                videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            });
            youtube.innerHTML = videoFrame;
        })
        .catch(reason => {
            youtube.innerHTML = 'Видео отсутствует!';
            console.log('error:' + reason);
        });

    youtube.innerHTML = type;
    console.log(youtube);
};
