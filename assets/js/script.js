
let footer = `© ${(new Date).getFullYear()}, <a href="https://kwaneles.com/">kwaneles.com</a>`
document.querySelector("footer").innerHTML = footer

const slide_items = document.querySelectorAll('.slide-item'),
        controls = document.querySelectorAll('.control')

let current_slide = 0

const slider = {
    init: () => {
        controls.forEach(
            control => control.addEventListener('click', (e) => {
                slider.clicked_control(e)
            })
        )
        slide_items[current_slide].classList.add('active')
    },

    clicked_control: (e) => {
        // add active class to corresponding slide
        slider.reset()

        const control = e.target
        const data_index = Number(control.dataset.index)

        control.classList.add('active')
        slide_items.forEach((slide_item, index) => {
                if(index === data_index){
                    // add active class to corresponding slide
                    slide_item.classList.add('active')
                }
            }
        )
        current_slide = data_index
    },

    reset: () => {
        // remove active classes
        slide_items.forEach(
            slide_item => slide_item.classList.remove('active')
        )

        controls.forEach(
            control => control.classList.remove('active')
        )
    }
}
slider.init();

