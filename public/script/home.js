const header = document.querySelector('nav');
const jumbotron = document.querySelector('.jumbotron-fluid');
const options = {
    threshold: 0.2
};

const navIntersectionObserver = new IntersectionObserver((entries)=> {
    if (entries[0].isIntersecting) 
        header.classList.remove('bg-visible');
    else
        header.classList.add('bg-visible');
}, options);

navIntersectionObserver.observe(jumbotron);

